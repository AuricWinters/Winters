with open('src/views/lab/PianoLab.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'window.webkitAudioContext' in line:
        lines[i] = line.replace('window.webkitAudioContext', '(window as any).webkitAudioContext')
        print(f"Fixed line {i+1}: AudioContext")

with open('src/views/lab/PianoLab.vue', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("PianoLab.vue done")
