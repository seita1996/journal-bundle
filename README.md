# Journal Bundle (Obsidian Plugin)

Bundle a date range of daily notes and their linked notes into a single markdown file.

## Commands

- `Export Diary Range Bundle...`: pick From/To dates (YYYY-MM-DD) and export.
- `Export Last N Days Bundle...`: choose a preset or type a number of days and export.

## Output

The bundle is written to the configured export folder with a name like:

```
DiaryBundle_YYYY-MM-DD_to_YYYY-MM-DD.md
```

A numeric suffix is added if a file already exists.

## Settings

- **Daily folder**: Folder containing `YYYY-MM-DD.md` daily notes. Default: `Daily/`
- **Export folder**: Output folder. Default: `Exports/`
- **Include linked notes**: Toggle linked-note collection
- **Link depth**: MVP supports depth 1 only
- **Exclude folders**: Comma-separated path prefixes to skip
- **Exclude tags**: Comma-separated tags to skip (frontmatter + inline)
- **Exclude patterns**: Regex patterns applied to file paths
- **Strip frontmatter**: Remove YAML frontmatter in output
- **Max linked notes**: Hard cap for linked notes
- **Max characters**: Stop adding linked notes if the output would exceed this
- **Show unresolved links**: Add an unresolved links section

## Notes

- Only `YYYY-MM-DD.md` filenames inside the daily folder are treated as daily notes.
- Link collection uses Obsidian's metadata cache (outgoing links only).
