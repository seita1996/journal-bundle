import { Plugin } from "obsidian";
import { JournalBundleSettingTab, JournalBundleSettings, DEFAULT_SETTINGS } from "./settings";
import { DateRangeModal } from "./ui/DateRangeModal";
import { LastNDaysModal } from "./ui/LastNDaysModal";
import { exportDiaryBundle } from "./bundle/exporter";
import moment from "./utils/moment";

export default class JournalBundlePlugin extends Plugin {
  settings!: JournalBundleSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new JournalBundleSettingTab(this.app, this));

    this.addCommand({
      id: "export-diary-range-bundle",
      name: "Export diary range bundle...",
      callback: () => {
        new DateRangeModal(this.app, async (from, to) => {
          await exportDiaryBundle(this.app, this.settings, { from, to });
        }).open();
      },
    });

    this.addCommand({
      id: "export-last-n-days-bundle",
      name: "Export last n days bundle...",
      callback: () => {
        new LastNDaysModal(this.app, async (days) => {
          const today = moment().startOf("day");
          const from = today.clone().subtract(days - 1, "days");
          await exportDiaryBundle(this.app, this.settings, {
            from: from.format("YYYY-MM-DD"),
            to: today.format("YYYY-MM-DD"),
          });
        }).open();
      },
    });
  }

  onunload() {}

  async loadSettings() {
    const data = (await this.loadData()) as Partial<JournalBundleSettings> | null;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
