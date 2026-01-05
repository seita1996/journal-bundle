import { TFile } from "obsidian";

export interface DailyEntry {
  file: TFile;
  date: string;
  content: string;
}

export interface LinkedEntry {
  file: TFile;
  content: string;
  referencedBy: Set<string>;
}

export interface BundleStats {
  totalDaily: number;
  totalLinked: number;
  includedLinked: number;
  unresolvedCount: number;
  truncated: boolean;
  limitedByMaxLinked: boolean;
  approxChars: number;
}

export interface BundleRange {
  from: string;
  to: string;
}
