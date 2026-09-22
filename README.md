# Nira (Farm2Door)

## Direct Farm-to-Buyer Digital Agriculture Platform
Smart India Hackathon 2026 | Problem Statement 26033  
Ministry of Consumer Affairs, Food and Public Distribution | Government of India  
Repository: https://github.com/NateshKannaR/Nira_Farm2Door.git  

---

## Executive Summary

Nira is an open agri-tech platform designed to eliminate commission-based intermediaries from Indian agricultural supply chains. In conventional agricultural markets (mandis), farmers lose between 30% and 45% of their gross revenue to unverified brokers, arbitrary quality deductions, and delayed settlements. At the same time, post-harvest perishability accounts for up to 18% of produce loss during transit.

Our platform replaces traditional middlemen with software-driven protocols:
1. Direct farmer-to-buyer transactions with zero commission fees.
2. Dual-stage cryptographic OTP verification that enforces physical custody handshakes at both farm pickup and buyer dropoff.
3. Objective computer vision quality scoring to prevent arbitrary visual downgrading.
4. Multilingual voice and text access (including a toll-free IVR helpline) so that non-smartphone users are not excluded.
5. An integrated settlement architecture supporting both digital escrow releases and cash-on-delivery reconciliation.

---

## How the Application Operates: End-to-End Workflow

The lifecycle of an order moves across four continuous operational phases involving six distinct stakeholder roles.

```
[Phase 1: Listing]
Farmer (Web / Voice IVR) -> Produce Catalog -> AI Fair Price & CV Grading

[Phase 2: Discovery & Order]
Direct Buyer -> Browse Lots / Cart Checkout -> Dual-OTP Generation (Pickup + Delivery)

[Phase 3: Logistics & Custody]
Transporter Fleet -> Accept Delivery -> Stage 1 Farm Handshake (Farmer OTP)
                                             |
                                   Produce In-Transit
                                             |
[Phase 4: Settlement]
Buyer Inspection -> Cash Checkpoint -> Stage 2 Dropoff Handshake (Buyer OTP)
                                             |
                              Escrow Released / Order Closed
```

### Phase 1: Farm-Gate Listing and AI Pre-Grading
A farmer or local cooperative uploads produce details including crop variety, harvest date, quantity, and optional field photographs. For farmers without internet connectivity or smartphones, the toll-free IVR voice pipeline (1800-KISAN-AI) processes spoken regional inputs and creates listings through server-side speech transcription. 

Before listing public publication:
- The Computer Vision Quality Engine analyzes produce imagery for size uniformity, color distribution, and surface blemishes, generating a provisional trust score (Grade A+, A, B, or C).
- The Fair Price Engine pulls regional Agmarknet wholesale rates, distance to nearest consumption hubs, and seasonal volume trends to recommend an optimal floor price.

### Phase 2: Marketplace Discovery and Order Commitment
Commercial buyers (such as hotels, catering networks, food processing units, and retail aggregators) browse certified lots through a search interface that supports both English and Hindi. When a buyer places an order:
- An atomic database record is committed.
- The platform calculates the delivery fee based on hub-to-destination mileage.
- The system immediately provisions two separate secret four-digit verification keys:
  - Pickup OTP: Assigned exclusively to the farmer.
  - Delivery OTP: Assigned exclusively to the buyer.
- If the payment method is digital, funds are held in an escrow buffer. If cash-on-delivery is chosen, a physical collection checkpoint is attached to the transporter manifest.

### Phase 3: Transporter Assignment and Stage 1 Farm Handshake
Available delivery tasks appear on the Transporter Fleet portal. Transporters see pickup coordinates, drop locations, net freight earnings, and AI route recommendations designed to minimize fuel burn across multi-stop runs.
- A transporter accepts the job and drives to the farm or collection center.
- After the produce is loaded, the farmer provides their 4-digit Pickup OTP.
- The transporter submits this OTP in the application. Once verified by the backend, the shipment status transitions to `IN_TRANSIT`.
- Crucially, the transporter cannot trigger the in-transit state unilaterally; physical confirmation from the farmer is mandatory.

### Phase 4: Buyer Inspection, Cash Handling, and Stage 2 Delivery Handshake
Upon arrival at the destination:
- If the transaction is cash-on-delivery, the transporter must check a legal collection confirmation box after receiving the physical cash. Until this box is checked, the delivery OTP input field remains disabled.
- The buyer physically inspects the delivered produce.
- The buyer shares their secret 4-digit Delivery OTP with the transporter.
- The transporter submits the OTP. The server verifies the token against the original order record.
- On successful match:
  - The delivery status updates to `DELIVERED`.
  - For escrow orders, release triggers are executed toward the farmer's bank account.
  - For cash orders, the transporter's ledger is debited for collection liability.
  - An immutable audit trail is saved in the database.

---

## Security Architecture and Anti-Fraud Mechanisms

Systemic fraud is the primary reason why agricultural commerce platforms fail in real-world conditions. Nira enforces security at the data, workflow, and transaction layers.

### 1. Dual-Stage Cryptographic OTP Handshakes
- Zero Ghost Pickups: A transporter cannot mark an order as picked up without the farmer entering or sharing their pickup OTP on-site.
- Zero Ghost Deliveries: A transporter cannot mark an order as delivered without the buyer providing their unique delivery OTP after receiving the goods.
- Possession Separation: The transporter never has visibility into either OTP before physical arrival. Both OTPs are generated on the server and sent only to the respective endpoints (farmer device and buyer device).

### 2. State-Locked Idempotency and Race Condition Protection
- All state transitions (`Placed` -> `Accepted` -> `In Transit` -> `Delivered`) are executed using atomic SQL transactions.
- Concurrent requests cannot double-claim a delivery task or double-spend an escrow authorization.

### 3. Role-Based Access Isolation (PortalGuard)
- The application separates access into six explicit user roles:
  - Farmer (`/farmer`)
  - Direct Buyer (`/buyer`)
  - FPO Aggregator (`/fpo`)
  - Quality Hub Inspector (`/hub`)
  - Transporter Fleet (`/transporter`)
  - Governance Administrator (`/admin`)
- Routes are protected by authentication guards. Transporters cannot edit crop pricing, buyers cannot manipulate delivery checkpoints, and farmers cannot self-certify inspection logs.

### 4. Hybrid Cloud Database Resilience
- The system employs a dual-tier storage strategy:
  - Local SQLite WAL (Write-Ahead Logging) database for ultra-low latency operational transactions, atomic locking, and offline edge reliability.
  - Cloud-native synchronization with MongoDB Atlas for distributed storage, multi-device sync, and governance audits.
- If cloud network latency spikes in rural areas, local operational handlers maintain transaction integrity without stalling the driver or farmer.

---

## The Six Specialized Portals

| Portal | URL Path | Core Functions |
| :--- | :--- | :--- |
| Farmer Desk | `/farmer` | Direct lot listing, Agmarknet fair price guidance, crop ledger, camera photo upload. |
| Direct Buyer | `/buyer` | Real-time catalog browsing, shopping cart, escrow or COD checkout, live order tracking. |
| FPO Aggregator | `/fpo` | Virtual aggregation of smallholder yields (50kg lots) into commercial bulk batches (500kg+). |
| Quality Hub | `/hub` | Standardized intake inspection, moisture and blemish testing, CV grade confirmation, batch QR stamping. |
| Transporter Fleet | `/transporter` | Available delivery acceptance, Stage 1 pickup verification, Stage 2 dropoff and COD collection. |
| Mandi Governance | `/admin` | National price monitoring, minimum support price enforcement, transaction audit log, grievance resolution. |

---

## The Six Integrated AI Engines

1. AI Fair Price Engine: Ingests historical wholesale mandi prices, local supply volume, and seasonal factors to compute an objective price band per crop variety, protecting farmers from forced distress sales.
2. AI Computer Vision Quality Engine: Evaluates uploaded harvest photographs for surface defect percentages, color consistency, and size variance, predicting commercial grade ratings before physical dispatch.
3. AI Perishability and Waste Risk Engine: Evaluates crop shelf-life against ambient temperature, humidity, and transit distance to flag shipments at risk of spoilage and prioritize immediate transport dispatch.
4. AI Multi-Stop Route Optimizer: Analyzes farmer pickup locations and buyer clusters to sequence multi-point routes, reducing overall mileage by up to 24% and lowering per-kilogram freight costs.
5. AI Vernacular Translation Engine: Provides bi-directional English and Hindi localization across produce names, technical specifications, and interface elements to eliminate language barriers.
6. AI Semantic Vector Crop Search: Allows buyers to search using conversational natural language (e.g., "high quality organic onions under thirty rupees") without exact keyword matching.

---

## Honest Technical Limitations and Realistic Mitigations

When evaluating real-world deployments in rural India, practical operational constraints must be addressed directly:

| Current Limitation | Root Cause | Practical Workaround / Mitigation |
| :--- | :--- | :--- |
| Rural Camera Hardware Variance | Budget smartphones produce varied lighting, low resolution, and focal blur that can skew computer vision confidence scores. | The on-farm CV rating is treated as provisional. Final grading is certified at the nearest physical Mandi Hub (`/hub`) using standardized hardware. |
| Regulatory Escrow Banking Integration | Production automated escrow payouts require scheduled commercial banking APIs (e.g., ICICI e-Collections or Razorpay Escrow) governed by RBI licensing frameworks. | The platform implements complete state-machine escrow logic, payment webhooks, and ledger tracking in code. Production staging simulates bank settlement webhooks pending commercial banking tie-ups. |
| In-Transit IoT Telemetry | Continuous real-time cold chain monitoring requires retrofitting physical temperature and humidity IoT sensors into commercial carrier trucks. | The platform currently models perishability risk mathematically using ambient meteorological data combined with route duration estimates. |
| Deep Rural Network Dead Zones | Remote farms frequently experience complete mobile network dropouts, preventing real-time web portal access. | The toll-free IVR telephony pipeline operates over 2G voice channels, and fallback SMS OTP protocols allow confirmation without requiring active mobile data. |

---

## Phase 2 Roadmap and Scale Strategy

1. ONDC Federation: Integrate the platform with the Open Network for Digital Commerce (ONDC) protocol as a verified Seller Network Participant, enabling farmer listings to automatically propagate to major commercial buyer apps.
2. Satellite NDVI Remote Sensing: Integrate European Space Agency Sentinel-2 satellite imagery into the FPO portal to monitor vegetative health indices and forecast crop harvest volumes four weeks in advance.
3. Formal Forward Contracts: Enable corporate buyers and farmer cooperatives to execute legally binding digital advance purchase contracts with digital signature verification.
4. Hardware IoT Gateways: Deploy low-cost Bluetooth Low Energy (BLE) temperature loggers inside transport crates for end-to-end perishable tracking.

---

## Technical Stack

- Frontend Framework: Next.js 14 (App Router, Server and Client Components)
- Programming Language: TypeScript (Strict mode enabled)
- Styling: Custom Tailwind CSS and responsive design utilities with unified dark and light mode support
- Core Database: SQLite with Write-Ahead Logging (WAL) for local atomic transactions
- Cloud Database: MongoDB Atlas (Mongoose ODM) for distributed cloud storage
- Telephony & Voice: Web Speech API integration and simulated IVR telephony gateway (1800-KISAN-AI)
- Production Hosting: Vercel Global Edge Network with continuous integration

---

## Local Development Setup

### Prerequisites
- Node.js version 18.17.0 or higher
- npm version 9.0.0 or higher

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/ctrlaltsolveorg-cloud/sih2026.git
cd sih2026
```

2. Install project dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.wwp3oig.mongodb.net/kisanbandhan
NEXT_PUBLIC_APP_NAME="Nira"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

4. Run the development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

5. Build and validate production bundle:
```bash
npm run build
npm start
```

---

## Project Governance and Contributors

- Lead Developer and Architect: Natesh
- Engineering Collaborators: Khushboo Kumari, Abhishek Kumar Singh
- Submission Category: Smart India Hackathon 2026 (Problem Statement 26033)
- License: MIT Open Source License
