#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'vault');
const args = process.argv.slice(2);

let folder = null;
let recentDays = null;

const recentIdx = args.indexOf('--recent');
if (recentIdx !== -1 && args[recentIdx + 1]) {
	recentDays = parseInt(args[recentIdx + 1], 10);
	args.splice(recentIdx, 2);
}

if (args[0] && !args[0].startsWith('-')) {
	folder = args[0];
}

if (!fs.existsSync(vaultPath)) {
	console.error(`Vault not found at: ${vaultPath}`);
	process.exit(1);
}

const searchRoot = folder ? path.join(vaultPath, folder) : vaultPath;

if (!fs.existsSync(searchRoot)) {
	console.error(`Folder not found: ${folder}`);
	process.exit(1);
}

const notes = [];
const cutoff = recentDays ? Date.now() - recentDays * 24 * 60 * 60 * 1000 : null;

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
		} else if (entry.name.endsWith('.md')) {
			const stat = fs.statSync(full);
			if (cutoff && stat.mtimeMs < cutoff) continue;
			notes.push({
				path: path.relative(vaultPath, full),
				modified: stat.mtime.toISOString().slice(0, 10),
				size: stat.size,
			});
		}
	}
}

walk(searchRoot);
notes.sort((a, b) => b.modified.localeCompare(a.modified));

if (notes.length === 0) {
	console.log(recentDays
		? `No notes modified in the last ${recentDays} days.`
		: `No notes found${folder ? ` in ${folder}` : ''}.`);
	process.exit(0);
}

const label = folder ? `in ${folder}` : 'in vault';
const timeLabel = recentDays ? ` (last ${recentDays} days)` : '';
console.log(`${notes.length} note(s) ${label}${timeLabel}:\n`);

for (const n of notes) {
	console.log(`  ${n.modified}  ${n.path}  (${n.size}b)`);
}
