from __future__ import annotations

import json
from pathlib import Path

from fastapi import HTTPException

from app.schemas import CustomerListItem, CustomerRecord


class CustomerService:
    def __init__(self, data_file: Path) -> None:
        self.data_file = data_file
        self._customers = self._load()

    def _load(self) -> list[CustomerRecord]:
        if not self.data_file.exists():
            raise RuntimeError(f"Missing data file: {self.data_file}")

        payload = json.loads(self.data_file.read_text(encoding="utf-8"))
        return [CustomerRecord(**item) for item in payload]

    def list_customers(self) -> list[CustomerListItem]:
        rows: list[CustomerListItem] = []
        for customer in self._customers:
            rows.append(
                CustomerListItem(
                    customer_id=customer.customer_id,
                    full_name=customer.pii_data.full_name,
                    job_title=customer.pii_data.job_title,
                    behavioral_tags=customer.behavioral_tags,
                    risk_score=customer.deterministic_stats.risk_score,
                    recommended_nbo=customer.deterministic_stats.recommended_nbo,
                    lookalike_rate=customer.deterministic_stats.lookalike_rate,
                )
            )
        return rows

    def get_customer_or_404(self, customer_id: str) -> CustomerRecord:
        for customer in self._customers:
            if customer.customer_id == customer_id:
                return customer
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
