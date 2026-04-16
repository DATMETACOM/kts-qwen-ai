"""Generate mock customer dataset for Cuca-Insider-AI PoC."""

from __future__ import annotations

import csv
import json
import random
from pathlib import Path

PRODUCTS = (
    "Vay tín chấp cá nhân",
    "Thẻ tín dụng THE FIRST",
    "Vay mua ô tô",
)

LAST_NAMES = [
    "Nguyễn",
    "Trần",
    "Lê",
    "Phạm",
    "Hoàng",
    "Võ",
    "Đặng",
    "Bùi",
    "Đỗ",
    "Hồ",
]
MIDDLE_NAMES = ["Văn", "Thị", "Minh", "Quang", "Ngọc", "Anh", "Tuấn", "Hoài", "Gia", "Khánh"]
FIRST_NAMES = [
    "An",
    "Bình",
    "Châu",
    "Duy",
    "Em",
    "Giang",
    "Hùng",
    "Khôi",
    "Lan",
    "My",
    "Nam",
    "Nhi",
    "Phúc",
    "Quân",
    "Sơn",
    "Thảo",
    "Trang",
    "Uyên",
    "Vi",
    "Yến",
]

E_WALLET_TAGS = [
    "Giao dịch cao",
    "Thường hết hạn mức",
    "Thanh toán điện nước đúng hạn",
    "Mua sắm online nhiều",
    "Ưu tiên quét QR tại cửa hàng",
    "Hay trả góp kỳ hạn ngắn",
    "Lịch sử hoàn tiền ổn định",
]

SOCIAL_TAGS = [
    "Thích check-in sang chảnh",
    "Quan tâm xe hơi",
    "Thường xuyên săn sale",
    "Theo dõi reviewer tài chính",
    "Quan tâm du lịch gia đình",
    "Xem nội dung nâng cấp tài sản",
    "Tìm hiểu mẹo tiết kiệm",
]

TELCO_TAGS = [
    "Dùng gói Data MAX",
    "Lịch sử > 3 năm",
    "Hay nạp thẻ lẻ tẻ",
    "Cước tháng ổn định",
    "Thường xuyên roaming công tác",
    "Ưu tiên gói gọi ngoại mạng",
]

JOB_POOL = [
    "Nhân viên kinh doanh",
    "Chuyên viên marketing",
    "Kỹ sư phần mềm",
    "Trưởng nhóm bán hàng",
    "Quản lý cửa hàng",
    "Nhân viên hành chính",
    "Tư vấn bảo hiểm",
    "Kế toán doanh nghiệp",
    "Quản lý dự án",
    "Tài xế công nghệ",
    "Chủ shop online",
    "Nhân viên ngân hàng",
]


def build_full_name(rng: random.Random) -> str:
    return f"{rng.choice(LAST_NAMES)} {rng.choice(MIDDLE_NAMES)} {rng.choice(FIRST_NAMES)}"


def infer_nbo(behavioral_tags: dict[str, list[str]], rng: random.Random) -> str:
    scores = {product: 1 for product in PRODUCTS}
    joined = " | ".join(
        behavioral_tags["e_wallet"] + behavioral_tags["social_media"] + behavioral_tags["telco"]
    )

    if "Quan tâm xe hơi" in joined or "nâng cấp tài sản" in joined:
        scores["Vay mua ô tô"] += 6
    if "săn sale" in joined or "hoàn tiền" in joined or "Mua sắm online nhiều" in joined:
        scores["Thẻ tín dụng THE FIRST"] += 6
    if "điện nước đúng hạn" in joined or "cước tháng ổn định" in joined:
        scores["Vay tín chấp cá nhân"] += 5

    weighted_pool: list[str] = []
    for product, score in scores.items():
        weighted_pool.extend([product] * score)
    return rng.choice(weighted_pool)


def infer_risk(behavioral_tags: dict[str, list[str]], rng: random.Random) -> str:
    joined = " | ".join(
        behavioral_tags["e_wallet"] + behavioral_tags["social_media"] + behavioral_tags["telco"]
    )
    risk_base = 45

    if "Lịch sử > 3 năm" in joined or "Cước tháng ổn định" in joined:
        risk_base -= 18
    if "Thanh toán điện nước đúng hạn" in joined:
        risk_base -= 12
    if "Hay nạp thẻ lẻ tẻ" in joined or "Thường hết hạn mức" in joined:
        risk_base += 15

    noise = rng.randint(-10, 10)
    score = max(0, min(100, risk_base + noise))
    if score < 35:
        return "Low"
    if score < 65:
        return "Medium"
    return "High"


def generate_customer(index: int, rng: random.Random) -> dict:
    behavioral_tags = {
        "e_wallet": rng.sample(E_WALLET_TAGS, 2),
        "social_media": rng.sample(SOCIAL_TAGS, 2),
        "telco": rng.sample(TELCO_TAGS, 2),
    }

    recommended_nbo = infer_nbo(behavioral_tags, rng)
    risk_score = infer_risk(behavioral_tags, rng)
    lookalike_rate = rng.randint(8, 25)

    return {
        "customer_id": f"CUS{index:03d}",
        "pii_data": {
            "full_name": build_full_name(rng),
            "phone": f"09{rng.randint(10000000, 99999999)}",
            "job_title": rng.choice(JOB_POOL),
        },
        "behavioral_tags": behavioral_tags,
        "deterministic_stats": {
            "risk_score": risk_score,
            "recommended_nbo": recommended_nbo,
            "lookalike_rate": lookalike_rate,
        },
    }


def write_csv(customers: list[dict], csv_path: Path) -> None:
    fieldnames = [
        "customer_id",
        "full_name",
        "phone",
        "job_title",
        "e_wallet",
        "social_media",
        "telco",
        "risk_score",
        "recommended_nbo",
        "lookalike_rate",
    ]
    with csv_path.open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for customer in customers:
            writer.writerow(
                {
                    "customer_id": customer["customer_id"],
                    "full_name": customer["pii_data"]["full_name"],
                    "phone": customer["pii_data"]["phone"],
                    "job_title": customer["pii_data"]["job_title"],
                    "e_wallet": " | ".join(customer["behavioral_tags"]["e_wallet"]),
                    "social_media": " | ".join(customer["behavioral_tags"]["social_media"]),
                    "telco": " | ".join(customer["behavioral_tags"]["telco"]),
                    "risk_score": customer["deterministic_stats"]["risk_score"],
                    "recommended_nbo": customer["deterministic_stats"]["recommended_nbo"],
                    "lookalike_rate": customer["deterministic_stats"]["lookalike_rate"],
                }
            )


def main() -> None:
    rng = random.Random(20260416)
    root = Path(__file__).resolve().parent
    json_path = root / "customers_data.json"
    csv_path = root / "SF8_Customers_Mock.csv"

    customers = [generate_customer(idx, rng) for idx in range(1, 51)]

    json_path.write_text(
        json.dumps(customers, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_csv(customers, csv_path)
    print(f"Generated {len(customers)} customers -> {json_path}")
    print(f"Generated CSV -> {csv_path}")


if __name__ == "__main__":
    main()
