import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// run with: node scripts/plantingActionsToSql.js
const raw = fs.readFileSync(path.join(__dirname, '../db/plantingActions.json'), 'utf8');
const arr = JSON.parse(raw);
const data = arr[0]; // single object with all plants

const rows = [];

for (const [plant, val] of Object.entries(data)) {
  if (val.action) {
    // no variant
    for (const [action, cfg] of Object.entries(val.action)) {
      rows.push({
        plant,
        variant: null,
        action,
        seasons: cfg.season || [],
        months: cfg.months || [],
      });
    }
  } else {
    // variants (e.g. bean -> bush_pole, broad)
    for (const [variant, variantVal] of Object.entries(val)) {
      if (variantVal && variantVal.action) {
        for (const [action, cfg] of Object.entries(variantVal.action)) {
          rows.push({
            plant,
            variant,
            action,
            seasons: cfg.season || [],
            months: cfg.months || [],
          });
        }
      }
    }
  }
}

function escape(str) {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}
function arrLiteral(arr, type = 'text') {
  if (!arr || !arr.length) return "'{}'";
  if (type === 'int') return `ARRAY[${arr.join(',')}]::integer[]`;
  return `ARRAY[${arr.map((s) => escape(s)).join(',')}]::text[]`;
}

const inserts = rows.map(
  (r) =>
    `INSERT INTO public.planting_actions (plant, variant, action, seasons, months)\n  VALUES (${escape(r.plant)}, ${escape(r.variant)}, ${escape(r.action)}, ${arrLiteral(r.seasons)}, ${arrLiteral(r.months, 'int')})\n  ON CONFLICT (plant, variant, action) DO NOTHING;`,
);

console.log('-- Run this in Supabase SQL Editor:\n');
console.log(inserts.join('\n\n'));
