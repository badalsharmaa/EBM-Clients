import * as XLSX from 'xlsx';
import type { ClientLead } from './types';

export function exportLeadsToExcel(leads: ClientLead[]) {
  // Format for excel sheet
  const rows = leads.map((lead) => ({
    'Rank': lead.rank,
    'Company Name': lead.company,
    'Brand Name': lead.brand_name || lead.company,
    'Decision Maker': lead.decision_maker || 'Not publicly verified',
    'Industry': lead.industry,
    'Primary Phone': lead.contact,
    'Office Phone': lead.office_phone || '',
    'Email Address': lead.email || '',
    'Website': lead.website || '',
    'Address / Location': lead.address || '',
    'Products / Offerings': lead.products || '',
    'EBM Opportunity': lead.ebm_opportunity,
    'Identified Pain Point': lead.pain_point || '',
    'Outreach Pitch Hook': lead.outreach_hook || '',
    'Pipeline Status': lead.status,
    'Priority': lead.priority,
    'Last Contact Date': lead.last_contact_date || '',
    'Next Follow-up': lead.next_followup_date || '',
    'Notes & Feedback': lead.notes || '',
    'Estimated Deal Value (INR)': lead.estimated_deal_value || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },  // Rank
    { wch: 32 }, // Company
    { wch: 28 }, // Brand
    { wch: 26 }, // Decision maker
    { wch: 22 }, // Industry
    { wch: 20 }, // Primary Phone
    { wch: 20 }, // Office Phone
    { wch: 26 }, // Email
    { wch: 28 }, // Website
    { wch: 38 }, // Address
    { wch: 40 }, // Products
    { wch: 38 }, // EBM Opp
    { wch: 38 }, // Pain Point
    { wch: 38 }, // Outreach Hook
    { wch: 18 }, // Status
    { wch: 12 }, // Priority
    { wch: 16 }, // Last Contact
    { wch: 16 }, // Next Follow-up
    { wch: 35 }, // Notes
    { wch: 20 }, // Value
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lead Pipeline');

  // Summary Metrics Sheet
  const total = leads.length;
  const contacted = leads.filter(l => l.status !== '1. Uncontacted').length;
  const won = leads.filter(l => l.status === '5. Closed - Won').length;
  const lost = leads.filter(l => l.status === '6. Closed - Lost').length;

  const summaryRows = [
    { 'Metric': 'Total Leads', 'Value': total },
    { 'Metric': 'Contacted / In Progress', 'Value': contacted },
    { 'Metric': 'Closed - Won', 'Value': won },
    { 'Metric': 'Closed - Lost', 'Value': lost },
    { 'Metric': 'Conversion Rate (%)', 'Value': total > 0 ? `${((won / total) * 100).toFixed(1)}%` : '0%' },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  const filename = `EBM_Leads_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function importLeadsFromExcel(file: File): Promise<ClientLead[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

        const importedLeads: ClientLead[] = json.map((row, idx) => ({
          id: `lead-import-${Date.now()}-${idx}`,
          rank: Number(row['Rank'] || idx + 1),
          company: String(row['Company Name'] || row['company'] || `Company ${idx + 1}`),
          contact: String(row['Contact Phone'] || row['contact'] || ''),
          decision_maker: row['Decision Maker'] || row['decision_maker'] || null,
          ebm_opportunity: String(row['EBM Opportunity'] || row['ebm_opportunity'] || ''),
          industry: (row['Industry'] || 'Locks & Hardware') as ClientLead['industry'],
          status: (row['Pipeline Status'] || row['status'] || '1. Uncontacted') as ClientLead['status'],
          priority: (row['Priority'] || row['priority'] || 'Medium') as ClientLead['priority'],
          last_contact_date: row['Last Contact Date'] || '',
          next_followup_date: row['Next Follow-up'] || '',
          notes: row['Notes & Feedback'] || row['notes'] || '',
          estimated_deal_value: row['Estimated Deal Value (INR)'] ? Number(row['Estimated Deal Value (INR)']) : undefined,
        }));

        resolve(importedLeads);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
