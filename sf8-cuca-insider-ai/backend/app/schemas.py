from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


PRODUCT_NAMES = (
    "Vay tín chấp cá nhân",
    "Thẻ tín dụng THE FIRST",
    "Vay mua ô tô",
)


class PiiData(BaseModel):
    full_name: str
    phone: str
    job_title: str


class BehavioralTags(BaseModel):
    e_wallet: list[str]
    social_media: list[str]
    telco: list[str]


class DeterministicStats(BaseModel):
    risk_score: Literal["Low", "Medium", "High"]
    recommended_nbo: str
    lookalike_rate: int = Field(ge=8, le=25)


class CustomerRecord(BaseModel):
    customer_id: str
    pii_data: PiiData
    behavioral_tags: BehavioralTags
    deterministic_stats: DeterministicStats


class CustomerListItem(BaseModel):
    customer_id: str
    full_name: str
    job_title: str
    behavioral_tags: BehavioralTags
    risk_score: Literal["Low", "Medium", "High"]
    recommended_nbo: str
    lookalike_rate: int


class AnalyzeResponse(BaseModel):
    customer_id: str
    full_name: str
    job_title: str
    deterministic_stats: DeterministicStats
    recommended_product: str
    behavioral_rationale: list[str]
    statistical_evidence: list[str]
    sales_pitch_script: str
    risk_warning_and_upsell: list[str]


class CopilotMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CopilotRequest(BaseModel):
    message: str
    history: list[CopilotMessage] = Field(default_factory=list)


class CopilotResponse(BaseModel):
    reply: str
