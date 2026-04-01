import subprocess, hashlib, base64, urllib.request

url = "https://unpkg.com/@fluentui/web-components@2.6.1/dist/web-components.min.js"
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    digest = hashlib.sha384(data).digest()
    b64 = base64.b64encode(digest).decode()
    with open("/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh/sri_hash_result.txt", "w") as f:
        f.write(b64)
    print(f"SIZE: {len(data)}")
    print(f"HASH: {b64}")
except Exception as e:
    with open("/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh/sri_hash_result.txt", "w") as f:
        f.write(f"ERROR: {e}")
    print(f"ERROR: {e}")
