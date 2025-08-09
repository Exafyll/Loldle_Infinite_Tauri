const fs = require('fs');
const path = require('path');

const RUST_PATH = path.join(__dirname, '../src-tauri/src/champions/champion.rs');
const OUTPUT_PATH = path.join(__dirname, 'enum_options.json');

const rust = fs.readFileSync(RUST_PATH, 'utf8');

// A simple parser for Rust enums (works for this style only)
function extractEnum(enumName) {
  const re = new RegExp(`enum ${enumName} ?{([\\s\\S]+?)}`, 'm');
  const match = rust.match(re);
  if (!match) return [];
  return match[1]
    .split(',')
    .map(l => l.replace(/\/\/.*/, '').trim())
    .filter(x => x.length && !x.startsWith('#') && !x.startsWith('pub'))
    .map(x => x.replace(/(\w+).*/, '$1'))
    .filter(Boolean);
}

const enums = ['Gender', 'Position', 'Species', 'Resource', 'RangeType', 'Region'];
const result = {};
for (const e of enums) result[e] = extractEnum(e);

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
console.log('Extracted enums:', result);
