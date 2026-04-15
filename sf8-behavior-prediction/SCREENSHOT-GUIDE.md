# SF8 Screenshot Guide

## Required Screenshots (4-6 for DevPost)

### Screenshot 1: Dashboard Overview
- **URL**: `/` (root)
- **What to capture**: Full dashboard view
- **Key elements visible**: 
  - 4 stat cards (Total, Push Now, Nurture, Hold)
  - Hero case highlight card
  - Product distribution
  - Customer lead list table
- **File name**: `01-dashboard-overview.png`

### Screenshot 2: Hero Case Customer Detail
- **URL**: `/customer/c001` (or highest scoring customer)
- **What to capture**: Customer detail top section
- **Key elements visible**:
  - Customer name and profile
  - Overall score (large number)
  - Action badge (push now/nurture/hold)
  - Recommended product
- **File name**: `02-hero-case-overview.png`

### Screenshot 3: Score Breakdown
- **URL**: `/customer/c001`
- **What to capture**: Score breakdown section
- **Key elements visible**:
  - 4 score bars (Partner/Channel, Behavior, Reaction, Affinity)
  - Alternative data signals panel
  - AI explanation section
- **File name**: `03-score-breakdown.png`

### Screenshot 4: Simulation
- **URL**: `/customer/c001` (scroll to simulation panel)
- **What to capture**: After running simulation
- **Key elements visible**:
  - Simulation controls (dropdowns)
  - Base score vs simulated score
  - Delta result (highlight the + or - number)
- **File name**: `04-simulation-result.png`

### Screenshot 5: Export/Pitch View
- **URL**: `/export`
- **What to capture**: Full export card
- **Key elements visible**:
  - Customer profile section
  - AI recommendation with score breakdown
  - AI explanation (blue box)
  - Personalized outreach note (green box)
- **File name**: `05-export-pitch.png`

### Screenshot 6: Simulation Workspace (Optional)
- **URL**: `/simulation`
- **What to capture**: Portfolio simulation results
- **Key elements visible**:
  - Simulation controls at top
  - Table with multiple customers and their deltas
- **File name**: `06-simulation-workspace.png`

---

## Screenshot Specs
- **Resolution**: 1920x1080 minimum
- **Format**: PNG or JPG
- **Max size**: 5 MB each (per DevPost rules)
- **Best ratio**: 3:2
- **Browser**: Chrome/Firefox, clean window, no dev tools visible

## How to Capture
1. Run `npm run dev` to start dev server
2. Open `http://localhost:5173`
3. Navigate to each view
4. Use browser screenshot or OS screenshot tool
5. Crop to show relevant sections
6. Save with specified file names
