import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const Contact = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Thank you for contacting us! Message sent.', 'success');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Support Desk
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight">Contact Our Team</h1>
        <p className="text-slate-400 text-sm">Have a question about our demo platform or referral rules? Get in touch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Email Us</span>
                <p className="text-sm font-bold text-white">support@demo-investment.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Call Us</span>
                <p className="text-sm font-bold text-white">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-600/10 text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Location</span>
                <p className="text-sm font-bold text-white">FinTech Hub, Bengaluru, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
            <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="How can we help you?"
              />
            </div>

            <Button type="submit" variant="primary" isLoading={loading} icon={Send} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
