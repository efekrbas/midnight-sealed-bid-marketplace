const fs = require('fs');
const users = JSON.parse(fs.readFileSync('users_preprod.json'));
let md = `# Preprod Users — Level 5\nTarget: 50 verified wallet addresses\n\n| #  | Wallet Address | Date Added |\n|----|----------------|------------|\n`;
users.forEach((u, i) => {
  md += `| ${i + 1} | \`${u.address}\` | ${u.first_seen.split('T')[0]} |\n`;
});
md += `\nCurrent count: ${users.length} / 50\n`;
fs.writeFileSync('USERS.md', md);
