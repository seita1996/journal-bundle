/* Journal Bundle */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => JournalBundlePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  dailyFolder: "Daily/",
  exportFolder: "Exports/",
  includeLinkedNotes: true,
  depth: 1,
  excludeFolders: ["Templates/", "Attachments/"],
  excludeTags: [],
  excludePatterns: [],
  stripFrontmatter: true,
  maxLinkedNotes: 200,
  maxChars: 3e5,
  showUnresolvedLinks: false
};
function parseCsv(value) {
  return value.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
}
var JournalBundleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Journal Bundle Settings" });
    new import_obsidian.Setting(containerEl).setName("Daily folder").setDesc("Only YYYY-MM-DD.md files under this folder are treated as daily notes.").addText(
      (text) => text.setPlaceholder("Daily/").setValue(this.plugin.settings.dailyFolder).onChange(async (value) => {
        this.plugin.settings.dailyFolder = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Export folder").setDesc("Bundled markdown output is saved here.").addText(
      (text) => text.setPlaceholder("Exports/").setValue(this.plugin.settings.exportFolder).onChange(async (value) => {
        this.plugin.settings.exportFolder = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Include linked notes").setDesc("When disabled, only daily notes are bundled.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeLinkedNotes).onChange(async (value) => {
        this.plugin.settings.includeLinkedNotes = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Link depth").setDesc("MVP supports depth 1 only. Higher values are ignored.").addText(
      (text) => text.setPlaceholder("1").setValue(String(this.plugin.settings.depth)).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        this.plugin.settings.depth = Number.isFinite(parsed) ? parsed : 1;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Exclude folders").setDesc("Comma-separated path prefixes to skip.").addTextArea(
      (text) => text.setPlaceholder("Templates/, Attachments/").setValue(this.plugin.settings.excludeFolders.join(", ")).onChange(async (value) => {
        this.plugin.settings.excludeFolders = parseCsv(value);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Exclude tags").setDesc("Comma-separated tags to skip (# is optional).").addTextArea(
      (text) => text.setPlaceholder("archived, draft").setValue(this.plugin.settings.excludeTags.join(", ")).onChange(async (value) => {
        this.plugin.settings.excludeTags = parseCsv(value);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Exclude patterns").setDesc("Comma-separated regex patterns tested against file paths.").addTextArea(
      (text) => text.setPlaceholder(".*private.*, ^Scratch/").setValue(this.plugin.settings.excludePatterns.join(", ")).onChange(async (value) => {
        this.plugin.settings.excludePatterns = parseCsv(value);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Strip frontmatter").setDesc("Remove YAML frontmatter from bundled content.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.stripFrontmatter).onChange(async (value) => {
        this.plugin.settings.stripFrontmatter = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Max linked notes").setDesc("Stops adding linked notes after this count.").addText(
      (text) => text.setPlaceholder("200").setValue(String(this.plugin.settings.maxLinkedNotes)).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        this.plugin.settings.maxLinkedNotes = Number.isFinite(parsed) ? parsed : 200;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Max characters").setDesc("Stops adding linked notes if the bundle would exceed this size.").addText(
      (text) => text.setPlaceholder("300000").setValue(String(this.plugin.settings.maxChars)).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        this.plugin.settings.maxChars = Number.isFinite(parsed) ? parsed : 3e5;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show unresolved links").setDesc("Add a section listing unresolved outgoing links.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showUnresolvedLinks).onChange(async (value) => {
        this.plugin.settings.showUnresolvedLinks = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/ui/DateRangeModal.ts
var import_obsidian3 = require("obsidian");

// src/utils/moment.ts
var import_obsidian2 = require("obsidian");
var moment = import_obsidian2.moment;
var moment_default = moment;

// src/ui/DateRangeModal.ts
var DateRangeModal = class extends import_obsidian3.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.fromValue = "";
    this.toValue = "";
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Export diary range" });
    new import_obsidian3.Setting(contentEl).setName("From").setDesc("YYYY-MM-DD").addText((text) => {
      text.setPlaceholder("2026-01-01").onChange((value) => {
        this.fromValue = value.trim();
      });
    });
    new import_obsidian3.Setting(contentEl).setName("To").setDesc("YYYY-MM-DD").addText((text) => {
      text.setPlaceholder("2026-01-07").onChange((value) => {
        this.toValue = value.trim();
      });
    });
    new import_obsidian3.Setting(contentEl).addButton(
      (button) => button.setButtonText("Export").setCta().onClick(async () => {
        const from = this.fromValue;
        const to = this.toValue;
        if (!moment_default(from, "YYYY-MM-DD", true).isValid()) {
          new import_obsidian3.Notice("Invalid From date. Use YYYY-MM-DD.");
          return;
        }
        if (!moment_default(to, "YYYY-MM-DD", true).isValid()) {
          new import_obsidian3.Notice("Invalid To date. Use YYYY-MM-DD.");
          return;
        }
        if (from > to) {
          new import_obsidian3.Notice("From date must be before or equal to To date.");
          return;
        }
        this.close();
        await this.onSubmit(from, to);
      })
    );
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/ui/LastNDaysModal.ts
var import_obsidian4 = require("obsidian");
var PRESETS = [7, 14, 30];
var LastNDaysModal = class extends import_obsidian4.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.daysValue = PRESETS[0];
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Export last N days" });
    let inputEl;
    new import_obsidian4.Setting(contentEl).setName("Days").setDesc("Use a preset or type a number.").addText((text) => {
      inputEl = text.inputEl;
      text.setValue(String(this.daysValue)).onChange((value) => {
        const parsed = Number.parseInt(value.trim(), 10);
        this.daysValue = Number.isFinite(parsed) ? parsed : 0;
      });
    });
    const presetRow = contentEl.createDiv({ cls: "journal-bundle-presets" });
    PRESETS.forEach((days) => {
      const button = presetRow.createEl("button", { text: String(days) });
      button.addEventListener("click", () => {
        this.daysValue = days;
        inputEl.value = String(days);
      });
    });
    new import_obsidian4.Setting(contentEl).addButton(
      (button) => button.setButtonText("Export").setCta().onClick(async () => {
        if (!Number.isFinite(this.daysValue) || this.daysValue <= 0) {
          new import_obsidian4.Notice("Please enter a valid number of days.");
          return;
        }
        this.close();
        await this.onSubmit(this.daysValue);
      })
    );
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/bundle/exporter.ts
var import_obsidian5 = require("obsidian");

// src/bundle/daily.ts
function normalizeFolderPrefix(folder) {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}
function isValidDateString(dateStr) {
  return moment_default(dateStr, "YYYY-MM-DD", true).isValid();
}
function listDailyFiles(app, settings, range, isExcluded) {
  const dailyPrefix = normalizeFolderPrefix(settings.dailyFolder);
  const files = app.vault.getMarkdownFiles();
  const matches = [];
  for (const file of files) {
    if (dailyPrefix && !file.path.startsWith(dailyPrefix)) {
      continue;
    }
    const basename = file.basename;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(basename)) {
      continue;
    }
    if (!isValidDateString(basename)) {
      continue;
    }
    if (basename < range.from || basename > range.to) {
      continue;
    }
    if (isExcluded(file)) {
      continue;
    }
    matches.push({ file, date: basename });
  }
  matches.sort((a, b) => a.date.localeCompare(b.date));
  return matches;
}

// src/bundle/filters.ts
function normalizeFolderPrefix2(folder) {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}
function normalizeTag(tag) {
  return tag.trim().replace(/^#/, "").toLowerCase();
}
function extractFrontmatterTags(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "object") {
    return [];
  }
  const record = frontmatter;
  const tagsValue = record.tags;
  if (!tagsValue) {
    return [];
  }
  if (Array.isArray(tagsValue)) {
    return tagsValue.map((tag) => String(tag));
  }
  if (typeof tagsValue === "string") {
    return tagsValue.split(/[,\s]+/).filter((tag) => tag.length > 0);
  }
  return [];
}
function extractInlineTags(cache) {
  if (!(cache == null ? void 0 : cache.tags)) {
    return [];
  }
  return cache.tags.map((tag) => tag.tag.replace(/^#/, ""));
}
function compileExcludePatterns(patterns) {
  const regexes = [];
  const invalid = [];
  for (const pattern of patterns) {
    if (!pattern) {
      continue;
    }
    try {
      regexes.push(new RegExp(pattern));
    } catch (error) {
      invalid.push(pattern);
    }
  }
  return { regexes, invalid };
}
function shouldExcludeFile(file, cache, settings, excludeRegexes) {
  const path = file.path;
  for (const folder of settings.excludeFolders) {
    const prefix = normalizeFolderPrefix2(folder);
    if (prefix && path.startsWith(prefix)) {
      return true;
    }
  }
  for (const regex of excludeRegexes) {
    if (regex.test(path)) {
      return true;
    }
  }
  if (settings.excludeTags.length > 0) {
    const excludeTags = new Set(settings.excludeTags.map(normalizeTag));
    const frontmatterTags = extractFrontmatterTags(cache == null ? void 0 : cache.frontmatter).map(normalizeTag);
    const inlineTags = extractInlineTags(cache).map(normalizeTag);
    const allTags = /* @__PURE__ */ new Set([...frontmatterTags, ...inlineTags]);
    for (const tag of allTags) {
      if (excludeTags.has(tag)) {
        return true;
      }
    }
  }
  return false;
}
function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "");
}

// src/bundle/links.ts
function getOutgoingLinks(app, file) {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    return [];
  }
  const links = [];
  if (cache.links) {
    for (const link of cache.links) {
      links.push(link.link);
    }
  }
  if (cache.embeds) {
    for (const embed of cache.embeds) {
      links.push(embed.link);
    }
  }
  return links;
}
function resolveLink(app, linkText, sourcePath) {
  var _a;
  return (_a = app.metadataCache.getFirstLinkpathDest(linkText, sourcePath)) != null ? _a : null;
}

// src/bundle/formatter.ts
function formatSourceComment(file, referencedBy) {
  if (!referencedBy || referencedBy.size === 0) {
    return `<!-- source: ${file.path} -->`;
  }
  return `<!-- source: ${file.path} | referencedBy: ${[...referencedBy].join(", ")} -->`;
}
function buildBundleHeader(settings, range, includeLinkedNotes) {
  const createdAt = moment_default().format("YYYY-MM-DDTHH:mm:ssZ");
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
    ""
  ].join("\n");
}
function buildDailySection(entries) {
  const lines = [];
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
function buildLinkedEntryBlock(entry) {
  const lines = [];
  lines.push(`### [[${entry.file.path}]]`);
  lines.push(formatSourceComment(entry.file, entry.referencedBy));
  lines.push("");
  lines.push(entry.content.trimEnd());
  return lines.join("\n");
}
function buildUnresolvedSection(unresolved) {
  const lines = [];
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
function buildStatsSection(stats) {
  const lines = [];
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

// src/bundle/exporter.ts
function normalizeFolderPath(folder) {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/+$/, "");
}
async function ensureFolderExists(app, folder) {
  const normalized = normalizeFolderPath(folder);
  if (!normalized) {
    return;
  }
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (!existing) {
    await app.vault.createFolder(normalized);
  }
}
async function getAvailablePath(app, folder, baseName) {
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
function validateRange(range) {
  return moment_default(range.from, "YYYY-MM-DD", true).isValid() && moment_default(range.to, "YYYY-MM-DD", true).isValid() && range.from <= range.to;
}
function blockMetrics(block) {
  const lines = block.split("\n");
  const length = lines.reduce((sum, line) => sum + line.length, 0);
  return { length, lines: lines.length };
}
async function exportDiaryBundle(app, settings, range) {
  if (!validateRange(range)) {
    new import_obsidian5.Notice("Invalid date range. Use YYYY-MM-DD.");
    return;
  }
  const includeLinkedNotes = settings.includeLinkedNotes;
  if (settings.depth !== 1) {
    new import_obsidian5.Notice("Link depth > 1 is not supported yet. Using depth 1.");
  }
  const { regexes, invalid } = compileExcludePatterns(settings.excludePatterns);
  if (invalid.length > 0) {
    new import_obsidian5.Notice(`Invalid excludePatterns: ${invalid.join(", ")}`);
  }
  const isExcluded = (file) => shouldExcludeFile(file, app.metadataCache.getFileCache(file), settings, regexes);
  const dailyMatches = listDailyFiles(app, settings, range, isExcluded);
  if (dailyMatches.length === 0) {
    new import_obsidian5.Notice("No daily notes found in range. Creating empty bundle.");
  }
  const dailyEntries = [];
  const dailyPaths = /* @__PURE__ */ new Set();
  for (const match of dailyMatches) {
    const raw = await app.vault.read(match.file);
    const content = settings.stripFrontmatter ? stripFrontmatter(raw) : raw;
    dailyEntries.push({ file: match.file, date: match.date, content });
    dailyPaths.add(match.file.path);
  }
  const linkedMap = /* @__PURE__ */ new Map();
  const unresolvedLinks = /* @__PURE__ */ new Set();
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
          linkedMap.set(resolved.path, { file: resolved, referencedBy: /* @__PURE__ */ new Set([entry.file.path]) });
        }
      }
    }
  }
  let linkedEntries = [];
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
  const pieces = [];
  let totalLineLength = 0;
  let lineCount = 0;
  const appendBlock = (block) => {
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
    const linkedLines = [];
    let linkedLength = 0;
    let linkedLinesCount = 0;
    const addLinkedLines = (lines) => {
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
  const stats = {
    totalDaily: dailyEntries.length,
    totalLinked: linkedMap.size,
    includedLinked,
    unresolvedCount: unresolvedLinks.size,
    truncated,
    limitedByMaxLinked,
    approxChars: currentLength()
  };
  appendBlock(buildStatsSection(stats));
  const output = pieces.join("\n");
  await ensureFolderExists(app, settings.exportFolder);
  const filename = `DiaryBundle_${range.from}_to_${range.to}.md`;
  const path = await getAvailablePath(app, settings.exportFolder, filename);
  try {
    const created = await app.vault.create(path, output);
    await app.workspace.getLeaf(true).openFile(created);
    new import_obsidian5.Notice("Diary bundle exported.");
  } catch (error) {
    console.error(error);
    new import_obsidian5.Notice("Failed to export diary bundle. See console for details.");
  }
}

// src/main.ts
var JournalBundlePlugin = class extends import_obsidian6.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new JournalBundleSettingTab(this.app, this));
    this.addCommand({
      id: "export-diary-range-bundle",
      name: "Export Diary Range Bundle...",
      callback: () => {
        new DateRangeModal(this.app, async (from, to) => {
          await exportDiaryBundle(this.app, this.settings, { from, to });
        }).open();
      }
    });
    this.addCommand({
      id: "export-last-n-days-bundle",
      name: "Export Last N Days Bundle...",
      callback: () => {
        new LastNDaysModal(this.app, async (days) => {
          const today = moment_default().startOf("day");
          const from = today.clone().subtract(days - 1, "days");
          await exportDiaryBundle(this.app, this.settings, {
            from: from.format("YYYY-MM-DD"),
            to: today.format("YYYY-MM-DD")
          });
        }).open();
      }
    });
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
