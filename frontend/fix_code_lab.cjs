const fs = require('fs');

// Fix CodeLab.vue
let content = fs.readFileSync('src/views/lab/CodeLab.vue', 'utf-8');

// Fix line 650: t() with 2 args -> concatenate
const old1 = "terminal.writeln(`\\x1b[1;33m${t('>>> 执行 {lang} 代码...', { lang: lang.toUpperCase() })}\\x1b[0m`);";
const new1 = "terminal.writeln(`\\x1b[1;33m` + t('>>> 执行 ') + lang.toUpperCase() + t(' 代码...') + `\\x1b[0m`);";
if (content.includes(old1)) {
  content = content.replace(old1, new1);
  console.log('Fixed line 650');
} else {
  console.log('WARNING: Pattern 1 not found');
}

// Fix line 685
const old2 = "terminal.write(`\\x1b[90m` + t('请确保后端已在 {host} 启动', { host: API_BASE || window.location.origin }) + `\\x1b[0m\\r\\n`);";
const new2 = "terminal.write(`\\x1b[90m` + t('请确保后端已在 ' + (API_BASE || window.location.origin) + ' 启动') + `\\x1b[0m\\r\\n`);";
if (content.includes(old2)) {
  content = content.replace(old2, new2);
  console.log('Fixed line 685');
} else {
  console.log('WARNING: Pattern 2 not found');
}

fs.writeFileSync('src/views/lab/CodeLab.vue', content, 'utf-8');
console.log('CodeLab.vue done');
