with open('src/views/lab/Game2048Lab.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'window.webkitAudioContext' in line:
        lines[i] = line.replace('window.webkitAudioContext', '(window as any).webkitAudioContext')
        print(f"Fixed line {i+1}: AudioContext")

# Fix cell.dataset.index = i -> String(i)
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'cell.dataset.index = i;':
        lines[i] = line.replace('cell.dataset.index = i;', 'cell.dataset.index = String(i);')
        print(f"Fixed line {i+1}: cell.dataset.index")

# Fix slot.dataset.index = i -> String(i)
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'slot.dataset.index = i;':
        lines[i] = line.replace('slot.dataset.index = i;', 'slot.dataset.index = String(i);')
        print(f"Fixed line {i+1}: slot.dataset.index")

# Fix slot.dataset.row = Math.floor(i / SIZE) -> String()
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'slot.dataset.row = Math.floor(i / SIZE);':
        lines[i] = line.replace('slot.dataset.row = Math.floor(i / SIZE);', 'slot.dataset.row = String(Math.floor(i / SIZE));')
        print(f"Fixed line {i+1}: slot.dataset.row")

# Fix slot.dataset.col = i % SIZE -> String()
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'slot.dataset.col = i % SIZE;':
        lines[i] = line.replace('slot.dataset.col = i % SIZE;', 'slot.dataset.col = String(i % SIZE);')
        print(f"Fixed line {i+1}: slot.dataset.col")

with open('src/views/lab/Game2048Lab.vue', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Game2048Lab.vue done")
