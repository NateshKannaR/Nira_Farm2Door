# ⚡ KisanBandhan AI — Developer & Collaborator Quick-Start Guide

> **Welcome Collaborators & Developers!**  
> This guide is designed so you can analyze, run, and start contributing to **KisanBandhan AI (SIH 2026 PS 26033)** in **less than 2 minutes** without getting stuck on role permissions or searching through files.

---

## 🔑 1. Master Developer Login (Full Access / God Mode)

To test and develop any feature across the platform, you don't need to create 6 different accounts. We have built a **Universal Developer God Mode**:

### Quick Credentials:
| Field | Developer Master Account |
|---|---|
| **Email / ID** | `dev@kisanbandhan.ai` *(or `developer@kisanbandhan.ai` or `dev`)* |
| **Password** | `dev` *(or any 3+ char password)* |
| **Role Permissions** | **Universal SuperAdmin / Developer** *(Bypasses all PortalGuards)* |
| **1-Click Login** | Click **"⚡ 1-क्लिक डेवलपर मास्टर लॉगिन"** directly inside the Login Modal! |

### What this unlocks:
1. **Unrestricted Portal Access:** Full access to all 6 sub-portals:
   - 🚜 **Farmer Desk** (`/farmer`)
   - 🏢 **FPO Aggregator Hub** (`/fpo`)
   - 🛒 **Direct Buyer Portal** (`/buyer`)
   - 🔬 **Hub Quality Inspector** (`/hub`)
   - 🚚 **Transporter Fleet** (`/transporter`)
   - 🏛️ **National Governance Admin** (`/admin`)
2. **On-the-Fly Role Simulator:**
   - In the top navigation bar, click on your profile name → Open **⚡ Dev Role Simulator**.
   - Click any role (`FARMER`, `FPO`, `BUYER`, `HUB`, `FLEET`, `ADMIN`) to instantly simulate how that user sees the screen without logging out!
3. **PortalGuard Quick Jump Bar:**
   - Every protected portal displays a top quick-jump bar for developers with 1-click links to all other portals.

---

## 🚀 2. Local Setup in 60 Seconds

```bash
# 1. Clone repository (if not already cloned)
git clone https://github.com/ctrlaltsolveorg-cloud/sih2026.git
cd sih2026

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000 (or http://localhost:3001 if port 3000 is busy)
```

---

## 🧭 3. Fast Project Directory Map

```text
sih2026/
├── src/
│   ├── app/                      # Next.js 14 App Router (All Pages & APIs)
│   │   ├── page.tsx              # Public Marketplace & Live Mandi Ticker
│   │   ├── farmer/page.tsx       # 🚜 Farmer Desk: Crop listing, Voice, Fair Price AI
│   │   ├── buyer/page.tsx        # 🛒 Buyer Hub: Bulk contracts & Escrow checkout
│   │   ├── fpo/page.tsx          # 🏢 FPO Aggregator: Virtual lot pooling
│   │   ├── hub/page.tsx          # 🔬 Hub Inspector: Optical CV grading & QR codes
│   │   ├── transporter/page.tsx  # 🚚 Fleet Partner: GPS cold chain & Delivery OTP
│   │   ├── admin/page.tsx        # 🏛️ Gov Governance: Mandi oversight & MSP alerts
│   │   └── api/v1/               # Backend API Microservices (7 AI Engines + CRUD)
│   │       ├── ai/               # AI routes (quality-grade, fair-price, route, etc.)
│   │       ├── crops/            # Crop listings API & database CRUD
│   │       ├── ivr/              # 1800-KISAN-AI feature phone IVR/SMS endpoints
│   │       └── users/            # Auth & user sync
│   │
│   ├── components/               # Reusable UI Blocks
│   │   ├── Navbar.tsx            # Dark glass navbar with ticker & Dev Role Switcher
│   │   ├── PortalGuard.tsx       # Role authorization wrapper with Dev bypass
│   │   ├── AuthModal.tsx         # 1-Click Dev login, demo accounts & Google auth
│   │   ├── CartDrawer.tsx        # Smart Escrow checkout drawer
│   │   └── MultiLangTranslatorModal.tsx # 11-Indian language translator modal
│   │
│   ├── context/                  # Global State Providers
│   │   ├── AuthContext.tsx       # MongoDB Atlas + Dev login state
│   │   ├── RoleContext.tsx       # Active role simulation & switching
│   │   ├── LanguageContext.tsx   # 11 Indian Languages + Vernacular state
│   │   └── CartContext.tsx       # Buyer escrow cart state
│   │
│   └── lib/                      # Core Business Logic & Catalog
│       ├── cropCatalog.ts        # 352+ verified Indian crops catalog with rates
│       ├── fuzzyMatcher.ts       # Phonetic typo resolver ("baigan" -> बैंगन)
│       ├── i18n.ts               # Vernacular translation dictionaries (11 languages)
│       └── mongodb.ts           # MongoDB Atlas Mongoose connection
```

---

## ⚡ 4. Common Tasks: How to Do Things Fast

### A. How to Add or Modify a Crop
- Open `src/lib/cropCatalog.ts`.
- Add an entry to `FULL_CROP_CATALOG`:
  ```ts
  {
    id: 'crop_custom_1',
    name: 'Dragon Fruit',
    nameHi: 'ड्रैगन फ्रूट',
    category: 'Fruits',
    variety: 'Red Flesh Organic',
    pricePaise: 12000, // ₹120.00 / kg
    grade: 'Grade A+',
    isOrganic: 1,
    unit: 'kg',
  }
  ```
- It automatically propagates to the Marketplace, Search Bar, and Category filters.

### B. How to Test AI Quality Grading
- Route: `POST /api/v1/ai/quality-grade`
- Payload:
  ```json
  {
    "cropName": "Tomato",
    "moisture": 84,
    "defectPercentage": 2.5
  }
  ```
- Returns: FSSAI-certified Grade (`Grade A+`), Trust Score (`98%`), and recommended MSP premium.

### C. How to Test Fair Price Discovery
- Route: `POST /api/v1/ai/fair-price`
- Payload:
  ```json
  {
    "cropName": "Onion",
    "variety": "Nashik Red",
    "hubLocation": "Nashik"
  }
  ```
- Returns: Live Agmarknet Mandi rate, logistics cost deduction, and fair farmer payout guarantee.

---

## 🛠️ 5. Demo Accounts Quick Reference

| Role | Email | Password |
|---|---|---|
| **⚡ Lead Developer (Full Access)** | `dev@kisanbandhan.ai` | `dev` |
| 🚜 **Farmer (Ramesh Patil)** | `ramesh.patil@kisanbandhan.ai` | `Kisan#9824!Agri` |
| 🛒 **Direct Buyer (Annapurna)** | `annapurna@kisanbandhan.ai` | `Kisan#9824!Agri` |
| 🏢 **FPO Manager (Sanjay Deshmukh)** | `sanjay.fpo@kisanbandhan.ai` | `Kisan#9824!Agri` |
| 🔬 **Hub Operator (Rajesh Kulkarni)**| `rajesh.hub@kisanbandhan.ai` | `Kisan#9824!Agri` |
| 🚚 **Transporter (Vikram Fleet)** | `vikram.logistics@kisanbandhan.ai` | `Kisan#9824!Agri` |
| 🏛️ **National Admin (Governance)** | `admin@kisanbandhan.ai` | `Kisan#9824!Agri` |

---
*Maintained by CtrlAltSolve Team for SIH 2026 PS 26033*
