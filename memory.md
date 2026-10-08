# Project Memory: EBM Clients CRM & Lead Management System

**Last Updated:** October 8, 2026  
**Primary User:** Badal Sharma  
**Live Production URL:** [https://web-crm-azure.vercel.app](https://web-crm-azure.vercel.app)  
**GitHub Repository:** [https://github.com/badalsharmaa/EBM-Clients](https://github.com/badalsharmaa/EBM-Clients) (`main` branch)

---

## 1. Project Overview & Architecture

A regional client acquisition and lead management CRM tailored for business expansion, dealer network automation, and sales outreach in **Aligarh and North India**.

### Stack & Tools
- **Frontend App (`web-crm/`):** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, SheetJS (`xlsx`).
- **Data Stores:** `clients.json` (canonical database of 30 enriched company profiles), `localStorage` (`ebm_crm_leads`).
- **Excel CRM Generator:** `generate_crm_excel.py` (Python `openpyxl`) producing `EBM_Clients_Lead_Management_CRM.xlsx`.
- **Strategy & Playbook:** `deep-research-report.md`, `Executive Summary.pdf`.
- **Hosting & CI/CD:** GitHub (`badalsharmaa/EBM-Clients`) linked with Vercel Production deployment.

---

## 2. Key Components & Implementation Details

### A. Web CRM (`web-crm/src/`)
- **`App.tsx`:**
  - **Responsive Dual-View:** Detailed 8-column data table on desktop (`hidden md:block`); native touch cards on mobile (`md:hidden`).
  - **Mobile Touch Cards:** Includes rank avatar, company & brand title, industry chip, priority badge, decision-maker tag, 2-line opportunity highlight, address snippet, and instant action buttons (WhatsApp, Call, Email, Details).
  - **KPI Metrics Carousel:** Desktop 4-grid; mobile horizontally scrollable carousel with snap points.
  - **Kanban Pipeline:** 6 stages (`Uncontacted` → `Contacted` → `Meeting Pitched` → `Proposal Sent` → `Closed - Won` → `Closed - Lost`). On mobile, includes an interactive Stage Tab Filter (`All`, `Uncontacted (15)`, `Contacted (6)`, etc.).
  - **Mobile Bottom Navigation Bar:** Sticky frosted-glass nav bar (`Leads`, `Pipeline`, `Export`, `Reset`) with iOS safe-area inset support (`pb-safe`).
  - **Universal Search:** Instant multi-field filtering across company name, brand, decision maker, email, website, address, products, and notes.

- **`LeadDetailModal.tsx`:**
  - **iOS-Style Native Bottom Sheet:** Slides up from bottom (`animate-slide-up`, `rounded-t-3xl sm:rounded-2xl`, top pull-bar indicator on mobile).
  - **Quick Action Bar:** Direct WhatsApp chat (pre-filled pitch), Direct Email (`mailto:`), Phone dialer (`tel:`), and Website link.
  - **Client Intelligence Dossier:** Displays verified address in Aligarh, manufactured products/services, identified pain point, and tailored EBM pitch hook.
  - **Dynamic Outreach Script Generator:** Copy-paste ready scripts for WhatsApp/SMS, Cold Email, 30-Second Phone Call opening, and LinkedIn connection note.

- **`excelSync.ts`:**
  - Exports and imports all 20 enriched columns with auto-sized column widths and executive summary sheets.

- **`index.html` & `index.css`:**
  - Mobile viewport set to `viewport-fit=cover, user-scalable=no`.
  - Added iOS web app meta tags (`apple-mobile-web-app-capable`, `theme-color: #0f172a`).
  - Native utilities: `-webkit-tap-highlight-color: transparent`, `overscroll-behavior-y: none`, `touch-press` (`active:scale-95`), `pb-safe`, `no-scrollbar`.

### B. Master Excel Workbook (`EBM_Clients_Lead_Management_CRM.xlsx`)
- **Sheet 1: Executive Dashboard:** Live KPI cards and breakdown tables using Excel formulas (`COUNTIF`, `COUNTA`, `SUM`).
- **Sheet 2: Lead Pipeline:** 20 columns containing all 30 enriched companies with live `HYPERLINK` formulas for WhatsApp, Email, and Website, plus dropdown validations for Status and Priority.
- **Sheet 3: Outreach Scripts & Guides:** Actionable cold outreach templates.
- **Sheet 4: 30-60-90 Day Plan:** Phased execution roadmap.

---

## 3. Database Summary: 30 Enriched Client Leads

All 30 accounts in `clients.json` have verified:
1. Decision Maker Name & Role
2. Direct Mobile / WhatsApp & Office Landline
3. Verified Business Email Address
4. Official Website URL
5. Physical Street Address in Aligarh
6. Specific Product Lines & Offerings
7. Identified Operational Pain Point
8. Tailored EBM Value Proposition & Hook

### Industry Breakdown:
- **Locks & Hardware (20 accounts):** Duke Locks (Adarsh Industries), Euro India Architectural Hardware, Atom Lock (Wolf Enterprises - Naveen Brijwasi), Ashoka Locks (Ashish Agarwal), Yamuna Exports (Pawan Kumar), Laxmi Locks India (Karan Agrawal), Agon / Sachin Mfg, Scientific Lock Industries, Locks & Locking Devices / VIJAYAN (Eshank Bansal), Lico Lock, Tyler Locks (Deep Industries), Palam Locks (Siddhartha Bothra), Victory Locks (Mohd. Izhar), Asia Locks, Avinash Mfg, Cent Metal, Lakhdatar Industries, Dware Products, Home Fit Exports, Ekkam International Hardware.
- **Healthcare & Hospitals (3 accounts):** K K Hospital & Heart Centre (Dr. K.K. Sharma), Maxfort Multispeciality Hospital, Dheeraj Hospital & Trauma Centre (Dr. Dheeraj Singh).
- **Logistics & Transport (2 accounts):** SRD Logistics Pvt Ltd (Sanjay Agarwal), Devansh Transport Company.
- **Hospitality & Hotels (2 accounts):** Lemon Tree Hotel Aligarh, Fortune Park Aligarh (ITC Hotels Group).
- **Pharma & Chemicals (2 accounts):** Swaroop Pharmaceuticals Pvt Ltd (Vivek Swaroop), SRG Chemical Industries (S.R. Gupta).

---

## 4. User Preferences & Workflow Guidelines

1. **Step-by-Step Guidance:** User prefers clear, client-by-client execution plans (e.g. starting with verified top accounts like Ashoka Locks).
2. **Mobile-First Sensibility:** Interfaces must feel native, responsive, and tactile on smartphones (safe-area insets, bottom sheets, large tap targets, haptic active states).
3. **Continuous Deployment:** All updates must be committed to GitHub and synced with Vercel production.
