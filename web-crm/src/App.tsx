import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  Search, 
  Download, 
  Upload, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Award, 
  Layers, 
  Kanban, 
  Table, 
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Globe,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

import type { ClientLead } from './types';
import { categorizeIndustry, cleanPhoneNumber } from './types';
import rawClientsData from './clients.json';
import { LeadDetailModal } from './LeadDetailModal';
import { exportLeadsToExcel, importLeadsFromExcel } from './excelSync';

const STATUS_STAGES: ClientLead['status'][] = [
  '1. Uncontacted',
  '2. Contacted',
  '3. Meeting Pitched',
  '4. Proposal Sent',
  '5. Closed - Won',
  '6. Closed - Lost'
];

export function App() {
  const [leads, setLeads] = useState<ClientLead[]>(() => {
    const seedLeads: ClientLead[] = rawClientsData.map((item: any, idx: number) => ({
      id: `seed-${item.rank || idx + 1}`,
      rank: item.rank || idx + 1,
      company: item.company,
      brand_name: item.brand_name,
      contact: item.contact,
      office_phone: item.office_phone,
      email: item.email,
      website: item.website,
      address: item.address,
      decision_maker: item.decision_maker,
      products: item.products,
      ebm_opportunity: item.ebm_opportunity,
      pain_point: item.pain_point,
      outreach_hook: item.outreach_hook,
      industry: categorizeIndustry(item.company, item.ebm_opportunity),
      status: '1. Uncontacted' as const,
      priority: (item.rank <= 10 ? 'High' : 'Medium') as ClientLead['priority'],
      last_contact_date: '',
      next_followup_date: '',
      notes: '',
    }));

    const saved = localStorage.getItem('ebm_crm_leads');
    if (saved) {
      try {
        const parsed: ClientLead[] = JSON.parse(saved);
        // Merge enriched fields from seed into parsed while preserving user changes
        return seedLeads.map(seed => {
          const existing = parsed.find(p => p.rank === seed.rank || p.id === seed.id);
          if (existing) {
            return {
              ...seed,
              status: existing.status || seed.status,
              priority: existing.priority || seed.priority,
              last_contact_date: existing.last_contact_date || '',
              next_followup_date: existing.next_followup_date || '',
              notes: existing.notes || '',
              estimated_deal_value: existing.estimated_deal_value,
            };
          }
          return seed;
        });
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
    return seedLeads;
  });

  const [activeView, setActiveView] = useState<'pipeline' | 'table'>('table');
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('ebm_crm_leads', JSON.stringify(leads));
  }, [leads]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = leads.length;
    const uncontacted = leads.filter(l => l.status === '1. Uncontacted').length;
    const inProgress = leads.filter(l => l.status === '2. Contacted' || l.status === '3. Meeting Pitched' || l.status === '4. Proposal Sent').length;
    const won = leads.filter(l => l.status === '5. Closed - Won').length;
    return { total, uncontacted, inProgress, won };
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        lead.company.toLowerCase().includes(q) ||
        (lead.brand_name && lead.brand_name.toLowerCase().includes(q)) ||
        lead.ebm_opportunity.toLowerCase().includes(q) ||
        (lead.decision_maker && lead.decision_maker.toLowerCase().includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.website && lead.website.toLowerCase().includes(q)) ||
        (lead.address && lead.address.toLowerCase().includes(q)) ||
        (lead.products && lead.products.toLowerCase().includes(q)) ||
        lead.contact.includes(searchQuery);

      const matchesIndustry = selectedIndustry === 'All' || lead.industry === selectedIndustry;
      const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [leads, searchQuery, selectedIndustry, selectedStatus]);

  const handleUpdateLead = (updated: ClientLead) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    showNotification(`Updated ${updated.company}`);
  };

  const handleStatusChange = (id: string, newStatus: ClientLead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleExport = () => {
    exportLeadsToExcel(leads);
    showNotification('Exported current leads to Excel (.xlsx)!');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importLeadsFromExcel(file);
      if (imported.length > 0) {
        setLeads(imported);
        showNotification(`Successfully imported ${imported.length} leads from Excel!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to parse Excel file. Please ensure valid format.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetToOriginal = () => {
    if (confirm('Reset all leads to original clients.json dataset?')) {
      localStorage.removeItem('ebm_crm_leads');
      window.location.reload();
    }
  };

  const openLead = (lead: ClientLead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const industries = ['All', 'Locks & Hardware', 'Healthcare & Hospitals', 'Logistics & Transport', 'Hospitality & Hotels', 'Chemical & Pharma'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-lg tracking-wider text-white shadow-md shadow-blue-500/20">
              EBM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">Lead Management System</h1>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  CRM Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">Target Accounts & Digital Expansion Pipeline</p>
            </div>
          </div>

          {/* Sync & Export Controls */}
          <div className="flex items-center gap-2.5">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportFile} 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-2xs"
              title="Import spreadsheet (.xlsx or .csv)"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              Import Excel
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              title="Export complete pipeline to formatted Excel file"
            >
              <Download className="w-3.5 h-3.5" />
              Export to Excel (.xlsx)
            </button>

            <button
              onClick={resetToOriginal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset data to initial clients.json"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Accounts</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Sourced from Aligarh Directory</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Uncontacted</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{metrics.uncontacted}</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Awaiting initial outreach</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">In Progress</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">{metrics.inProgress}</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Contacted, Pitching or Sent</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Deals Closed</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{metrics.won}</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Converted EBM clients</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters and View Switcher */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, decision makers, opportunity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          {/* Facet Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Industry:</span>
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-2">
              <span>Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="All">All Statuses</option>
              {STATUS_STAGES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* View Switcher Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl ml-auto border border-slate-200">
              <button
                onClick={() => setActiveView('table')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Table
              </button>
              <button
                onClick={() => setActiveView('pipeline')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'pipeline' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                Pipeline Kanban
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Table View */}
        {activeView === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-12">#</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Company Name</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Decision Maker</th>
                    <th className="py-3.5 px-4">Industry</th>
                    <th className="py-3.5 px-4 min-w-[240px]">EBM Opportunity</th>
                    <th className="py-3.5 px-4 min-w-[170px]">Status</th>
                    <th className="py-3.5 px-4 text-center">Priority</th>
                    <th className="py-3.5 px-4 text-center min-w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => {
                    const waNum = cleanPhoneNumber(lead.contact);
                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                        onClick={() => openLead(lead)}
                      >
                        <td className="py-3 px-4 text-center text-xs font-semibold text-slate-400">
                          {lead.rank}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                            {lead.company}
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-400 hover:text-blue-600 inline-flex items-center"
                                title={`Visit ${lead.website}`}
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                            <span>{lead.contact}</span>
                            {lead.email && (
                              <span className="text-[11px] text-slate-400 font-sans truncate max-w-[140px]" title={lead.email}>
                                • {lead.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          {lead.decision_maker ? (
                            <span className="text-slate-800 font-medium">{lead.decision_maker}</span>
                          ) : (
                            <span className="text-slate-400 italic">Not publicly verified</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {lead.industry}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 max-w-xs">
                          {lead.ebm_opportunity}
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-lg border focus:outline-hidden ${
                              lead.status === '5. Closed - Won' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              lead.status === '1. Uncontacted' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {STATUS_STAGES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            lead.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                            lead.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {waNum ? (
                              <a
                                href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Namaste, reaching out from EBM regarding ${lead.company} and our ${lead.ebm_opportunity} solution.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                                title="Open WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            ) : null}
                            {lead.email ? (
                              <a
                                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Modernizing ${lead.company}'s sales & dealer workflows`)}`}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                title={`Send Email to ${lead.email}`}
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            ) : null}
                            <button
                              onClick={() => openLead(lead)}
                              className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-0.5"
                            >
                              Details
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 2: Kanban Pipeline View */}
        {activeView === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
            {STATUS_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter(l => l.status === stage);
              return (
                <div key={stage} className="bg-slate-100/70 p-3 rounded-2xl border border-slate-200 min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {stage.replace(/^\d\.\s*/, '')}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2.5">
                    {stageLeads.map((lead) => {
                      const waNum = cleanPhoneNumber(lead.contact);
                      return (
                        <div
                          key={lead.id}
                          onClick={() => openLead(lead)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400">#{lead.rank}</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                              lead.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {lead.priority}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {lead.company}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {lead.ebm_opportunity}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                            {lead.address && (
                              <span className="flex items-center gap-0.5 truncate max-w-[110px]" title={lead.address}>
                                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                {lead.address.split(',')[0]}
                              </span>
                            )}
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-0.5 text-blue-500 hover:text-blue-700 ml-auto shrink-0"
                              >
                                <span>Web</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[100px]">
                              {lead.decision_maker ? lead.decision_maker.split('/')[0].split('(')[0].split('—')[0] : 'Needs Contact'}
                            </span>
                            {waNum && (
                              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                                <MessageSquare className="w-3 h-3" />
                                WhatsApp
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Selected Lead Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateLead}
        />
      )}
    </div>
  );
}
export default App;
