import json

def generate_rules():
    with open('/home/austin/workspaces/regula_nexus/src/WUL.txt', 'r') as f:
        lines = f.readlines()
        
    rules = {}
    
    current_level = 0
    w_val = 0
    alpha_val = 0
    num_val = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('## '):
            text = line[3:]
            current_level = 1
            w_val += 1
            alpha_val = 0
            num_val = 0
            
            key = f"W{w_val}"
            rules[key] = {
                "id": key,
                "elements": [{"type": "TEXT", "content": f" {text} ", "title": ""}],
                "children": {}
            }
        elif line.startswith('### '):
            text = line[4:]
            current_level = 2
            alpha_val += 1
            num_val = 0
            
            alpha_char = chr(64 + alpha_val) # A, B, C...
            key = f"W{w_val}.{alpha_char}"
            rules[f"W{w_val}"]["children"][alpha_char] = {
                "id": key,
                "elements": [{"type": "TEXT", "content": f" {text} ", "title": ""}],
                "children": {}
            }
        else:
            if current_level == 1:
                alpha_val += 1
                text = line
                alpha_char = chr(64 + alpha_val)
                key = f"W{w_val}.{alpha_char}"
                rules[f"W{w_val}"]["children"][alpha_char] = {
                    "id": key,
                    "elements": [{"type": "TEXT", "content": f" {text} ", "title": ""}],
                    "children": {}
                }
            elif current_level == 2:
                num_val += 1
                text = line
                alpha_char = chr(64 + alpha_val)
                key = f"W{w_val}.{alpha_char}.{num_val}"
                rules[f"W{w_val}"]["children"][alpha_char]["children"][str(num_val)] = {
                    "id": key,
                    "elements": [{"type": "TEXT", "content": f" {text} ", "title": ""}],
                    "children": {}
                }

    with open('/home/austin/workspaces/regula_nexus/src/wul_rules.json', 'w') as f:
        json.dump({"rules": rules}, f, indent=2)

if __name__ == "__main__":
    generate_rules()
