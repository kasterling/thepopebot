# PopeBot — Current State & Roadmap

## What PopeBot Is

PopeBot is an autonomous AI agent built on the [thepopebot](https://github.com/stephengpope/thepopebot) framework (v1.2.71). It runs as a Docker container on Keith's local machine, accessible via Telegram and a browser interface. The goal is to evolve it into a full personal AI operating system inspired by OpenClaw.

**Public URL:** `https://nonseclusive-unmeaningfully-gilbert.ngrok-free.dev`
**Local stack:** Docker Compose → Traefik → `thepopebot-event-handler` container → PM2 → Next.js on port 80
**ngrok** tunnels localhost:80 to the public URL
**User GitHub repo:** `kasterling/thepopebot`
**Project path:** `/home/keith/Desktop/Pope_Bot/my-popebot/`

---

## Session Summary (2026-03-05 to 2026-03-07)

### Fixes Applied
- **Tailwind v4 webpack crash fixed** — Added `source(none)` to `@import "tailwindcss"` in `app/globals.css`. The `@tailwindcss/postcss` plugin was crashing webpack with a 169M-element array during auto-scan of node_modules.
- **Production build restored** — Rebuilt `.next/` inside running container. PM2 reloaded.
- **Container stabilized** — Re-enabled `restart=unless-stopped`. Container is healthy.
- **Telegram webhook** — Still registered and working at the public ngrok URL.

### Cron Jobs
All cron jobs have been **disabled** (`enabled: false`) in `config/CRONS.json` to stop burning API tokens. Jobs that were disabled:
- `morning-currency-strength-scan` (9am daily)
- `midday-opportunity-scan` (1pm daily)
- `evening-trade-management` (6pm daily)
- `weekly-performance-review` (7pm Fridays)
- `cleanup-old-briefings` (midnight Sundays)
- `heartbeat` (was already disabled)

### Pi Skills — All Activated
All skills symlinked into `.pi/skills/`. Active skills:

| Skill | Purpose | API Key Needed? |
|-------|---------|-----------------|
| `brave-search` | Web search via Brave API | `BRAVE_API_KEY` |
| `browser-tools` | Chrome automation | No |
| `forex-analysis` | Currency strength/rates | No |
| `gccli` | Google Calendar | Google OAuth |
| `gdcli` | Google Drive | Google OAuth |
| `gmcli` | Gmail | Google OAuth |
| `llm-secrets` | Access stored credentials | No (built-in) |
| `modify-self` | Agent edits own config | No (built-in) |
| `obsidian` | Read/write Obsidian vault | No |
| `send-email` | Send email via Resend | `RESEND_API_KEY` |
| `transcribe` | Speech-to-text via Groq | Groq API key |
| `vscode` | VS Code integration | No |
| `youtube-transcript` | Fetch YT transcripts | No |

### Obsidian Memory Skill (NEW — built this session)
A custom Pi skill for persistent memory across agent sessions.

**Location:** `pi-skills/obsidian/`
**Vault path:** `/home/keith/Desktop/Pope_Bot/my-popebot/vault/`
**Env var:** `OBSIDIAN_VAULT_PATH` (defaults to `./vault` from project root)

Tools:
- `read.js <note-path>` — Read a note
- `write.js <note-path> <content>` — Create/overwrite a note
- `append.js <note-path> <content>` — Append to a note
- `search.js <query>` — Full-text search across vault
- `list.js [folder] [--recent N]` — List notes

Vault structure:
```
vault/
├── memory/          # Persistent facts (about-popebot.md seeded)
├── daily/           # Daily logs and briefings
└── trades/          # (to be created) Trade journal
```

### MCP Servers Installed (Claude Code — Global)
These are available to Claude Code (Ava) in all sessions:

| Server | Command | Purpose |
|--------|---------|---------|
| `jcodemunch` | `uvx jcodemunch-mcp` | Codebase explorer — finds symbols with ~200 tokens vs 40k |
| `notebooklm` | `npx notebooklm-mcp@latest` | Query Google NotebookLM notebooks directly |

To authenticate NotebookLM: say "Log me in to NotebookLM" and it opens a browser for Google auth.

---

## Current LLM Config

In `.env`:
```
LLM_PROVIDER=openai
# LLM_MODEL not set → defaults to gpt-4o (EXPENSIVE)
```

**TODO:** Set `LLM_MODEL=gpt-4o-mini` in `.env` to reduce costs significantly, or switch to `LLM_PROVIDER=anthropic` with `LLM_MODEL=claude-haiku-4-5-20251001`.

---

## Container Management

```bash
# Check status
docker ps --filter name=thepopebot-event-handler

# Rebuild CSS/code after file changes
docker exec -e NODE_OPTIONS=--max-old-space-size=8192 thepopebot-event-handler sh -c "cd /app && npm run build"
docker exec thepopebot-event-handler pm2 reload next

# View logs
docker exec thepopebot-event-handler pm2 logs next --lines 50

# Stop/start
docker stop thepopebot-event-handler
docker start thepopebot-event-handler
```

---

## OpenClaw-Inspired Roadmap

The vision is to evolve PopeBot into a full personal AI operating system. Features to build, roughly in priority order:

### Phase 1 — Foundation
- [ ] **Switch to cheaper LLM** — Set `LLM_MODEL=gpt-4o-mini` or switch to Haiku
- [ ] **RAG/vector memory** — Add vector embeddings to the Obsidian vault for semantic search
- [ ] **Daily morning briefing** — Cron job that sends a daily summary to Telegram (calendar, action items, key updates)
- [ ] **Token/cost tracking** — Log API usage per job so costs are visible

### Phase 2 — Knowledge & CRM
- [ ] **Knowledge base** — URL ingestion pipeline: drop a link in Telegram, it fetches + stores in vault with vector embeddings
- [ ] **Personal CRM** — Ingest Gmail + Google Calendar, build contact profiles in SQLite, natural language queries
- [ ] **Fathom/meeting pipeline** — Ingest meeting transcripts, extract action items, send to Telegram for approval

### Phase 3 — Intelligence Councils
- [ ] **Business advisory council** — Parallel AI experts analyze business data nightly, deliver ranked recommendations to Telegram
- [ ] **Security council** — Nightly codebase security review, numbered findings delivered to Telegram
- [ ] **Platform council** — Check for documentation drift, log health, backup status

### Phase 4 — Automation
- [ ] **Social media tracking** — Daily snapshots of YouTube/X/Instagram performance into SQLite
- [ ] **Video idea pipeline** — Slack/Telegram trigger → research → outline → Asana card
- [ ] **Backup system** — Hourly encrypted SQLite backup to Google Drive + git autosync
- [ ] **Self-updating** — Nightly check for `thepopebot` package updates, notify via Telegram

### Phase 5 — Quality of Life
- [ ] **Image/video generation** — Integrate image gen API (e.g., Replicate, Fal.ai)
- [ ] **Food/health journal** — Photo-based food logging with pattern analysis
- [ ] **Security hardening** — Prompt injection defense, permission restrictions, secret redaction

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `config/SOUL.md` | Agent personality and identity |
| `config/EVENT_HANDLER.md` | Event handler LLM system prompt |
| `config/CRONS.json` | Scheduled jobs (all currently disabled) |
| `config/TRIGGERS.json` | Webhook trigger definitions |
| `app/globals.css` | Global styles — has `source(none)` fix |
| `postcss.config.mjs` | PostCSS config with `@tailwindcss/postcss` |
| `.env` | API keys and tokens |
| `vault/` | Obsidian memory vault |
| `pi-skills/obsidian/` | Custom-built Obsidian Pi skill |
| `.pi/skills/` | Active Pi skill symlinks |
| `docker-compose.yml` | Container orchestration |

---

## Known Issues / Notes

- **ngrok URL changes** on restart — if bot stops responding, check ngrok and re-register Telegram webhook via `/api/telegram/register`
- **`next-themes`** is installed in the container's anonymous volume (not in package.json as a proper dep) — if container is removed and recreated, run `docker exec thepopebot-event-handler npm install next-themes --no-save`
- **`rebuild-event-handler.yml`** is NOT in `kasterling/thepopebot` remote — manual rebuild required via `docker exec` (see commands above)
- **Root `/home/keith/package-lock.json`** exists — can confuse Next.js workspace detection; `outputFileTracingRoot` in `next.config.mjs` fixes this
