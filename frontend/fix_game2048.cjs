const fs = require('fs');

let content = fs.readFileSync('src/views/lab/Game2048Lab.vue', 'utf-8');

// Fix webkitAudioContext
if (content.includes('window.webkitAudioContext')) {
  content = content.replace(/window\.webkitAudioContext/g, '(window as any).webkitAudioContext');
  console.log('Fixed: webkitAudioContext');
}

// Fix dataset assignments: number to string
// cell.dataset.index = i;
content = content.replace(/cell\.dataset\.index = i;/g, 'cell.dataset.index = String(i);');
// slot.dataset.index = i;
content = content.replace(/slot\.dataset\.index = i;/g, 'slot.dataset.index = String(i);');
// slot.dataset.row = Math.floor(i / SIZE);
content = content.replace(/slot\.dataset\.row = Math\.floor\(i \/ SIZE\);/g, 'slot.dataset.row = String(Math.floor(i / SIZE));');
// slot.dataset.col = i % SIZE;
content = content.replace(/slot\.dataset\.col = i % SIZE;/g, 'slot.dataset.col = String(i % SIZE);');

console.log('Fixed: dataset number to string conversions');

fs.writeFileSync('src/views/lab/Game2048Lab.vue', content, 'utf-8');
console.log('Game2048Lab.vue done');
