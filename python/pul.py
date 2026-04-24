import json

def generate_rules():
    with open('/home/austin/workspaces/regula_nexus/src/PUL.txt', 'r') as f:
        lines = f.readlines()
        
    rules = {}
    
    current_level = 0
    counts = [0] * 10
    path_refs = {0: {"children": rules}}
    
    in_annotation = False
    active_elements = None
    
    def get_key_segment(lvl, count):
        if lvl == 1: return str(count)
        elif lvl == 2: return chr(64 + count)
        elif lvl == 3: return str(count)
        elif lvl == 4: return chr(64 + count)
        elif lvl == 5: return str(count)
        elif lvl == 6: return chr(96 + count)
        elif lvl == 7: return str(count)
        else: return str(count)
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line == '```':
            in_annotation = not in_annotation
            continue
            
        if in_annotation:
            if line.startswith('*'):
                text = line[1:].strip()
                if active_elements is not None:
                    if len(active_elements) > 0 and active_elements[-1]["type"] == "ANNOTATION":
                        if "list_items" not in active_elements[-1]:
                            active_elements[-1]["list_items"] = []
                        active_elements[-1]["list_items"].append({"type": "LISTITEM", "content": f" {text} "})
                    else:
                        active_elements.append({"type": "LISTITEM", "content": f" {text} ", "title": ""})
            else:
                if active_elements is not None:
                    active_elements.append({"type": "ANNOTATION", "content": f" {line} ", "title": ""})
            continue
            
        if line.startswith('*'):
            text = line[1:].strip()
            if active_elements is not None:
                active_elements.append({"type": "LISTITEM", "content": f" {text} ", "title": ""})
            continue
            
        el_type = "TEXT"
            
        if line.startswith('##'):
            hashes = len(line) - len(line.lstrip('#'))
            level = hashes - 1
            text = line.lstrip('#').strip()
            
            current_level = level
            counts[level] += 1
            for i in range(level + 1, 10):
                counts[i] = 0
                
            segments = [get_key_segment(i, counts[i]) for i in range(1, level + 1)]
            full_id = "P" + ".".join(segments)
            
            new_node = {
                "id": full_id,
                "elements": [{"type": el_type, "content": f" {text} ", "title": ""}],
                "children": {}
            }
            
            parent_node = path_refs[level - 1]
            if level == 1:
                parent_node["children"][full_id] = new_node
            else:
                parent_node["children"][segments[-1]] = new_node
                
            path_refs[level] = new_node
            active_elements = new_node["elements"]
            
        else:
            if current_level == 0:
                continue
                
            target_level = current_level + 1
            counts[target_level] += 1
            for i in range(target_level + 1, 10):
                counts[i] = 0
                
            segments = [get_key_segment(i, counts[i]) for i in range(1, target_level + 1)]
            full_id = "P" + ".".join(segments)
            
            new_node = {
                "id": full_id,
                "elements": [{"type": el_type, "content": f" {line} ", "title": ""}],
                "children": {}
            }
            
            parent_node = path_refs[target_level - 1]
            if target_level == 1:
                parent_node["children"][full_id] = new_node
            else:
                parent_node["children"][segments[-1]] = new_node
                
            path_refs[target_level] = new_node
            active_elements = new_node["elements"]

    with open('/home/austin/workspaces/regula_nexus/src/pul_rules.json', 'w') as f:
        json.dump({"rules": rules}, f, indent=2)

if __name__ == "__main__":
    generate_rules()
