import { App, Modal, Notice, Setting } from "obsidian";

const PRESETS = [7, 14, 30];

export class LastNDaysModal extends Modal {
  private onSubmit: (days: number) => void | Promise<void>;
  private daysValue: number = PRESETS[0];

  constructor(app: App, onSubmit: (days: number) => void | Promise<void>) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Export last n days" });

    let inputEl: HTMLInputElement;
    new Setting(contentEl)
      .setName("Number of days")
      .setDesc("Use a preset or type a number.")
      .addText((text) => {
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

    new Setting(contentEl)
      .addButton((button) =>
        button.setButtonText("Export").setCta().onClick(async () => {
          if (!Number.isFinite(this.daysValue) || this.daysValue <= 0) {
            new Notice("Please enter a valid number of days.");
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
}
