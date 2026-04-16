from __future__ import annotations

import json
import re
from typing import Any

from openai import OpenAI

from app.config import Settings
from app.schemas import PRODUCT_NAMES, CopilotMessage, CustomerRecord


class QwenService:
    def __init__(self, settings: Settings, product_catalog: dict) -> None:
        self.client = OpenAI(
            api_key=settings.qwen_api_key,
            base_url=settings.base_url,
        )
        self.model = settings.qwen_model
        self.product_catalog = product_catalog
        self.allowed_products = set(PRODUCT_NAMES)

    @staticmethod
    def _extract_json(raw_content: str) -> dict[str, Any]:
        raw_content = raw_content.strip()
        try:
            payload = json.loads(raw_content)
            if isinstance(payload, dict):
                return payload
        except json.JSONDecodeError:
            pass

        match = re.search(r"\{[\s\S]*\}", raw_content)
        if not match:
            raise ValueError("Qwen did not return a valid JSON payload")
        return json.loads(match.group(0))

    @staticmethod
    def _to_list(value: Any) -> list[str]:
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        if isinstance(value, str) and value.strip():
            chunks = [chunk.strip(" -•\n\t") for chunk in re.split(r"\n|;|•", value)]
            return [chunk for chunk in chunks if chunk]
        return []

    def _chat_completion(self, messages: list[dict[str, str]], json_mode: bool = False) -> str:
        params: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2,
        }
        if json_mode:
            params["response_format"] = {"type": "json_object"}

        response = self.client.chat.completions.create(**params)
        content = response.choices[0].message.content
        if isinstance(content, list):
            return "".join(str(part) for part in content)
        return str(content or "")

    def analyze_customer(self, masked_payload: dict[str, Any]) -> dict[str, Any]:
        system_prompt = (
            "Bạn là 'Trợ lý tác chiến chốt sale Shinhan'. "
            "Bạn chỉ được dùng đúng 3 sản phẩm sau: "
            f"{', '.join(PRODUCT_NAMES)}. "
            "Bối cảnh Product Catalog:\n"
            f"{json.dumps(self.product_catalog, ensure_ascii=False)}\n\n"
            "Bắt buộc trả về JSON thuần với các trường:\n"
            "recommended_product, behavioral_rationale, statistical_evidence, "
            "sales_pitch_script, risk_warning_and_upsell.\n"
            "Không thêm trường khác, không markdown."
        )
        user_prompt = (
            "Phân tích khách hàng thin-file từ dữ liệu đã ẩn PII sau, "
            "đưa ra Next Best Offer và kịch bản gọi điện:\n"
            f"{json.dumps(masked_payload, ensure_ascii=False)}"
        )

        raw_content = self._chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            json_mode=True,
        )
        payload = self._extract_json(raw_content)

        recommended_product = str(payload.get("recommended_product", "")).strip()
        if recommended_product not in self.allowed_products:
            raise ValueError(
                "Qwen returned product outside Shinhan catalog. "
                f"Got: {recommended_product or 'EMPTY'}"
            )

        script = str(payload.get("sales_pitch_script", "")).strip()
        if not script:
            raise ValueError("Qwen response missing sales_pitch_script")

        return {
            "recommended_product": recommended_product,
            "behavioral_rationale": self._to_list(payload.get("behavioral_rationale")),
            "statistical_evidence": self._to_list(payload.get("statistical_evidence")),
            "sales_pitch_script": script,
            "risk_warning_and_upsell": self._to_list(payload.get("risk_warning_and_upsell")),
        }

    def copilot_reply(
        self,
        customer: CustomerRecord,
        analysis: dict[str, Any],
        message: str,
        history: list[CopilotMessage],
    ) -> str:
        system_prompt = (
            "Bạn là AI Copilot hỗ trợ telesales Shinhan. "
            "Trả lời tiếng Việt ngắn gọn, thực chiến, không bịa dữ liệu, "
            "không vượt ngoài phạm vi 3 sản phẩm chính thức."
        )
        messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
        for item in history[-8:]:
            messages.append({"role": item.role, "content": item.content})

        user_payload = {
            "customer_id": customer.customer_id,
            "full_name": customer.pii_data.full_name,
            "job_title": customer.pii_data.job_title,
            "risk_score": customer.deterministic_stats.risk_score,
            "recommended_nbo_layer1": customer.deterministic_stats.recommended_nbo,
            "analysis_layer3": analysis,
            "user_question": message,
        }
        messages.append(
            {
                "role": "user",
                "content": json.dumps(user_payload, ensure_ascii=False),
            }
        )
        reply = self._chat_completion(messages)
        return reply.strip()
