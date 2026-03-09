---
name: obsidian
description: Read, write, search, and manage notes in an Obsidian vault. Use for persistent memory, storing findings, logging research, and retrieving past knowledge across agent sessions.
---

# Obsidian Vault

Read and write markdown notes in an Obsidian-compatible vault. This gives the agent persistent memory that survives across jobs — store findings, research, trade notes, and any knowledge that should be recalled in future sessions.

## Setup

Set the vault path in your environment (defaults to `vault/` in the project root):

```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/vault"
```

Or create the default vault directory in the project root:

```bash
mkdir -p vault
```

## Commands

### Read a note
```bash
/job/.pi/skills/obsidian/read.js "folder/note-title"     # Read by path (no .md extension needed)
/job/.pi/skills/obsidian/read.js "note-title"            # Search root of vault
```

### Write / create a note
```bash
/job/.pi/skills/obsidian/write.js "folder/note-title" "# Note Title\n\nContent here."
/job/.pi/skills/obsidian/write.js "folder/note-title" --file /tmp/content.md    # From file
```

### Append to a note
```bash
/job/.pi/skills/obsidian/append.js "folder/note-title" "New content to add."
/job/.pi/skills/obsidian/append.js "daily/2026-03-06" "## Evening Update\n\nMarket closed flat."
```

### Search notes (text)
```bash
/job/.pi/skills/obsidian/search.js "query"              # Search titles and content
/job/.pi/skills/obsidian/search.js "query" --title      # Search titles only
/job/.pi/skills/obsidian/search.js "query" -n 10        # More results (default: 5)
```

### Semantic search (vector similarity)
```bash
/job/.pi/skills/obsidian/semantic-search.js "query"          # Find conceptually related notes
/job/.pi/skills/obsidian/semantic-search.js "query" --top 10 # More results (default: 5)
```
Uses OpenAI `text-embedding-3-small`. Run `embed.js` first to build the index.

### Build / update embeddings index
```bash
/job/.pi/skills/obsidian/embed.js          # Re-embed only changed notes
/job/.pi/skills/obsidian/embed.js --force  # Re-embed all notes
```

### List notes
```bash
/job/.pi/skills/obsidian/list.js                        # List all notes
/job/.pi/skills/obsidian/list.js "folder"              # List notes in a folder
/job/.pi/skills/obsidian/list.js --recent 7             # Notes modified in last 7 days
```

## Output Format

Notes are returned as plain markdown. Metadata includes path, last modified date.

## Tips for Memory Use

- Use `daily/YYYY-MM-DD.md` for daily logs
- Use `memory/` folder for persistent facts the agent should always recall
- Use `trades/` for trade journals
- Use tags (`#important`, `#todo`) to categorize notes for easy searching
