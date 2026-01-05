import { App, TFile } from "obsidian";

export function getOutgoingLinks(app: App, file: TFile): string[] {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    return [];
  }

  const links: string[] = [];
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

export function resolveLink(app: App, linkText: string, sourcePath: string): TFile | null {
  return app.metadataCache.getFirstLinkpathDest(linkText, sourcePath) ?? null;
}
