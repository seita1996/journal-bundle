import { TFile } from "obsidian";
import { JournalBundleSettings } from "../settings";
import { BundleStats, DailyEntry, LinkedEntry } from "./types";
import moment from "../utils/moment";

function formatSourceComment(file: TFile, referencedBy?: Set<string>): string {
  if (!referencedBy || referencedBy.size === 0) {
    return `<!-- source: ${file.path} -->`;
  }
  return `<!-- source: ${file.path} | referencedBy: ${[...referencedBy].join(", ")} -->`;
}

export function buildBundleHeader(
  settings: JournalBundleSettings,
  range: { from: string; to: string },
  includeLinkedNotes: boolean
): string {
  const createdAt = moment().format("YYYY-MM-DDTHH:mm:ssZ");
  return [
    "---",
    `from: ${range.from}`,
    `to: ${range.to}`,
    `depth: ${settings.depth}`,
    `includeLinkedNotes: ${includeLinkedNotes}`,
    `createdAt: ${createdAt}`,
    `dailyFolder: ${settings.dailyFolder}`,
    `exportFolder: ${settings.exportFolder}`,
    "---",
    "",
  ].join("\n");
}

export function buildDailySection(entries: DailyEntry[]): string {
  const lines: string[] = [];
  lines.push("## Daily Notes (chronological)");
  lines.push("");

  if (entries.length === 0) {
    lines.push("_No daily notes found for this range._");
    lines.push("");
    return lines.join("\n");
  }

  for (const entry of entries) {
    lines.push(`### ${entry.date} - [[${entry.file.path}]]`);
    lines.push(formatSourceComment(entry.file));
    lines.push("");
    lines.push(entry.content.trimEnd());
    lines.push("");
  }

  return lines.join("\n");
}

export function buildLinkedSection(entries: LinkedEntry[]): string {
  const lines: string[] = [];
  lines.push("## Linked Notes (deduped)");
  lines.push("");

  if (entries.length === 0) {
    lines.push("_No linked notes collected._");
    lines.push("");
    return lines.join("\n");
  }

  for (const entry of entries) {
    lines.push(buildLinkedEntryBlock(entry));
    lines.push("");
  }

  return lines.join("\n");
}

export function buildLinkedEntryBlock(entry: LinkedEntry): string {
  const lines: string[] = [];
  lines.push(`### [[${entry.file.path}]]`);
  lines.push(formatSourceComment(entry.file, entry.referencedBy));
  lines.push("");
  lines.push(entry.content.trimEnd());
  return lines.join("\n");
}

export function buildUnresolvedSection(unresolved: Set<string>): string {
  const lines: string[] = [];
  lines.push("## Unresolved Links");
  lines.push("");
  if (unresolved.size === 0) {
    lines.push("_None._");
    lines.push("");
    return lines.join("\n");
  }

  for (const link of unresolved) {
    lines.push(`- ${link}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function buildStatsSection(stats: BundleStats): string {
  const lines: string[] = [];
  lines.push("## Stats");
  lines.push("");
  lines.push(`- Total daily: ${stats.totalDaily}`);
  lines.push(`- Total linked (resolved): ${stats.totalLinked}`);
  lines.push(`- Linked included: ${stats.includedLinked}`);
  lines.push(`- Unresolved links: ${stats.unresolvedCount}`);
  lines.push(`- Approx chars: ${stats.approxChars}`);
  lines.push(`- Truncated: ${stats.truncated ? "true" : "false"}`);
  lines.push(
    `- Limited by maxLinkedNotes: ${stats.limitedByMaxLinked ? "true" : "false"}`
  );
  lines.push("");
  return lines.join("\n");
}
