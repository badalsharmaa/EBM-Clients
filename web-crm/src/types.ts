export interface ClientLead {
  id: string;
  rank: number;
  company: string;
  brand_name?: string;
  contact: string;
  office_phone?: string;
  email?: string;
  website?: string;
  address?: string;
  decision_maker: string | null;
  products?: string;
  ebm_opportunity: string;
  pain_point?: string;
  outreach_hook?: string;
  industry: 'Locks & Hardware' | 'Healthcare & Hospitals' | 'Logistics & Transport' | 'Hospitality & Hotels' | 'Chemical & Pharma';
  status: '1. Uncontacted' | '2. Contacted' | '3. Meeting Pitched' | '4. Proposal Sent' | '5. Closed - Won' | '6. Closed - Lost';
  priority: 'High' | 'Medium' | 'Low';
  last_contact_date?: string;
  next_followup_date?: string;
  notes?: string;
  estimated_deal_value?: number; // in INR
}

export function categorizeIndustry(company: string, opp: string): ClientLead['industry'] {
  const c = company.toLowerCase();
  const o = opp.toLowerCase();
  if (c.includes('hospital') || o.includes('hospital') || c.includes('patient')) {
    return 'Healthcare & Hospitals';
  }
  if (c.includes('logistics') || c.includes('transport') || o.includes('fleet') || o.includes('dispatch')) {
    return 'Logistics & Transport';
  }
  if (c.includes('hotel') || o.includes('guest')) {
    return 'Hospitality & Hotels';
  }
  if (c.includes('chemical') || c.includes('pharma') || o.includes('pharmaceuticals')) {
    return 'Chemical & Pharma';
  }
  return 'Locks & Hardware';
}

export function cleanPhoneNumber(phone: string): string | null {
  if (!phone || phone.toLowerCase().includes('verify') || phone.toLowerCase().includes('not surfaced')) {
    return null;
  }
  const firstNum = phone.split('/')[0];
  const digits = firstNum.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length > 10) {
    return `91${digits.slice(-10)}`;
  }
  return null;
}
