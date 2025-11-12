const fs = require('fs');
const code = fs.readFileSync('script.js','utf8');
const stack = [];
for (let i = 0; i < code.length; i++) {
  const ch = code[i];
  if (ch === '{' || ch === '(' || ch === '[') {
    stack.push({ch, index: i});
  } else if (ch === '}' || ch === ')' || ch === ']') {
    const open = stack.pop();
    if (!open) {
      console.log('Unmatched closing', ch, 'at index', i);
      break;
    }
    const pairs = { '{': '}', '(': ')', '[': ']' };
    if (pairs[open.ch] !== ch) {
      console.log('Mismatched closing', ch, 'at index', i, 'expected', pairs[open.ch]);
      break;
    }
  }
}
if (stack.length) {
  console.log('Unmatched opening', stack.pop());
}
