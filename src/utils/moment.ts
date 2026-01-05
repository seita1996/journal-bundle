import { moment as obsidianMoment } from "obsidian";
import type momentType from "moment";

type MomentFactory = typeof momentType;

const moment = obsidianMoment as unknown as MomentFactory;

export default moment;
