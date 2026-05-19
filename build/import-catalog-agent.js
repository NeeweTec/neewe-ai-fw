#!/usr/bin/env node
/**
 * NEEWE Catalog Importer (Sprint 3 v0.1)
 *
 * Imports a single agent from the vendored VoltAgent awesome-claude-code-subagents
 * catalog (at `02 - ARTEFATOS/repos/awesome-subagents/categories/.../` in the
 * fw-neewe-claude workspace) into a NEEWE manifest.json with NEEWE overlay
 * (Pre-Report Gate, NEEWE Tone, completion marker, archetype-correct tools).
 *
 * Produces: src/manifests/<archetype>/<name>/manifest.json
 *
 * Usage:
 *   node build/import-catalog-agent.js <path-to-catalog-agent.md> [<neewe-archetype>]
 *
 * Example:
 *   node build/import-catalog-agent.js \
 *     "../fw-neewe-claude/02 - ARTEFATOS/repos/awesome-subagents/categories/04-quality-security/security-auditor.md" \
 *     governance
 *
 * The script:
 *   1. Parses the catalog agent's YAML frontmatter (name, description, tools, model)
 *   2. Maps the catalog `tools:` string to a NEEWE `tools_archetype` enum
 *   3. Generates a NEEWE-shaped manifest.json with the catalog identity preserved
 *      + a NEEWE overlay block (Pre-Report Gate, Tone Spec link, completion marker)
 *   4. Writes the manifest to src/manifests/<archetype>/<name>/manifest.json
 *
 * This is the Sprint 3 SCAFFOLDING. Result must be hand-reviewed before commit:
 *   - Confirm the description is WHEN not WHAT (rewrite if needed)
 *   - Confirm the archetype is right
 *   - Confirm the model is right (catalog defaults often need NEEWE-specific adjustment)
 *   - Confirm completion marker fits the agent's domain
 *
 * Zero npm deps. Node 18+.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FW_ROOT = join(__dirname, '..');
const MANIFESTS_DIR = join(FW_ROOT, 'src', 'manifests');

// Map catalog tool strings to NEEWE archetypes
function inferArchetype(catalogTools) {
  const toolList = (catalogTools || '').split(/[,\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const has = (t) => toolList.includes(t.toLowerCase());

  if ((has('write') || has('edit')) && has('bash')) return 'implementer';
  if (has('write') || has('edit')) return 'doc';
  if (has('webfetch') || has('websearch')) return 'research';
  if (has('bash')) return 'reviewer-with-bash';
  return 'read-only';
}

// Infer NEEWE layer from category dir name (best-effort)
function inferLayer(catalogPath) {
  const lc = catalogPath.toLowerCase();
  if (lc.includes('04-quality-security') || lc.includes('governance')) return 'L6';
  if (lc.includes('09-meta-orchestration')) return 'L2';
  if (lc.includes('10-research-analysis') || lc.includes('08-business-product')) return 'L1';
  if (lc.includes('03-infrastructure') || lc.includes('01-core-development')) return 'L3';
  return 'L3'; // default
}

function parseAgentMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('catalog agent missing YAML frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { fm, body: m[2] };
}

// ─── Main ──────────────────────────────────────────────────────────────────

const catalogPath = process.argv[2];
const overrideArchetype = process.argv[3];

if (!catalogPath) {
  console.error('Usage: node build/import-catalog-agent.js <catalog-agent-path> [<archetype>]');
  process.exit(1);
}

if (!existsSync(catalogPath)) {
  console.error(`Catalog file not found: ${catalogPath}`);
  process.exit(1);
}

const raw = readFileSync(catalogPath, 'utf8');
const { fm, body } = parseAgentMd(raw);

const name = fm.name || basename(catalogPath, '.md');
const archetype = overrideArchetype || inferArchetype(fm.tools);
const layer = inferLayer(catalogPath);
const model = fm.model || 'sonnet';

const description = fm.description?.trim() || '(missing — REWRITE before committing: use WHEN trigger, not WHAT)';

const identity = `${body.trim()}\n\n---\n\n## NEEWE Overlay\n\n(Imported from VoltAgent awesome-claude-code-subagents catalog. NEEWE overlay applied: Pre-Report Gate, NEEWE Tone Spec, completion marker.)\n\n### Pre-Report Gate (apply BEFORE emitting any finding)\n\n1. Can I cite the exact line / source?\n2. Can I describe the concrete failure mode (not 'might be')?\n3. Have I read the surrounding context?\n4. Is the severity defensible?\n\nIf any answer is NO, drop the finding.\n\n### Completion Marker\n\nFinal line of every report MUST be: \`## ${name.toUpperCase().replace(/-/g, '_')}_COMPLETE\`\n\nThe orchestrator regex-matches on it.\n\n### NEEWE Tone\n\nNEEWE Tone Spec applies: action-bias, peer-level, no flattery, no filler adverbs (genuinely, honestly, straightforward, actually, basically), no emojis unless mirrored, push back when warranted. \`file_path:line_number\` for every code reference.`;

const manifest = {
  '$schema': 'neewe-manifest-v1',
  agent: {
    name,
    version: '0.1.0',
    layer,
    archetype,
    description,
    identity,
    model,
    effort: 'medium',
    tools_archetype: archetype,
    permission_mode: 'plan',
    memory: 'project',
  },
  distribution: {
    ship_with: ['neewe-core'],
  },
};

const outDir = join(MANIFESTS_DIR, archetype, name);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'manifest.json');

if (existsSync(outPath)) {
  console.error(`Refusing to overwrite existing manifest: ${outPath}`);
  console.error('Delete it first if you want to re-import.');
  process.exit(1);
}

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`[import-catalog-agent] imported '${name}' as ${archetype}/${name}`);
console.log(`[import-catalog-agent] manifest: ${outPath}`);
console.log('');
console.log('NEXT STEPS (hand-review required):');
console.log('  1. Open the manifest and review the `description` field — rewrite as "Use when ..." if WHAT-style.');
console.log('  2. Confirm the `archetype` and `model` are right for NEEWE (not catalog defaults).');
console.log(`  3. Run: node build/compile-manifests.js ${name}`);
console.log(`  4. Lint: node src/neewe-core/bin/neewe-validate-skills.js  # (if applicable)`);
console.log(`  5. Commit if you're happy with the import.`);
