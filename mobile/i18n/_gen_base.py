# Generates remaining i18n TypeScript bundles for GovTech mobile app.
# Pattern matches common.ts / createBundle.

from pathlib import Path
import json
import textwrap

ROOT = Path(r"c:\Users\mfune\OneDrive\Documents\Hackathons\GovTech2026\mobile\i18n")
LOCALES = ["en", "af", "zu", "xh", "nr", "ss", "nso", "st", "tn", "ve", "ts"]

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

def fmt_val(v):
    if callable(v):
        # shouldn't happen
        raise TypeError("callable")
    if isinstance(v, dict):
        inner = ",\n".join(f"    {k}: {fmt_val(vv)}" for k, vv in v.items())
        return "{\n" + inner + "\n  }"
    if isinstance(v, (list, tuple)):
        items = ", ".join(fmt_val(x) for x in v)
        return f"[{items}]"
    if isinstance(v, str):
        # use template if contains ${
        if "${" in v or "\n" in v:
            return f"`{esc(v)}`"
        # prefer JSON string for simple strings
        return json.dumps(v, ensure_ascii=False)
    raise TypeError(type(v))

def write_bundle(path: Path, type_name: str, getter: str, type_body: str, locales: dict, imports_extra=""):
    parts = []
    parts.append('import { createBundle, resolveLocale } from "./createBundle";' if "questionnaires" not in str(path) else 'import { createBundle, resolveLocale } from "../createBundle";')
    if imports_extra:
        parts.append(imports_extra)
    parts.append("")
    parts.append(type_body.strip())
    parts.append("")
    for loc in LOCALES:
        data = locales[loc]
        body = ",\n".join(f"  {k}: {fmt_val(v)}" for k, v in data.items())
        parts.append(f"const {loc}: {type_name} = {{\n{body}\n}};")
        parts.append("")
    parts.append(f"const BUNDLE = createBundle<{type_name}>({{")
    parts.append(",\n".join(f"  {loc}" for loc in LOCALES))
    parts.append("});")
    parts.append("")
    parts.append(f"export function {getter}(locale: string | null | undefined): {type_name} {{")
    parts.append("  return BUNDLE[resolveLocale(locale)];")
    parts.append("}")
    parts.append("")
    path.write_text("\n".join(parts), encoding="utf-8")
    print("wrote", path, "bytes", path.stat().st_size)

print("generator ready")
