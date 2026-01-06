import { App, Modal, Setting, Notice } from "obsidian";
import moment from "../utils/moment";

export class DateRangeModal extends Modal {
  private onSubmit: (from: string, to: string) => void | Promise<void>;
  private fromValue: string = "";
  private toValue: string = "";

  constructor(app: App, onSubmit: (from: string, to: string) => void | Promise<void>) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Export diary range" });

    new Setting(contentEl)
      .setName("Start date")
      .setDesc("Use yyyy-mm-dd.")
      .addText((text) => {
        text.setPlaceholder("2026-01-01").onChange((value) => {
          this.fromValue = value.trim();
        });
      });

    new Setting(contentEl)
      .setName("End date")
      .setDesc("Use yyyy-mm-dd.")
      .addText((text) => {
        text.setPlaceholder("2026-01-07").onChange((value) => {
          this.toValue = value.trim();
        });
      });

    new Setting(contentEl)
      .addButton((button) =>
        button.setButtonText("Export").setCta().onClick(async () => {
          const from = this.fromValue;
          const to = this.toValue;

          if (!moment(from, "YYYY-MM-DD", true).isValid()) {
            new Notice("Invalid start date. Use yyyy-mm-dd.");
            return;
          }
          if (!moment(to, "YYYY-MM-DD", true).isValid()) {
            new Notice("Invalid end date. Use yyyy-mm-dd.");
            return;
          }
          if (from > to) {
            new Notice("Start date must be before or equal to end date.");
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
}
