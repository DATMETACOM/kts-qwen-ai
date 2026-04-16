from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    qwen_api_key: str
    base_url: str
    qwen_model: str
    data_file: Path
    product_catalog_file: Path


def load_settings() -> Settings:
    root = Path(__file__).resolve().parents[1]
    load_dotenv(root / ".env")

    qwen_api_key = os.getenv("QWEN_API_KEY", "").strip()
    if not qwen_api_key:
        raise RuntimeError("Missing QWEN_API_KEY in backend/.env")

    return Settings(
        qwen_api_key=qwen_api_key,
        base_url=os.getenv("BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").strip(),
        qwen_model=os.getenv("QWEN_MODEL", "qwen3.6-plus").strip(),
        data_file=root / "customers_data.json",
        product_catalog_file=root / "Product_Catalog.json",
    )
