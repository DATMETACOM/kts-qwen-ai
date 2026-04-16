from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.config import load_settings
from app.schemas import AnalyzeResponse, CopilotRequest, CopilotResponse, CustomerListItem
from app.services.catalog_service import load_product_catalog
from app.services.customer_service import CustomerService
from app.services.qwen_service import QwenService

settings = load_settings()
customer_service = CustomerService(settings.data_file)
product_catalog = load_product_catalog(settings.product_catalog_file)
qwen_service = QwenService(settings=settings, product_catalog=product_catalog)

router = APIRouter()


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/customers", response_model=list[CustomerListItem])
def list_customers() -> list[CustomerListItem]:
    return customer_service.list_customers()


@router.get("/analyze/{customer_id}", response_model=AnalyzeResponse)
def analyze_customer(customer_id: str) -> AnalyzeResponse:
    customer = customer_service.get_customer_or_404(customer_id)
    masked_payload = {
        "behavioral_tags": customer.behavioral_tags.model_dump(),
        "deterministic_stats": customer.deterministic_stats.model_dump(),
    }
    try:
        ai_output = qwen_service.analyze_customer(masked_payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Qwen analyze failed: {exc}") from exc

    return AnalyzeResponse(
        customer_id=customer.customer_id,
        full_name=customer.pii_data.full_name,
        job_title=customer.pii_data.job_title,
        deterministic_stats=customer.deterministic_stats,
        recommended_product=ai_output["recommended_product"],
        behavioral_rationale=ai_output["behavioral_rationale"],
        statistical_evidence=ai_output["statistical_evidence"],
        sales_pitch_script=ai_output["sales_pitch_script"],
        risk_warning_and_upsell=ai_output["risk_warning_and_upsell"],
    )


@router.post("/copilot/{customer_id}", response_model=CopilotResponse)
def copilot(customer_id: str, payload: CopilotRequest) -> CopilotResponse:
    customer = customer_service.get_customer_or_404(customer_id)
    masked_payload = {
        "behavioral_tags": customer.behavioral_tags.model_dump(),
        "deterministic_stats": customer.deterministic_stats.model_dump(),
    }
    try:
        analysis = qwen_service.analyze_customer(masked_payload)
        reply = qwen_service.copilot_reply(
            customer=customer,
            analysis=analysis,
            message=payload.message,
            history=payload.history,
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Qwen copilot failed: {exc}") from exc

    return CopilotResponse(reply=reply)
