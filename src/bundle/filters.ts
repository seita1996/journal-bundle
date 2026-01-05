import { CachedMetadata, TFile } from "obsidian";
import { JournalBundleSettings } from "../settings";

function normalizeFolderPrefix(folder: string): string {
  const trimmed = folder.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

function extractFrontmatterTags(frontmatter: unknown): string[] {
  if (!frontmatter || typeof frontmatter !== "object") {
    return [];
  }
  const record = frontmatter as Record<string, unknown>;
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

function extractInlineTags(cache?: CachedMetadata | null): string[] {
  if (!cache?.tags) {
    return [];
  }
  return cache.tags.map((tag) => tag.tag.replace(/^#/, ""));
}

export function compileExcludePatterns(patterns: string[]): { regexes: RegExp[]; invalid: string[] } {
  const regexes: RegExp[] = [];
  const invalid: string[] = [];
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

export function shouldExcludeFile(
  file: TFile,
  cache: CachedMetadata | null | undefined,
  settings: JournalBundleSettings,
  excludeRegexes: RegExp[]
): boolean {
  const path = file.path;

  for (const folder of settings.excludeFolders) {
    const prefix = normalizeFolderPrefix(folder);
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
    const frontmatterTags = extractFrontmatterTags(cache?.frontmatter).map(normalizeTag);
    const inlineTags = extractInlineTags(cache).map(normalizeTag);
    const allTags = new Set([...frontmatterTags, ...inlineTags]);
    for (const tag of allTags) {
      if (excludeTags.has(tag)) {
        return true;
      }
    }
  }

  return false;
}

export function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "");
}
