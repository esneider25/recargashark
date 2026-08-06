const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\IK\\Documents\\GitHub\\recargashark\\js\\app.js', 'utf-8');

let stack = [];
for (let i = 0; i < content.length; i++) {
  const c = content[i];
  if (c === '{' || c === '(' || c === '[') {
    stack.push({ char: c, pos: i });
  } else if (c === '}' || c === ')' || c === ']') {
    if (stack.length === 0) {
      console.log('Unmatched closing', c, 'at', i);
      process.exit(1);
    }
    const last = stack.pop().char;
    if ((c === '}' && last !== '{') || (c === ')' && last !== '(') || (c === ']' && last !== '[')) {
      console.log('Mismatched', last, c, 'at', i);
      process.exit(1);
    }
  } else if (c === '`' || c === '\'' || c === '"') {
    const quote = c;
    i++;
    while (i < content.length) {
      if (content[i] === '\\') i += 2;
      else if (content[i] === quote) break;
      else i++;
    }
    if (i >= content.length) {
      console.log('Unclosed quote', quote);
      process.exit(1);
    }
  } else if (c === '/' && content[i+1] === '*') {
    i += 2;
    while (i < content.length - 1 && !(content[i] === '*' && content[i+1] === '/')) {
      i++;
    }
    i++;
  } else if (c === '/' && content[i+1] === '/') {
    while (i < content.length && content[i] !== '\n') i++;
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets:');
  stack.forEach(s => {
    const line = content.substring(0, s.pos).split('\n').length;
    console.log(`Bracket ${s.char} at line ${line}`);
  });
} else {
  console.log('No unclosed brackets found by simple parser');
}
