from pathlib import Path
import subprocess
import shutil

raw = Path(".env").read_bytes()
text = raw.decode("cp1252")
pairs = []
for line in text.splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    if not line.startswith("EXPO_PUBLIC_"):
        continue
    key, value = line.split("=", 1)
    value = value.strip().strip('"').strip("'")
    if not value:
        continue
    pairs.append((key, value))

npx = shutil.which("npx.cmd") or shutil.which("npx")
if not npx:
    raise SystemExit("npx not found")

print(f"pushing {len(pairs)} env vars via {npx}")
for key, value in pairs:
    cmd = [
        npx,
        "eas-cli",
        "env:create",
        "--name",
        key,
        "--value",
        value,
        "--environment",
        "preview",
        "--visibility",
        "plaintext",
        "--non-interactive",
        "--force",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    status = "ok" if result.returncode == 0 else "fail"
    print(key, status)
    if result.returncode != 0:
        out = (result.stdout or "") + "\n" + (result.stderr or "")
        print(out[-800:])
