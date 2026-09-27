import React, { useState } from 'react';
import { User, Mail, Phone, Gift, Calendar, Save, Camera } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, mobile, avatar });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage personal contact details and view account metadata.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-8">
        {/* Profile Avatar Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-800 pb-6">
          <div className="relative group">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300 mt-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Referral Code: {user?.referralCode}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <Input label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address (Read-only)" icon={Mail} value={user?.email || ''} readOnly />
            <Input label="Mobile Number" icon={Phone} value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </div>

          <Input
            label="Avatar Image URL"
            icon={Camera}
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 uppercase font-semibold">Account Role</span>
              <span className="font-bold text-white capitalize">{user?.role || 'User'}</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase font-semibold">Member Since</span>
              <span className="font-semibold text-slate-300">{formatDate(user?.createdAt)}</span>
            </div>
          </div>

          <Button type="submit" variant="emerald" isLoading={saving} icon={Save} className="w-full">
            Save Profile Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
