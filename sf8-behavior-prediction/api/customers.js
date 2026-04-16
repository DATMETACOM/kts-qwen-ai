import { loadCustomers } from "./_shared/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ detail: "Method not allowed" });
  }

  try {
    const customers = loadCustomers().map((customer) => ({
      customer_id: customer.customer_id,
      full_name: customer.pii_data.full_name,
      job_title: customer.pii_data.job_title,
      behavioral_tags: customer.behavioral_tags,
      risk_score: customer.deterministic_stats.risk_score,
      recommended_nbo: customer.deterministic_stats.recommended_nbo,
      lookalike_rate: customer.deterministic_stats.lookalike_rate,
    }));
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ detail: `Failed to load customers: ${error.message}` });
  }
}

