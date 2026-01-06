import { App, PluginSettingTab, Setting } from "obsidian";
import JournalBundlePlugin from "./main";

export interface JournalBundleSettings {
  dailyFolder: string;
  exportFolder: string;
  includeLinkedNotes: boolean;
  depth: number;
  excludeFolders: string[];
  excludeTags: string[];
  excludePatterns: string[];
  stripFrontmatter: boolean;
  maxLinkedNotes: number;
  maxChars: number;
  showUnresolvedLinks: boolean;
}

export const DEFAULT_SETTINGS: JournalBundleSettings = {
  dailyFolder: "Daily/",
  exportFolder: "Exports/",
  includeLinkedNotes: true,
  depth: 1,
  excludeFolders: ["Templates/", "Attachments/"],
  excludeTags: [],
  excludePatterns: [],
  stripFrontmatter: true,
  maxLinkedNotes: 200,
  maxChars: 300000,
  showUnresolvedLinks: false,
};

function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export class JournalBundleSettingTab extends PluginSettingTab {
  plugin: JournalBundlePlugin;

  constructor(app: App, plugin: JournalBundlePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    ;

    new Setting(containerEl)
      .setName("Daily folder")
      .setDesc("Only yyyy-mm-dd.md files under this folder are treated as daily notes.")
      .addText((text) =>
        text
          .setPlaceholder("Daily/")
          .setValue(this.plugin.settings.dailyFolder)
          .onChange(async (value) => {
            this.plugin.settings.dailyFolder = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Export folder")
      .setDesc("Bundled Markdown output is saved here.")
      .addText((text) =>
        text
          .setPlaceholder("Exports/")
          .setValue(this.plugin.settings.exportFolder)
          .onChange(async (value) => {
            this.plugin.settings.exportFolder = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include linked notes")
      .setDesc("When disabled, only daily notes are bundled.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.includeLinkedNotes).onChange(async (value) => {
          this.plugin.settings.includeLinkedNotes = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Link depth")
      .setDesc("Supports depth 1 only. Higher values are ignored.")
      .addText((text) =>
        text
          .setPlaceholder("1")
          .setValue(String(this.plugin.settings.depth))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            this.plugin.settings.depth = Number.isFinite(parsed) ? parsed : 1;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Exclude folders")
      .setDesc("Comma-separated path prefixes to skip.")
      .addTextArea((text) =>
        text
          .setPlaceholder("Example: templates/, attachments/")
          .setValue(this.plugin.settings.excludeFolders.join(", "))
          .onChange(async (value) => {
            this.plugin.settings.excludeFolders = parseCsv(value);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Exclude tags")
      .setDesc("Comma-separated tags to skip (# is optional).")
      .addTextArea((text) =>
        text
          .setPlaceholder("Example: archived, draft")
          .setValue(this.plugin.settings.excludeTags.join(", "))
          .onChange(async (value) => {
            this.plugin.settings.excludeTags = parseCsv(value);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Exclude patterns")
      .setDesc("Comma-separated regex patterns tested against file paths.")
      .addTextArea((text) =>
        text
          .setPlaceholder("Example: .*private.*, ^scratch/")
          .setValue(this.plugin.settings.excludePatterns.join(", "))
          .onChange(async (value) => {
            this.plugin.settings.excludePatterns = parseCsv(value);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Strip frontmatter")
      .setDesc("Remove YAML frontmatter from bundled content.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.stripFrontmatter).onChange(async (value) => {
          this.plugin.settings.stripFrontmatter = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Max linked notes")
      .setDesc("Stops adding linked notes after this count.")
      .addText((text) =>
        text
          .setPlaceholder("200")
          .setValue(String(this.plugin.settings.maxLinkedNotes))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            this.plugin.settings.maxLinkedNotes = Number.isFinite(parsed) ? parsed : 200;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max characters")
      .setDesc("Stops adding linked notes if the bundle would exceed this size.")
      .addText((text) =>
        text
          .setPlaceholder("300000")
          .setValue(String(this.plugin.settings.maxChars))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            this.plugin.settings.maxChars = Number.isFinite(parsed) ? parsed : 300000;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show unresolved links")
      .setDesc("Add a section listing unresolved outgoing links.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showUnresolvedLinks).onChange(async (value) => {
          this.plugin.settings.showUnresolvedLinks = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
