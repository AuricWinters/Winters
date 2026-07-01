import re

with open('src/views/lab/CodeLab.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix line 650: t() with 2 args -> t() with concatenated string
old1 = "terminal.writeln(`\\x1b[1;33m${t('>>> 执行 {lang} 代码...', { lang: lang.toUpperCase() })}\\x1b[0m`);"
new1 = "terminal.writeln(`\\x1b[1;33m` + t('>>> 执行 ') + lang.toUpperCase() + t(' 代码...') + `\\x1b[0m`);"
if old1 in content:
    content = content.replace(old1, new1)
    print("Fixed line 650")
else:
    print("Line 650 not found - checking variants...")
    # Try to find the pattern
    import re
    pattern = r"terminal\.writeln\(.*>>> 执行.*lang.*lang\.toUpperCase.*\x1b\[0m`\)"
    matches = re.findall(pattern, content)
    for m in matches:
        print(f"  Found: {m[:80]}...")

# Fix line 685: t() with 2 args -> t() with concatenated string
old2 = "terminal.write(`\\x1b[90m` + t('请确保后端已在 {host} 启动', { host: API_BASE || window.location.origin }) + `\\x1b[0m\\r\\n`);"
new2 = "terminal.write(`\\x1b[90m` + t('请确保后端已在 ' + (API_BASE || window.location.origin) + ' 启动') + `\\x1b[0m\\r\\n`);"
if old2 in content:
    content = content.replace(old2, new2)
    print("Fixed line 685")
else:
    print("Line 685 not found - checking variants...")
    pattern2 = r"terminal\.write\(.*请确保后端已.*host.*started.*\x1b\[0m\\r\\n`\)"
    pattern2b = r"terminal\.write\(.*请确保后端已.*\..*启动.*\x1b\[0m"
    matches2 = re.findall(pattern2b, content)
    for m in matches2:
        print(f"  Found: {m[:80]}...")

with open('src/views/lab/CodeLab.vue', 'w', encoding='utf-8') as f:
    f.write(content)
