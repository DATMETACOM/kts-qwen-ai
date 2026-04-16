from __future__ import annotations

import json
from pathlib import Path


def load_product_catalog(path: Path) -> dict:
    if not path.exists():
        raise RuntimeError(f"Missing product catalog: {path}")
    return json.loads(path.read_text(encoding="utf-8"))
