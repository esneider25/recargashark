const fs = require('fs');
let code = fs.readFileSync('c:/Users/IK/Documents/GitHub/recargashark/js/admin.js', 'utf8');

// Replace colspan="5" with colspan="6" in the table messages
code = code.replace(/colspan="5"/g, 'colspan="6"');

// Insert the WhatsApp column into the row template
code = code.replace(
  /<td style="padding: 12px; border-bottom: 1px solid var\(--border-color\);">\$\{user\.name \|\| '-'\}<\/td>([\r\n\s]*)<td style="padding: 12px; border-bottom: 1px solid var\(--border-color\);">\$\{dateStr\}<\/td>/g,
  '<td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.name || \'-\'}</td>$1<td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.whatsapp || \'-\'}</td>$1<td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${dateStr}</td>'
);

// Add whatsapp to the search filter
code = code.replace(
  /\(u\.name && u\.name\.toLowerCase\(\)\.includes\(term\)\)([\r\n\s]*)\);/g,
  '(u.name && u.name.toLowerCase().includes(term)) ||$1    (u.whatsapp && u.whatsapp.toLowerCase().includes(term))$1  );'
);

fs.writeFileSync('c:/Users/IK/Documents/GitHub/recargashark/js/admin.js', code);
console.log("Fixes applied successfully.");
