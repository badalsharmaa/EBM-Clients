import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  Mail, 
  Send, 
  Calendar, 
  User, 
  FileText, 
  Copy, 
  Check, 
  X,
  ExternalLink,
  Globe,
  MapPin,
  Package,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import type { ClientLead } from './types';
import { cleanPhoneNumber } from './types';

interface LeadModalProps {
  lead: ClientLead;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ClientLead) => void;
}

export const LeadDetailModal: React.FC<LeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ClientLead>(lead);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'scripts'>('details');

  if (!isOpen) return null;

  const waNumber = cleanPhoneNumber(formData.contact);
  const rawRecipient = formData.decision_maker && !formData.decision_maker.toLowerCase().includes('not')
    ? formData.decision_maker.split('/')[0].split('(')[0].split('—')[0].trim() 
    : 'Sir/Ma\'am';

  // Templates from deep-research-report.md tailored to this enriched lead
  const whatsappPitch = `Namaste ${rawRecipient}, Badal here from EBM Solutions in Aligarh. We help companies like ${formData.company} streamline their operations (${formData.ebm_opportunity}). We recently helped similar organizations eliminate 10+ hours of manual work and respond instantly to customer inquiries. Would you be open for a quick 5-min intro call this week? Reply Y/N. (P.S. Reply STOP to opt-out)`;

  const coldEmailPitch = `Subject: Modernizing ${formData.company}'s sales & dealer workflows\n\nHi ${rawRecipient},\n\nI noticed ${formData.company}'s strong presence in the market. We recently helped similar organizations implement ${formData.ebm_opportunity}, which drastically cut down inquiry response times and centralized incoming buyer leads.\n\nKey advantage for ${formData.company}:\n• ${formData.outreach_hook || 'Instant digital catalogue and automated lead follow-ups.'}\n\nWould you be open to a quick 10-minute introductory conversation this Thursday or Friday?\n\nBest regards,\nBadal Sharma | EBM Solutions\nPhone: +91 98XXXXXXXX\n(P.S. Reply STOP to unsubscribe)`;

  const linkedInNote = `Hi ${rawRecipient}, I've been following ${formData.company}'s work in ${formData.industry}. We help regional businesses streamline their operations and customer pipelines (${formData.ebm_opportunity}). Would love to connect and share brief insights!`;

  const phoneCallScript = `"Namaste ${rawRecipient}, Badal baat kar raha hoon EBM Solutions Aligarh se. 1 minute baat ho sakti hai?\n\nHum Aligarh me ${formData.industry} ke liye custom digital systems banate hain—specifically for ${formData.ebm_opportunity}.\n\nMain aapke sales & operations process ko samajhne ke liye ek 5-minute ka brief call schedule karna chahta tha. Kya kal dopahar 3 baje comfortable rahega?"`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center items-end bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 animate-slide-up sm:animate-in sm:zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Pull / Drag Indicator for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 bg-slate-900 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-500/60 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-4 sm:top-5 sm:right-5 text-blue-200 hover:text-white p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all touch-press"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-wrap items-center gap-2 mb-2 pr-8">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/30 border border-blue-400/40 text-blue-200">
              Rank #{formData.rank}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {formData.industry}
            </span>
            {formData.website && (
              <a 
                href={formData.website} 
                target="_blank" 
                rel="noreferrer"
                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 hover:bg-white/20 text-blue-100 border border-white/20 flex items-center gap-1 transition-colors"
              >
                <Globe className="w-3 h-3 text-blue-300" />
                <span className="truncate max-w-[120px]">
                  {formData.website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}
                </span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 pr-8">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 shrink-0" />
            <span className="truncate">{formData.company}</span>
          </h2>
          {formData.brand_name && formData.brand_name !== formData.company && (
            <p className="text-xs text-blue-300 italic mt-0.5">
              Operating brand: {formData.brand_name}
            </p>
          )}

          <p className="text-blue-200 text-xs sm:text-sm mt-1.5 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Opportunity: <strong className="text-white font-medium">{formData.ebm_opportunity}</strong></span>
          </p>

          {/* Quick Action Touch Bar */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-800/60">
            {waNumber && (
              <a 
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappPitch)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all touch-press"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
            {formData.email && (
              <a 
                href={`mailto:${formData.email}?subject=${encodeURIComponent(`Modernizing ${formData.company}'s sales & dealer workflows`)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all touch-press"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
            {formData.contact && !formData.contact.toLowerCase().includes('not') && (
              <a 
                href={`tel:${formData.contact.split('/')[0].trim()}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all touch-press"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
            <button
              onClick={() => setActiveTab('scripts')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all touch-press ml-auto"
            >
              <Send className="w-3.5 h-3.5" />
              Scripts
            </button>
          </div>
        </div>

        {/* iOS Native Segmented Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors touch-press ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Client Intelligence & Notes
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors touch-press ${
              activeTab === 'scripts'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Outreach Scripts (WA / Email / Call)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'details' ? (
            <div className="space-y-5">
              {/* Intelligence Summary Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {formData.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-700 block">Address in Aligarh:</strong>
                      <span className="text-slate-600">{formData.address}</span>
                    </div>
                  </div>
                )}
                {formData.products && (
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-700 block">Products / Services:</strong>
                      <span className="text-slate-600">{formData.products}</span>
                    </div>
                  </div>
                )}
                {formData.pain_point && (
                  <div className="flex items-start gap-2 col-span-1 md:col-span-2 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 block font-semibold">Identified Pain Point:</strong>
                      <span className="text-amber-800">{formData.pain_point}</span>
                    </div>
                  </div>
                )}
                {formData.outreach_hook && (
                  <div className="flex items-start gap-2 col-span-1 md:col-span-2 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/60">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-900 block font-semibold">EBM Pitch Hook:</strong>
                      <span className="text-emerald-800">{formData.outreach_hook}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Input Fields (Optimized touch targets for mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value="1. Uncontacted">1. Uncontacted</option>
                    <option value="2. Contacted">2. Contacted</option>
                    <option value="3. Meeting Pitched">3. Meeting Pitched</option>
                    <option value="4. Proposal Sent">4. Proposal Sent</option>
                    <option value="5. Closed - Won">5. Closed - Won</option>
                    <option value="6. Closed - Lost">6. Closed - Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Decision Maker / Contact
                  </label>
                  <input
                    type="text"
                    value={formData.decision_maker || ''}
                    placeholder="e.g. Ashish Agarwal — Director"
                    onChange={(e) => setFormData({ ...formData, decision_maker: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Primary Mobile / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Office Phone
                  </label>
                  <input
                    type="text"
                    value={formData.office_phone || ''}
                    placeholder="+91 571 2780166"
                    onChange={(e) => setFormData({ ...formData, office_phone: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    placeholder="info@company.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    placeholder="https://company.com"
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Last Contact Date
                  </label>
                  <input
                    type="date"
                    value={formData.last_contact_date || ''}
                    onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.next_followup_date || ''}
                    onChange={(e) => setFormData({ ...formData, next_followup_date: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Notes, Logs & Software Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  placeholder="Record client responses, meeting outcome, interest level, or custom software requirements..."
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-blue-900">
                <span>
                  Pitch scripts tailored for <strong>{formData.company}</strong> ({rawRecipient}).
                </span>
                {formData.email && (
                  <span className="text-blue-700 font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    {formData.email}
                  </span>
                )}
              </div>

              {/* WhatsApp Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    WhatsApp / SMS Pitch
                  </span>
                  <button
                    onClick={() => copyToClipboard(whatsappPitch, 'wa')}
                    className="text-xs flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs touch-press active:scale-95"
                  >
                    {copiedType === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'wa' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-700 font-sans whitespace-pre-wrap bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                  {whatsappPitch}
                </p>
              </div>

              {/* Phone Call Script */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-amber-100 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-600" />
                    30-Second Phone Pitch
                  </span>
                  <button
                    onClick={() => copyToClipboard(phoneCallScript, 'phone')}
                    className="text-xs flex items-center gap-1 text-amber-700 hover:text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs touch-press active:scale-95"
                  >
                    {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'phone' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-700 font-sans whitespace-pre-wrap bg-white p-3 rounded-xl border border-amber-100 leading-relaxed">
                  {phoneCallScript}
                </p>
              </div>

              {/* Email Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Cold Email Pitch
                  </span>
                  <button
                    onClick={() => copyToClipboard(coldEmailPitch, 'email')}
                    className="text-xs flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs touch-press active:scale-95"
                  >
                    {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'email' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-700 font-mono whitespace-pre-wrap bg-white p-3 rounded-xl border border-blue-100 leading-relaxed">
                  {coldEmailPitch}
                </p>
              </div>

              {/* LinkedIn Note */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    LinkedIn Connection Request Note
                  </span>
                  <button
                    onClick={() => copyToClipboard(linkedInNote, 'li')}
                    className="text-xs flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs touch-press active:scale-95"
                  >
                    {copiedType === 'li' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'li' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {linkedInNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer with Safe Area Support */}
        <div className="p-3.5 sm:p-4 pb-safe bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-800 font-medium touch-press active:scale-95 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm transition-all touch-press cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
