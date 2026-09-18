from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
env_text = (root / ".env").read_bytes().decode("cp1252")
eas_path = root / "eas.json"
eas = json.loads(eas_path.read_text(encoding="utf-8"))

env = {}
for line in env_text.splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    if not line.startswith("EXPO_PUBLIC_"):
        continue
    key, value = line.split("=", 1)
    value = value.strip().strip('"').strip("'")
    if value:
        env[key] = value

preview = eas.setdefault("build", {}).setdefault("preview", {})
preview_env = preview.setdefault("env", {})
preview_env.update(env)
preview_env.setdefault("APP_ENV", "preview")

# Also mirror into production so a future AAB does not crash the same way.
production = eas.setdefault("build", {}).setdefault("production", {})
production_env = production.setdefault("env", {})
production_env.update(env)

eas_path.write_text(json.dumps(eas, indent=2) + "\n", encoding="utf-8")
print(f"wrote {len(env)} EXPO_PUBLIC keys into eas.json preview+production env")
