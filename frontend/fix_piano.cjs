const fs = require('fs');

let content = fs.readFileSync('src/views/lab/PianoLab.vue', 'utf-8');

// Fix webkitAudioContext
if (content.includes('window.webkitAudioContext')) {
  content = content.replace(/window\.webkitAudioContext/g, '(window as any).webkitAudioContext');
  console.log('Fixed: webkitAudioContext');
}

fs.writeFileSync('src/views/lab/PianoLab.vue', content, 'utf-8');
console.log('PianoLab.vue done');
