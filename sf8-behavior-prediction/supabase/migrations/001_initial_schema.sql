-- SF8 Database Schema for Supabase
-- Phase 2: Add database for real customer data and score tracking
-- 
-- Run this in: Supabase Dashboard → SQL Editor

-- ============================================
-- 1. CUSTOMER PROFILES
-- ============================================

CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 65),
  income NUMERIC(15,2) CHECK (income > 0),
  occupation VARCHAR(100),
  
  -- Consent tracking (important for alternative data)
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  consent_method VARCHAR(20) CHECK (consent_method IN ('app', 'web', 'paper', 'verbal')),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE customers IS 'Customer profiles with consent tracking';


-- ============================================
-- 2. ALTERNATIVE DATA SOURCES
-- ============================================

CREATE TABLE alternative_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  source_type VARCHAR(20) CHECK (source_type IN ('telco', 'ewallet', 'ecommerce', 'social')),
  
  -- Actual data (flexible JSON structure)
  data JSONB NOT NULL,
  
  -- Provenance
  data_provider VARCHAR(50),  -- e.g., 'viettel', 'momo', 'shopee'
  provider_consent_id VARCHAR(100),  -- Reference to provider's consent record
  data_freshness TIMESTAMP,  -- When data was last updated at source
  
  -- Our tracking
  consent_id UUID,  -- Link to customer consent
  ingested_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(customer_id, source_type)
);

COMMENT ON TABLE alternative_data IS 'Alternative data from telco, e-wallet, ecommerce, social sources';

-- Indexes for performance
CREATE INDEX idx_alt_data_customer ON alternative_data(customer_id);
CREATE INDEX idx_alt_data_source ON alternative_data(source_type);
CREATE INDEX idx_alt_data_provider ON alternative_data(data_provider);


-- ============================================
-- 3. SCORE RECORDS
-- ============================================

CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Score breakdown
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  pcf_score INTEGER CHECK (pcf_score >= 0 AND pcf_score <= 100),
  bss_score INTEGER CHECK (bss_score >= 0 AND bss_score <= 100),
  erq_score INTEGER CHECK (erq_score >= 0 AND erq_score <= 100),
  pa_score INTEGER CHECK (pa_score >= 0 AND pa_score <= 100),
  
  -- Recommendation
  recommended_product_id VARCHAR(50) REFERENCES products(id),
  action VARCHAR(20) CHECK (action IN ('push now', 'nurture', 'hold')),
  confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  
  -- Tracking
  scored_at TIMESTAMP DEFAULT NOW(),
  scoring_version VARCHAR(20) DEFAULT '1.0.0',
  scoring_engine VARCHAR(20) DEFAULT 'deterministic',  -- or 'ml' in future
  metadata JSONB,  -- Additional context (e.g., simulation parameters)
  
  -- Who triggered the scoring
  triggered_by UUID REFERENCES auth.users(id),
  trigger_reason VARCHAR(100)  -- e.g., 'new_data', 'scheduled', 'manual'
);

COMMENT ON TABLE scores IS 'Score history with full breakdown for auditability';

-- Indexes
CREATE INDEX idx_scores_customer ON scores(customer_id, scored_at DESC);
CREATE INDEX idx_scores_action ON scores(action, scored_at DESC);
CREATE INDEX idx_scores_version ON scores(scoring_version);


-- ============================================
-- 4. PRODUCT CATALOG
-- ============================================

CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),  -- English name
  type VARCHAR(20) CHECK (type IN ('credit_card', 'personal_loan', 'sme_loan', 'insurance', 'bnpl')),
  
  -- Eligibility
  min_income NUMERIC(15,2),
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 65,
  target_segments TEXT[],  -- e.g., ['digital_native', 'young_professional']
  
  -- Product details
  description TEXT,
  features JSONB,  -- e.g., {'cashback_rate': 0.05, 'annual_fee': 0}
  terms_url VARCHAR(200),
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE products IS 'Shinhan Finance product catalog';

-- Index
CREATE INDEX idx_products_type ON products(type, active);


-- ============================================
-- 5. OUTREACH TRACKING
-- ============================================

CREATE TABLE outreaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  score_id UUID REFERENCES scores(id),  -- Link to the score that triggered this outreach
  
  -- Outreach details
  channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'phone', 'app', 'branch')),
  status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'converted', 'rejected', 'expired')),
  
  -- Content
  message_template VARCHAR(100),  -- Reference to template used
  personalized_note TEXT,  -- Qwen-generated outreach note
  
  -- Tracking
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  converted_at TIMESTAMP,
  rejected_at TIMESTAMP,
  
  -- Who managed this
  assigned_to UUID REFERENCES auth.users(id),  // Relationship manager
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE outreaches IS 'Track outreach campaigns and conversion funnel';

-- Indexes
CREATE INDEX idx_outreaches_customer ON outreaches(customer_id);
CREATE INDEX idx_outreaches_status ON outreaches(status, sent_at DESC);
CREATE INDEX idx_outreaches_assigned ON outreaches(assigned_to);
CREATE INDEX idx_outreaches_score ON outreaches(score_id);


-- ============================================
-- 6. AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- What happened
  action VARCHAR(50) NOT NULL,  -- e.g., 'score_created', 'data_updated', 'outreach_sent'
  resource_type VARCHAR(50),    -- e.g., 'customer', 'score', 'outreach'
  resource_id UUID,
  details JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Audit trail for compliance and debugging';

-- Indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);


-- ============================================
-- 7. ANALYTICS VIEWS
-- ============================================

-- Conversion funnel view
CREATE OR REPLACE VIEW v_conversion_funnel AS
SELECT 
  DATE_TRUNC('day', o.sent_at) AS date,
  COUNT(*) AS total_sent,
  COUNT(*) FILTER (WHERE o.opened_at IS NOT NULL) AS total_opened,
  COUNT(*) FILTER (WHERE o.clicked_at IS NOT NULL) AS total_clicked,
  COUNT(*) FILTER (WHERE o.converted_at IS NOT NULL) AS total_converted,
  ROUND(100.0 * COUNT(*) FILTER (WHERE o.opened_at IS NOT NULL) / NULLIF(COUNT(*), 0), 2) AS open_rate,
  ROUND(100.0 * COUNT(*) FILTER (WHERE o.clicked_at IS NOT NULL) / NULLIF(COUNT(*) FILTER (WHERE o.opened_at IS NOT NULL), 0), 2) AS click_rate,
  ROUND(100.0 * COUNT(*) FILTER (WHERE o.converted_at IS NOT NULL) / NULLIF(COUNT(*) FILTER (WHERE o.clicked_at IS NOT NULL), 0), 2) AS conversion_rate
FROM outreaches o
WHERE o.sent_at IS NOT NULL
GROUP BY DATE_TRUNC('day', o.sent_at)
ORDER BY date DESC;

-- Score distribution view
CREATE OR REPLACE VIEW v_score_distribution AS
SELECT 
  s.action,
  COUNT(*) AS customer_count,
  ROUND(AVG(s.overall_score), 1) AS avg_score,
  ROUND(AVG(s.confidence), 2) AS avg_confidence,
  s.recommended_product_id,
  p.name AS product_name
FROM scores s
LEFT JOIN products p ON s.recommended_product_id = p.id
WHERE s.scored_at >= NOW() - INTERVAL '30 days'
GROUP BY s.action, s.recommended_product_id, p.name
ORDER BY customer_count DESC;


-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Products: Public read (for catalog)
CREATE POLICY "Products are viewable by all"
  ON products FOR SELECT
  USING (active = TRUE);

-- Customers: Authenticated users can view
CREATE POLICY "Customers viewable by authenticated users"
  ON customers FOR SELECT
  TO authenticated
  USING (TRUE);

-- Alternative data: Only viewable by authenticated users
CREATE POLICY "Alt data viewable by authenticated users"
  ON alternative_data FOR SELECT
  TO authenticated
  USING (TRUE);

-- Scores: Viewable by authenticated users
CREATE POLICY "Scores viewable by authenticated users"
  ON scores FOR SELECT
  TO authenticated
  USING (TRUE);

-- Outreaches: Assigned users can view their own
CREATE POLICY "Outreaches viewable by assigned user"
  ON outreaches FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() OR assigned_to IS NULL);

-- Audit logs: Viewable by admins only (will add role check later)
CREATE POLICY "Audit logs viewable by authenticated users"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (TRUE);


-- ============================================
-- 9. TRIGGERS (Auto-update timestamps)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alt_data_updated_at
  BEFORE UPDATE ON alternative_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreaches_updated_at
  BEFORE UPDATE ON outreaches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 10. SEED DATA (7 Shinhan Finance Products)
-- ============================================

INSERT INTO products (id, name, name_en, type, min_income, min_age, max_age, target_segments, description, features, display_order) VALUES
('cc_cashback', 'Thẻ tín dụng Cashback', 'Cashback Credit Card', 'credit_card', 15000000, 22, 60, 
  ARRAY['digital_native', 'young_professional', 'frequent_shopper'],
  'Hoàn tiền 5-10% cho mua sắm online và giao dịch e-wallet',
  '{"cashback_rate": 0.05, "annual_fee": 0, "credit_limit_min": 10000000, "credit_limit_max": 100000000}'::jsonb,
  1),

('cc_travel', 'Thẻ tín dụng Du lịch', 'Travel Credit Card', 'credit_card', 20000000, 25, 65,
  ARRAY['frequent_traveler', 'high_income', 'business_traveler'],
  'Tích dặm bay, bảo hiểm du lịch, ưu đãi khách sạn',
  '{"miles_rate": 1.5, "annual_fee": 500000, "travel_insurance": true, "lounge_access": true}'::jsonb,
  2),

('pl_personal', 'Vay cá nhân Shinhan', 'Personal Loan', 'personal_loan', 10000000, 22, 55,
  ARRAY['salaried', 'stable_income', 'government_employee'],
  'Vay tín chấp lãi suất ưu đãi, phê duyệt nhanh trong 24h',
  '{"interest_rate": 0.015, "max_amount": 500000000, "tenure_months": 60, "processing_fee": 0.01}'::jsonb,
  3),

('pl_sme', 'Vay doanh nghiệp nhỏ', 'SME Loan', 'sme_loan', 30000000, 25, 60,
  ARRAY['business_owner', 'freelancer', 'startup_founder'],
  'Vay vốn cho SME và hộ kinh doanh, hỗ trợ vốn lưu động',
  '{"interest_rate": 0.012, "max_amount": 2000000000, "tenure_months": 84, "collateral_required": false}'::jsonb,
  4),

('ins_health', 'Bảo hiểm sức khỏe', 'Health Insurance', 'insurance', 12000000, 18, 60,
  ARRAY['family', 'middle_age', 'health_conscious'],
  'Bảo hiểm toàn diện chi phí y tế, khám chữa bệnh không tiền mặt',
  '{"annual_limit": 100000000, "deductible": 1000000, "network_hospitals": 200, "dental_covered": true}'::jsonb,
  5),

('ins_life', 'Bảo hiểm nhân thọ', 'Life Insurance', 'insurance', 15000000, 22, 55,
  ARRAY['breadwinner', 'long_term_planner', 'family_oriented'],
  'Bảo vệ tài chính gia đình, tích lũy tiết kiệm',
  '{"sum_assured_min": 100000000, "premium_monthly_min": 500000, "term_years": 20, "savings_component": true}'::jsonb,
  6),

('bnpl_installment', 'Mua trước trả sau', 'Buy Now Pay Later', 'bnpl', 8000000, 18, 45,
  ARRAY['young_adult', 'first_time_buyer', 'online_shopper'],
  'Trả góp 0% cho đơn hàng online, phê duyệt tức thì',
  '{"interest_rate": 0, "max_installments": 12, "max_amount": 20000000, "approval_time_minutes": 5}'::jsonb,
  7)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  type = EXCLUDED.type,
  min_income = EXCLUDED.min_income,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  updated_at = NOW();


-- ============================================
-- VERIFICATION
-- ============================================

-- Check tables created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check products seeded
SELECT id, name, type, min_income, active 
FROM products 
ORDER BY display_order;

-- Check views created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;


-- ============================================
-- DONE! Next steps:
-- 1. Set up Supabase authentication
-- 2. Configure environment variables in Vercel
-- 3. Add Supabase client to SF8 app
-- ============================================
