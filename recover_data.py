import json
import re
import glob

# Try to extract original card data from the transcript
transcript_path = "/home/prarasbiosciences-test/.gemini/antigravity-ide/brain/b87bfccc-d65b-45df-8948-2fbecbce2c0b/.system_generated/logs/transcript_full.jsonl"

original_data = {}

# A regex to capture a product card feat-list block
# It's hard to associate with a specific file, but maybe we can find it by looking for the product name nearby, or just gather all unique ones.
# Or better, we can parse the files, find which product the card belongs to, and restore it.
# Let's search the transcript for text like "<li><strong>Where product is used:</strong>"
# and capture the surrounding context.
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "Where product is used:" in line:
            # this is a json line
            try:
                data = json.loads(line)
                content = ""
                if "content" in data:
                    content += str(data["content"])
                if "tool_calls" in data:
                    content += str(data["tool_calls"])
                if "output" in data:
                    content += str(data["output"])
                    
                # Find all feat-list blocks
                matches = re.finditer(r'<ul class="feat-list"(.*?)</ul>', content, re.IGNORECASE | re.DOTALL)
                for m in matches:
                    block = m.group(0)
                    if "Where product is used:" in block:
                        # Extract the key-values
                        card_info = {}
                        lis = re.findall(r'<li[^>]*>(.*?)</li>', block, re.IGNORECASE | re.DOTALL)
                        for li in lis:
                            strong_match = re.search(r'<strong[^>]*>(.*?)</strong>(.*)', li, re.IGNORECASE | re.DOTALL)
                            if strong_match:
                                key = strong_match.group(1).replace(':', '').strip()
                                val = strong_match.group(2).strip()
                                if val.startswith(':'):
                                    val = val[1:].strip()
                                card_info[key] = val
                        
                        # How to map this back to a file/product?
                        # Usually, the block is near the product name.
                        # Let's just store all unique ones by a hash of their contents
                        # Or maybe we can find the product name from the block just before it?
                        pass
            except Exception as e:
                pass
