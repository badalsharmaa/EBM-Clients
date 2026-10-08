# EBM Clients - CRM & Lead Acquisition System

A client relationship management (CRM) and intelligence system designed for regional business expansion, dealer network management, and sales automation in Aligarh and North India.

## 🌟 Overview

This repository contains:
1. **Interactive Web CRM (`/web-crm`)**: React 19 + TypeScript + Vite + Tailwind CSS dashboard with Kanban pipeline, instant WhatsApp integration, cold outreach script generators, search & filtering, and Excel import/export.
2. **Master Excel CRM (`EBM_Clients_Lead_Management_CRM.xlsx`)**: 20-column executive workbook with real-time KPI formulas, dropdown validation, hyperlinks for emails/websites, and WhatsApp chat links.
3. **Python CRM Generator (`generate_crm_excel.py`)**: Script that reads `clients.json` and programmatically generates the styled multi-tab Excel workbook.
4. **Client Database (`clients.json`)**: 30 enriched company profiles across Locks & Hardware, Healthcare, Logistics, Hospitality, and Pharma with decision-maker contacts, verified emails, websites, physical addresses, products, and tailored EBM pitches.
5. **Research & Strategy Playbook (`deep-research-report.md`)**: Comprehensive guide on data enrichment, inbound/outbound marketing channels, compliance (GDPR/privacy), and a 30-60-90 day growth plan.

---

## 🚀 Web CRM Quickstart

```bash
cd web-crm
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Key Features:
- **Table & Kanban Pipeline Views**: Move leads across 6 stages (`Uncontacted` → `Contacted` → `Meeting Pitched` → `Proposal Sent` → `Closed - Won` → `Closed - Lost`).
- **One-Click Outreach**: Direct WhatsApp chat links, phone dialer, and email links.
- **Copy-Paste Pitch Scripts**: Instant customized WhatsApp, Email, Phone Call (30-second opening), and LinkedIn scripts for each client.
- **Bi-directional Excel Sync**: Export and import leads directly to `.xlsx`.

---

## 📊 Generating the Excel CRM

To regenerate the styled Excel workbook from `clients.json`:

```bash
python3 generate_crm_excel.py
```

---

## 🏢 Target Client Segments (30 Enriched Accounts)
- **Locks & Hardware**: Duke Locks, Euro India, Atom Lock (Wolf Enterprises), Ashoka Locks, Yamuna Exports, Laxmi Locks India, VIJAYAN, Tyler Locks, Palam Locks, Victory Locks, etc.
- **Healthcare & Hospitals**: K K Hospital & Heart Centre, Maxfort Multispeciality, Dheeraj Hospital.
- **Logistics & Transport**: SRD Logistics, Devansh Transport Company.
- **Hospitality**: Lemon Tree Hotel Aligarh, Fortune Park (ITC Hotels).
- **Pharma & Chemicals**: Swaroop Pharmaceuticals, SRG Chemical Industries.
