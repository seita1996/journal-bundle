import { App, TFile } from "obsidian";
import { JournalBundleSettings } from "../settings";
import moment from "../utils/moment";

function normalizeFolderPrefix(folder: string): string {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function isValidDateString(dateStr: string): boolean {
  return moment(dateStr, "YYYY-MM-DD", true).isValid();
}

export function listDailyFiles(
  app: App,
  settings: JournalBundleSettings,
  range: { from: string; to: string },
  isExcluded: (file: TFile) => boolean
): { file: TFile; date: string }[] {
  const dailyPrefix = normalizeFolderPrefix(settings.dailyFolder);
  const files = app.vault.getMarkdownFiles();

  const matches: { file: TFile; date: string }[] = [];

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
