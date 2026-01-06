import { App, Notice, TFile } from "obsidian";
import { JournalBundleSettings } from "../settings";
import { listDailyFiles } from "./daily";
import { compileExcludePatterns, shouldExcludeFile, stripFrontmatter } from "./filters";
import { getOutgoingLinks, resolveLink } from "./links";
import {
  buildBundleHeader,
  buildDailySection,
  buildLinkedEntryBlock,
  buildStatsSection,
  buildUnresolvedSection,
} from "./formatter";
import { BundleStats, DailyEntry, LinkedEntry, BundleRange } from "./types";
import moment from "../utils/moment";

function normalizeFolderPath(folder: string): string {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/+$/, "");
}

async function ensureFolderExists(app: App, folder: string): Promise<void> {
  const normalized = normalizeFolderPath(folder);
  if (!normalized) {
    return;
  }
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (!existing) {
    await app.vault.createFolder(normalized);
  }
}

async function getAvailablePath(app: App, folder: string, baseName: string): Promise<string> {
  const normalized = normalizeFolderPath(folder);
  const prefix = normalized ? `${normalized}/` : "";
  const basePath = `${prefix}${baseName}`;
  if (!app.vault.getAbstractFileByPath(basePath)) {
    return basePath;
  }
  let index = 1;
  while (true) {
    const candidate = `${prefix}${baseName.replace(/\.md$/, "")} (${index}).md`;
    if (!app.vault.getAbstractFileByPath(candidate)) {
      return candidate;
    }
    index += 1;
  }
}

function validateRange(range: BundleRange): boolean {
  return moment(range.from, "YYYY-MM-DD", true).isValid() &&
    moment(range.to, "YYYY-MM-DD", true).isValid() &&
    range.from <= range.to;
}

function blockMetrics(block: string): { length: number; lines: number } {
  const lines = block.split("\n");
  const length = lines.reduce((sum, line) => sum + line.length, 0);
  return { length, lines: lines.length };
}

export async function exportDiaryBundle(
  app: App,
  settings: JournalBundleSettings,
  range: BundleRange
): Promise<void> {
  if (!validateRange(range)) {
    new Notice("Invalid date range. Use YYYY-MM-DD.");
    return;
  }

  const includeLinkedNotes = settings.includeLinkedNotes;
  if (settings.depth !== 1) {
    new Notice("Link depth > 1 is not supported yet. Using depth 1.");
  }
  const { regexes, invalid } = compileExcludePatterns(settings.excludePatterns);
  if (invalid.length > 0) {
    new Notice(`Invalid excludePatterns: ${invalid.join(", ")}`);
  }

  const isExcluded = (file: TFile) =>
    shouldExcludeFile(file, app.metadataCache.getFileCache(file), settings, regexes);

  const dailyMatches = listDailyFiles(app, settings, range, isExcluded);
  if (dailyMatches.length === 0) {
    new Notice("No daily notes found in range. Creating empty bundle.");
  }

  const dailyEntries: DailyEntry[] = [];
  const dailyPaths = new Set<string>();

  for (const match of dailyMatches) {
    const raw = await app.vault.read(match.file);
    const content = settings.stripFrontmatter ? stripFrontmatter(raw) : raw;
    dailyEntries.push({ file: match.file, date: match.date, content });
    dailyPaths.add(match.file.path);
  }

  const linkedMap = new Map<string, { file: TFile; referencedBy: Set<string> }>();
  const unresolvedLinks = new Set<string>();

  if (includeLinkedNotes) {
    for (const entry of dailyEntries) {
      const links = getOutgoingLinks(app, entry.file);
      for (const linkText of links) {
        const resolved = resolveLink(app, linkText, entry.file.path);
        if (!resolved) {
          unresolvedLinks.add(linkText);
          continue;
        }
        if (dailyPaths.has(resolved.path)) {
          continue;
        }
        if (isExcluded(resolved)) {
          continue;
        }
        const existing = linkedMap.get(resolved.path);
        if (existing) {
          existing.referencedBy.add(entry.file.path);
        } else {
          linkedMap.set(resolved.path, { file: resolved, referencedBy: new Set([entry.file.path]) });
        }
      }
    }
  }

  let linkedEntries: LinkedEntry[] = [];
  let limitedByMaxLinked = false;

  if (includeLinkedNotes) {
    const sorted = [...linkedMap.values()].sort((a, b) => {
      const byCount = b.referencedBy.size - a.referencedBy.size;
      if (byCount !== 0) {
        return byCount;
      }
      return a.file.basename.localeCompare(b.file.basename);
    });

    if (sorted.length > settings.maxLinkedNotes) {
      limitedByMaxLinked = true;
    }

    const limited = sorted.slice(0, settings.maxLinkedNotes);
    linkedEntries = await Promise.all(
      limited.map(async (entry) => {
        const raw = await app.vault.read(entry.file);
        const content = settings.stripFrontmatter ? stripFrontmatter(raw) : raw;
        return { file: entry.file, content, referencedBy: entry.referencedBy };
      })
    );
  }

  const header = buildBundleHeader(settings, range, includeLinkedNotes);
  const title = `# Diary Bundle: ${range.from} to ${range.to}`;
  const dailySection = buildDailySection(dailyEntries);

  const pieces: string[] = [];
  let totalLineLength = 0;
  let lineCount = 0;

  const appendBlock = (block: string) => {
    const metrics = blockMetrics(block);
    totalLineLength += metrics.length;
    lineCount += metrics.lines;
    pieces.push(block);
  };

  const currentLength = () => totalLineLength + (lineCount > 0 ? lineCount - 1 : 0);

  appendBlock(header);
  appendBlock(title);
  appendBlock("");
  appendBlock(dailySection);
  appendBlock("");

  let truncated = false;
  let includedLinked = 0;
  let linkedSection = "";

  if (includeLinkedNotes) {
    const linkedLines: string[] = [];
    let linkedLength = 0;
    let linkedLinesCount = 0;

    const addLinkedLines = (lines: string[]) => {
      for (const line of lines) {
        linkedLines.push(line);
        linkedLength += line.length;
        linkedLinesCount += 1;
      }
    };

    addLinkedLines(["## Linked Notes (deduped)", ""]);

    for (const entry of linkedEntries) {
      const block = buildLinkedEntryBlock(entry);
      const metrics = blockMetrics(block);
      const addedLength = metrics.length;
      const addedLines = metrics.lines + 1;
      const potentialLength = linkedLength + addedLength;
      const potentialLines = linkedLinesCount + addedLines;
      if (currentLength() + potentialLength + potentialLines > settings.maxChars) {
        truncated = true;
        break;
      }
      addLinkedLines([...block.split("\n"), ""]);
      includedLinked += 1;
    }

    if (includedLinked === 0) {
      if (linkedMap.size === 0) {
        addLinkedLines(["_No linked notes collected._", ""]);
      } else if (truncated) {
        addLinkedLines(["_Linked notes omitted due to size limit._", ""]);
      } else {
        addLinkedLines(["_No linked notes collected._", ""]);
      }
    }

    linkedSection = linkedLines.join("\n");
    appendBlock(linkedSection);
    appendBlock("");
  }

  if (settings.showUnresolvedLinks) {
    appendBlock(buildUnresolvedSection(unresolvedLinks));
    appendBlock("");
  }

  const stats: BundleStats = {
    totalDaily: dailyEntries.length,
    totalLinked: linkedMap.size,
    includedLinked,
    unresolvedCount: unresolvedLinks.size,
    truncated,
    limitedByMaxLinked,
    approxChars: currentLength(),
  };

  appendBlock(buildStatsSection(stats));

  const output = pieces.join("\n");

  await ensureFolderExists(app, settings.exportFolder);

  const filename = `DiaryBundle_${range.from}_to_${range.to}.md`;
  const path = await getAvailablePath(app, settings.exportFolder, filename);

  try {
    const created = await app.vault.create(path, output);
    await app.workspace.getLeaf(true).openFile(created);
    new Notice("Diary bundle exported.");
  } catch (error) {
    console.error(error);
    new Notice("Failed to export diary bundle. See console for details.");
  }
}
