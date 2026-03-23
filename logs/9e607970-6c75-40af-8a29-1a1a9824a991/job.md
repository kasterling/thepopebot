Scan Gmail for new Fathom meeting notes from the last 24 hours and process any found.

1. Use `gmcli` to search Gmail: `from:fathom OR subject:"Fathom Notes" newer_than:1d`
2. If no matching emails found, exit silently (no Telegram message needed).
3. For each matching email:
   a. Extract the Google Doc URL from the email body.
   b. Use `gdcli` to read the full document content.
   c. Parse: meeting title, date, attendees, key decisions, action items (each with owner and due date if mentioned).
   d. Create `vault/meetings/YYYY-MM-DD-<meeting-slug>.md` with structured content (title, date, attendees list, key decisions, action items checklist).
   e. For each attendee, update their contact profile at `vault/contacts/<FirstLast>.md`:
      - Update `last_contact` date
      - Append meeting entry to `## Interaction Log`: `### YYYY-MM-DD — Meeting: <title>\nAttended along with: [other attendees]. Key decisions: ...`
   f. Send Telegram message with the meeting summary and action item checklist:
      "📋 *Meeting Notes: [title]*\n📅 [date]\n👥 [attendees]\n\n**Action Items:**\n- [ ] [item 1] (owner, due date)\n- [ ] [item 2]..."
4. After processing all meetings, run `OBSIDIAN_VAULT_PATH=/job/vault node .pi/skills/obsidian/embed.js` to update the vector index.
