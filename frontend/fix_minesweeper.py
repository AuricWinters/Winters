with open('src/views/lab/MinesweeperLab.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix window.webkitAudioContext
for i, line in enumerate(lines):
    if 'window.webkitAudioContext' in line:
        lines[i] = line.replace('window.webkitAudioContext', '(window as any).webkitAudioContext')
        print(f"Fixed line {i+1}: AudioContext")

# Fix valSpeed.textContent = pct + '%'
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == "valSpeed.textContent = pct + '%';":
        lines[i] = line.replace("valSpeed.textContent = pct + '%';", "valSpeed.textContent = String(pct) + '%';")
        print(f"Fixed line {i+1}: valSpeed.textContent")

# Fix cell.dataset.r = r
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'cell.dataset.r = r;':
        lines[i] = line.replace('cell.dataset.r = r;', 'cell.dataset.r = String(r);')
        print(f"Fixed line {i+1}: cell.dataset.r")

# Fix cell.dataset.c = c
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'cell.dataset.c = c;':
        lines[i] = line.replace('cell.dataset.c = c;', 'cell.dataset.c = String(c);')
        print(f"Fixed line {i+1}: cell.dataset.c")

with open('src/views/lab/MinesweeperLab.vue', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("MinesweeperLab.vue done")
