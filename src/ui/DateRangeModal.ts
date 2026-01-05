import { App, Modal, Setting, Notice, moment } from "obsidian";

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
      .setName("From")
      .setDesc("YYYY-MM-DD")
      .addText((text) => {
        text.setPlaceholder("2026-01-01").onChange((value) => {
          this.fromValue = value.trim();
        });
      });

    new Setting(contentEl)
      .setName("To")
      .setDesc("YYYY-MM-DD")
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
            new Notice("Invalid From date. Use YYYY-MM-DD.");
            return;
          }
          if (!moment(to, "YYYY-MM-DD", true).isValid()) {
            new Notice("Invalid To date. Use YYYY-MM-DD.");
            return;
          }
          if (from > to) {
            new Notice("From date must be before or equal to To date.");
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
