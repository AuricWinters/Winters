const fs = require('fs');

let content = fs.readFileSync('src/views/lab/MinesweeperLab.vue', 'utf-8');

// Fix webkitAudioContext
if (content.includes('window.webkitAudioContext')) {
  content = content.replace(/window\.webkitAudioContext/g, '(window as any).webkitAudioContext');
  console.log('Fixed: webkitAudioContext');
}

// Fix valSpeed.textContent = pct + '%'
content = content.replace(/valSpeed\.textContent = pct \+ '%';/g, "valSpeed.textContent = String(pct) + '%';");
console.log('Fixed: valSpeed.textContent');

// Fix cell.dataset.r = r;
content = content.replace(/cell\.dataset\.r = r;/g, 'cell.dataset.r = String(r);');
console.log('Fixed: cell.dataset.r');

// Fix cell.dataset.c = c;
content = content.replace(/cell\.dataset\.c = c;/g, 'cell.dataset.c = String(c);');
console.log('Fixed: cell.dataset.c');

fs.writeFileSync('src/views/lab/MinesweeperLab.vue', content, 'utf-8');
console.log('MinesweeperLab.vue done');
