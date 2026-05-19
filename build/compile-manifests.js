#!/usr/bin/env node
/**
 * NEEWE Agent Manifest Compiler (EP-OPUS-1, Sprint 2 v0.1)
 *
 * Reads src/manifests/<archetype>/<name>/manifest.json
 * Emits src/neewe-core/agents/<archetype>/<name>.md (Claude Code sub-agent format)
 *
 * Zero npm deps — uses Node's native JSON.parse and fs. Requires Node 18+ (ESM + node:fs/promises).
 *
 * Usage:
 *   node build/compile-manifests.js          # compile all
 *   node build/compile-manifests.js --check  # validate only (no writes); exit 1 on issues
 *   node build/compile-manifests.js <name>   # compile single agent by name
 *
 * Manifest schema v1: see docs/MANIFEST-SCHEMA.md (or this file's CHECK_AGENT_FIELDS below).
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FW_ROOT = join(__dirname, '..');
const MANIFEST_DIR = join(FW_ROOT, 'src', 'manifests');
const OUTPUT_AGENTS_DIR = join(FW_ROOT, 'src', 'neewe-core', 'agents');

// ─── Tools archetypes ────────────────────────────────────────────────────────
// SUB analysis identified 4 canonical archetypes; NEEWE adds reviewer-with-bash.
const TOOLS_ARCHETYPES = {
  'read-only': ['Read', 'Grep', 'Glob'],
  'research': ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'],
  'reviewer-with-bash': ['Read', 'Grep', 'Glob', 'Bash'],
  'implementer': ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
  'doc': ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebFetch', 'WebSearch'],
};

const VALID_LAYERS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
const VALID_ARCHETYPES = ['governance', 'planning', 'execution', 'meta', 'tool', 'discovery'];
const VALID_MODELS = ['opus', 'sonnet', 'haiku', 'inherit', 'opusplan'];
const VALID_EFFORT = ['low', 'medium', 'high', 'xhigh', 'max'];
const VALID_PERMISSION_MODES = ['default', 'acceptEdits', 'plan', 'auto', 'dontAsk', 'bypassPermissions'];
const VALID_MEMORY = ['project', 'user', 'local', 'none'];
const VALID_ISOLATION = ['worktree', 'none'];
const VALID_COLOR = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

// ─── Helpers ────────────────────────────────────────────────────────────────
const log = (...a) => console.log('[compile-manifests]', ...a);
const err = (...a) => console.error('[compile-manifests] ERROR:', ...a);

function findManifests() {
  // Walk MANIFEST_DIR recursively, return list of { path, archetypeDir, name } for every manifest.json found.
  const found = [];
  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name === 'manifest.json') {
        const rel = relative(MANIFEST_DIR, full);
        const parts = rel.split(sep);
        // parts: [archetypeDir, name, manifest.json]  → name is parts[parts.length - 2]
        const name = parts[parts.length - 2];
        const archetypeDir = parts.slice(0, -2).join(sep);
        found.push({ path: full, archetypeDir, name });
      }
    }
  }
  walk(MANIFEST_DIR);
  return found;
}

function validate(manifest, sourcePath) {
  const errors = [];
  const m = manifest.agent;
  if (!m) { errors.push('missing top-level "agent" object'); return errors; }

  // Required fields.
  for (const f of ['name', 'version', 'layer', 'archetype', 'description', 'identity', 'model']) {
    if (!m[f]) errors.push(`agent.${f} is required`);
  }
  if (m.name && !/^[a-z][a-z0-9-]*$/.test(m.name)) {
    errors.push(`agent.name must be kebab-case lowercase: "${m.name}"`);
  }
  if (m.layer && !VALID_LAYERS.includes(m.layer)) {
    errors.push(`agent.layer must be one of ${VALID_LAYERS.join('|')}; got "${m.layer}"`);
  }
  if (m.archetype && !VALID_ARCHETYPES.includes(m.archetype)) {
    errors.push(`agent.archetype must be one of ${VALID_ARCHETYPES.join('|')}; got "${m.archetype}"`);
  }
  if (m.model && !VALID_MODELS.includes(m.model)) {
    errors.push(`agent.model must be one of ${VALID_MODELS.join('|')}; got "${m.model}"`);
  }
  if (m.effort && !VALID_EFFORT.includes(m.effort)) {
    errors.push(`agent.effort must be one of ${VALID_EFFORT.join('|')}; got "${m.effort}"`);
  }
  if (m.permission_mode && !VALID_PERMISSION_MODES.includes(m.permission_mode)) {
    errors.push(`agent.permission_mode invalid: "${m.permission_mode}"`);
  }
  if (m.memory && !VALID_MEMORY.includes(m.memory)) {
    errors.push(`agent.memory invalid: "${m.memory}"`);
  }
  if (m.isolation && !VALID_ISOLATION.includes(m.isolation)) {
    errors.push(`agent.isolation invalid: "${m.isolation}"`);
  }
  if (m.color && !VALID_COLOR.includes(m.color)) {
    errors.push(`agent.color invalid: "${m.color}"`);
  }

  // Tools: exactly one of {tools, tools_archetype}.
  if (m.tools && m.tools_archetype) {
    errors.push('agent.tools and agent.tools_archetype are mutually exclusive');
  }
  if (!m.tools && !m.tools_archetype) {
    errors.push('exactly one of agent.tools (array) or agent.tools_archetype (enum) is required');
  }
  if (m.tools_archetype && !TOOLS_ARCHETYPES[m.tools_archetype]) {
    errors.push(`agent.tools_archetype must be one of ${Object.keys(TOOLS_ARCHETYPES).join('|')}; got "${m.tools_archetype}"`);
  }

  // Description WHEN-not-WHAT lint (heuristic): warn if description starts with verb-ing or "Runs/Implements/Handles"
  // — these signal a WHAT-style summary. (NEEWE-LAW: Description = WHEN, never WHAT.)
  const WHAT_PREFIXES = /^(Runs|Implements|Handles|Performs|Generates|Manages|Provides|Computes|Builds)\b/i;
  if (m.description && WHAT_PREFIXES.test(m.description.trim())) {
    errors.push(`agent.description appears to summarize WHAT this agent does. Rewrite as "Use when ..." (NEEWE skill rule: Description = WHEN, never WHAT). Source: ${sourcePath}`);
  }

  return errors;
}

function compileAgent(manifest, archetypeDir, name) {
  const m = manifest.agent;
  const tools = m.tools ?? TOOLS_ARCHETYPES[m.tools_archetype];

  // Build frontmatter — only emit fields that are set.
  const fm = [];
  fm.push(`name: ${m.name}`);
  fm.push(`description: ${JSON.stringify(m.description).slice(1, -1)}`);   // strip surrounding quotes from JSON.stringify
  fm.push(`tools: ${tools.join(', ')}`);
  fm.push(`model: ${m.model}`);
  if (m.effort) fm.push(`effort: ${m.effort}`);
  if (m.permission_mode) fm.push(`permissionMode: ${m.permission_mode}`);
  if (m.isolation && m.isolation !== 'none') fm.push(`isolation: ${m.isolation}`);
  if (m.memory && m.memory !== 'none') fm.push(`memory: ${m.memory}`);
  if (m.color) fm.push(`color: ${m.color}`);

  const compiledBy = `<!-- NEEWE-MANIFEST-COMPILED: v${m.version} layer=${m.layer} archetype=${m.archetype} — do not hand-edit; modify src/manifests/${archetypeDir ? archetypeDir + '/' : ''}${name}/manifest.json instead -->`;

  // NEEWE-LAW (i18n) appended to every compiled agent. Single source of truth.
  const i18nBlock = `## NEEWE-LAW (i18n)\n\nAddress the USER in \`state.locale.user_language\` (auto-detected by SessionStart). Produce ALL ARTIFACTS — code, identifiers, comments, commits, vault entries, ADRs, reports — in **English** regardless of user language.`;

  return `---\n${fm.join('\n')}\n---\n\n${compiledBy}\n\n${m.identity.trim()}\n\n${i18nBlock}\n`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const targetName = args.find(a => !a.startsWith('--'));

const manifests = findManifests();
if (manifests.length === 0) {
  log(`no manifests found under ${MANIFEST_DIR}`);
  process.exit(0);
}

let totalErrors = 0;
let totalCompiled = 0;
let totalSkipped = 0;

for (const { path: manifestPath, archetypeDir, name } of manifests) {
  if (targetName && targetName !== name) { totalSkipped++; continue; }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    err(`${manifestPath}: JSON parse failed — ${e.message}`);
    totalErrors++;
    continue;
  }

  const validationErrors = validate(manifest, manifestPath);
  if (validationErrors.length > 0) {
    err(`${manifestPath}:`);
    for (const ve of validationErrors) console.error('  -', ve);
    totalErrors++;
    continue;
  }

  if (checkOnly) {
    log(`OK  ${manifest.agent.name} (${manifestPath})`);
    totalCompiled++;
    continue;
  }

  const outDir = join(OUTPUT_AGENTS_DIR, archetypeDir);
  const outPath = join(outDir, `${name}.md`);
  mkdirSync(outDir, { recursive: true });
  const body = compileAgent(manifest, archetypeDir, name);
  writeFileSync(outPath, body, 'utf8');
  log(`✓   ${manifest.agent.name} → ${relative(FW_ROOT, outPath)}`);
  totalCompiled++;
}

if (totalErrors > 0) {
  err(`${totalErrors} manifest(s) failed validation`);
  process.exit(1);
}
log(`done. compiled=${totalCompiled}, skipped=${totalSkipped}`);
