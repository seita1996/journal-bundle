import { moment as obsidianMoment } from "obsidian";

export interface MomentLike {
  isValid(): boolean;
  format(format?: string): string;
  startOf(unit: string): MomentLike;
  clone(): MomentLike;
  subtract(amount: number, unit: string): MomentLike;
}

type MomentFactory = {
  (): MomentLike;
  (input: string, format: string, strict?: boolean): MomentLike;
  (input: Date): MomentLike;
  (input: number): MomentLike;
};

const moment = obsidianMoment as unknown as MomentFactory;

export default moment;
