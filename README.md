# Journal Bundle

**Journal Bundle** is an Obsidian plugin that compiles a date range of Daily Notes and their related notes into a **single Markdown file**, optimized for review, archiving, and AI-assisted workflows.

This plugin runs entirely **locally** and never sends your data anywhere.

> Ideal for weekly reviews, journaling, and AI-assisted reflection.

---

## Why Journal Bundle?

- Review a week or month of daily notes in one place
- Create a single Markdown file to feed into ChatGPT / Claude
- Archive context-heavy work logs or journals
- Prepare clean summaries for reflection or reporting

---

## Features

- Export Daily Notes for a specific date range
- Collect notes linked from those Daily Notes (deduplicated)
- Produce a single, well-structured Markdown file
- Clear section boundaries and source annotations
- Hard limits to prevent runaway exports

---

## Commands

- **Export Diary Range Bundle...**  
  Pick a From/To date (YYYY-MM-DD) and export a bundle.

- **Export Last N Days Bundle...**  
  Export the last N days using a preset or custom number.

---

## Output

The bundle is written to the configured export folder with a name like:

`DiaryBundle_YYYY-MM-DD_to_YYYY-MM-DD.md`

If a file already exists, a numeric suffix is added automatically.

The output includes:
- Chronological Daily Notes
- Deduplicated linked notes
- Source annotations (`<!-- source: ... -->`)
- Optional unresolved links section
- Frontmatter metadata (from/to/depth/etc.)

---

## Settings

- **Daily folder**  
  Folder containing `YYYY-MM-DD.md` Daily Notes  
  *(default: `Daily/`)*

- **Export folder**  
  Folder where bundled files are created  
  *(default: `Exports/`)*

- **Include linked notes**  
  Toggle collection of linked notes

- **Link depth**  
  Current version supports depth 1 (Daily → linked notes)

- **Exclude folders**  
  Comma-separated path prefixes to skip

- **Exclude tags**  
  Comma-separated tags to skip (frontmatter and inline)

- **Exclude patterns**  
  Regular expressions applied to file paths

- **Strip frontmatter**  
  Remove YAML frontmatter from exported content

- **Max linked notes**  
  Hard cap to prevent excessive exports

- **Max characters**  
  Stop adding linked notes once the output would exceed this limit

- **Show unresolved links**  
  Add a section listing unresolved links (optional)

---

## Notes & Limitations

- Only files named `YYYY-MM-DD.md` inside the Daily folder are treated as Daily Notes.
- Linked note collection uses Obsidian’s metadata cache (outgoing links only).
- Embedded files and attachments are not included.
- Designed for deterministic, local-only operation.

---

## Requirements

- **Obsidian v1.5.0 or later**

---

## Privacy & Safety

- No network access
- No analytics
- No data leaves your vault

---

## License

MIT
