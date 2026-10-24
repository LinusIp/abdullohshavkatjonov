/* Highlights code blocks written without a language (Pages CMS's rich-text
   editor writes ``` with no language, which Rouge renders as plain text).
   Loaded only on pages that contain such a block (see _layouts/default.html).
   Blocks that name a language are already highlighted by Rouge at build time.

   Detection is deliberately conservative: a few high-precision signatures
   first, then highlight.js's own guess only when it is clearly confident.
   If neither is sure, the block stays plain rather than coloured wrongly. */
import hljs from '../vendor/highlight.js/11.12.0/core.min.js';
import python from '../vendor/highlight.js/11.12.0/languages/python.min.js';
import csharp from '../vendor/highlight.js/11.12.0/languages/csharp.min.js';
import c from '../vendor/highlight.js/11.12.0/languages/c.min.js';
import cpp from '../vendor/highlight.js/11.12.0/languages/cpp.min.js';
import javascript from '../vendor/highlight.js/11.12.0/languages/javascript.min.js';
import rust from '../vendor/highlight.js/11.12.0/languages/rust.min.js';
import bash from '../vendor/highlight.js/11.12.0/languages/bash.min.js';
import json from '../vendor/highlight.js/11.12.0/languages/json.min.js';
import yaml from '../vendor/highlight.js/11.12.0/languages/yaml.min.js';
import xml from '../vendor/highlight.js/11.12.0/languages/xml.min.js';
import css from '../vendor/highlight.js/11.12.0/languages/css.min.js';

const GRAMMARS = { python, csharp, c, cpp, javascript, rust, bash, json, yaml, xml, css };
for (const [name, grammar] of Object.entries(GRAMMARS)) hljs.registerLanguage(name, grammar);
const LANGS = Object.keys(GRAMMARS);

// [language, weight, pattern]. Weight 3 = one match is enough on its own.
const SIGNATURES = [
  ['csharp', 3, /^\s*using\s+(static\s+)?[A-Z]\w*(\.[A-Z]\w*)*\s*;/m],
  ['csharp', 3, /\bnamespace\s+[A-Z]\w*(\.[A-Z]\w*)*\s*[{;]/],
  ['csharp', 3, /\b(MonoBehaviour|SerializeField|Debug\.Log|GetComponent<|Console\.Write(Line)?|SceneManager\.)/],
  ['csharp', 2, /\b(public|private|protected|internal)\s+((static|override|virtual|async|readonly)\s+)*(void|int|string|bool|float|double|var|Task|IEnumerator)\s+\w+\s*[(=;{]/],
  ['python', 3, /^\s*def\s+\w+\s*\(.*\)\s*(->\s*[^:]+)?:\s*$/m],
  ['python', 3, /^\s*print\s*\(.*\)\s*$/m],
  ['python', 3, /^\s*(from\s+[\w.]+\s+import\s+[\w*]|import\s+[\w.]+(\s+as\s+\w+)?\s*$)/m],
  ['python', 2, /^\s*(elif\b.*:|except\b.*:|class\s+\w+(\(.*\))?\s*:\s*$|if\s+__name__\s*==)/m],
  ['python', 1, /\bself\.\w+|\b(None|True|False)\b/],
  ['javascript', 3, /\b(console\.(log|error|warn|info)|document\.\w+|window\.\w+|addEventListener|require\(\s*['"])/],
  ['javascript', 2, /\b(const|let)\s+[\w$]+\s*=/],
  ['javascript', 2, /=>\s*[{(\w'"`]/],
  ['javascript', 2, /^\s*(export\s+(default\s+)?(function|const|class)|import\s+.+\s+from\s+['"])/m],
  ['javascript', 1, /\bfunction\s*[\w$]*\s*\(/],
  ['rust', 3, /\bfn\s+\w+\s*(<[^>]*>)?\s*\(/],
  ['rust', 3, /\b(println!|eprintln!|vec!|format!|panic!)\s*[([]|\blet\s+mut\b|\bimpl\b|\buse\s+std::/],
  ['c', 3, /^\s*#\s*include\s*<(stdio|stdlib|string|math|stdint|stdbool|ctype|time)\.h>/m],
  ['c', 2, /\b(printf|scanf|malloc|calloc|free)\s*\(/],
  ['cpp', 4, /\bstd::|\b(cout|cin|endl)\b|^\s*#\s*include\s*<(iostream|vector|string|map|unordered_map|algorithm|memory)>|\btemplate\s*<|\bnamespace\s+[a-z]/m],
  ['bash', 3, /^#!\/(usr\/)?bin\/(env\s+)?(ba|z)?sh/m],
  ['bash', 3, /^\s*(\$\s+)?(sudo|cd|ls|git|npm|npx|pip3?|echo|export|mkdir|rm|cp|mv|curl|wget|chmod|apt(-get)?|brew|cargo|bundle|jekyll)\s+\S/m],
  ['xml', 3, /<\/?(html|head|body|div|span|p|a|ul|ol|li|section|header|footer|nav|img|script|link|meta|button|input|form|table|tr|td)\b[^>]*>/i],
  ['css', 3, /(^|\n)\s*[.#@]?[\w-]+([\s,>+~:.#\w-]*)\{[^{}]*\b[\w-]+\s*:\s*[^;{}]+;?[^{}]*\}/],
];

export function detectLanguage(text, engine = hljs) {
  const code = text.trim();
  if (!code) return null;
  const score = {};
  const bump = (lang, w) => { score[lang] = (score[lang] || 0) + w; };
  if (/^[[{]/.test(code)) { try { JSON.parse(code); bump('json', 4); } catch (e) { /* not JSON */ } }
  const yamlLines = code.split('\n').filter(l => /^\s*([\w-]+:(\s+\S|\s*$)|-\s+\S)/.test(l));
  if (yamlLines.length >= 2 && yamlLines.length === code.split('\n').filter(l => l.trim()).length && !/[;{}]/.test(code)) bump('yaml', 3);
  for (const [lang, weight, re] of SIGNATURES) if (re.test(code)) bump(lang, weight);
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (ranked.length && ranked[0][1] >= 3 && (ranked.length === 1 || ranked[0][1] > ranked[1][1])) return ranked[0][0];
  // No clear signature: accept highlight.js's guess only if it is well ahead.
  const auto = engine.highlightAuto(code, LANGS);
  const second = auto.secondBest ? auto.secondBest.relevance : 0;
  if (auto.language && auto.relevance >= 7 && auto.relevance - second >= 3) return auto.language;
  return null;
}

export function highlightBlocks(root = document) {
  root.querySelectorAll('div.language-plaintext.highlighter-rouge pre code').forEach(code => {
    const block = code.closest('div.highlighter-rouge');
    if (block.hasAttribute('data-code-lang')) return;
    const lang = detectLanguage(code.textContent);
    block.setAttribute('data-code-lang', lang || 'plain');
    if (!lang) return;
    code.innerHTML = hljs.highlight(code.textContent, { language: lang, ignoreIllegals: true }).value;
    code.classList.add('hljs', 'language-' + lang);
    if (window.siteCode) window.siteCode.setLanguage(block, lang);
  });
}

if (typeof document !== 'undefined') highlightBlocks();
