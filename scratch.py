import re

with open('src/PUL.txt', 'r') as f:
    lines = f.readlines()

in_misconduct = False
for i, line in enumerate(lines):
    if line.startswith('### Components of the Misconduct System'):
        in_misconduct = True
    
    if in_misconduct:
        match = re.match(r'^(#*)\s*([A-Za-z0-9]+)\.\s+(.*)$', line)
        if match:
            hashes = match.group(1)
            rest = match.group(3)
            # print original and new to see what we are changing
            new_line = f"{hashes} {rest}" if hashes else rest
            print(f"OLD: {line.strip()}")
            print(f"NEW: {new_line}")
