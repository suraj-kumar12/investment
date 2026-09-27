import React, { useState, useEffect } from 'react';
import { Users, Lock, Unlock, ShieldAlert, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentName) => {
    try {
      const updated = await adminService.toggleUserBlockStatus(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      showToast(
        `User ${currentName} status changed to ${updated.status}`,
        updated.status === 'BLOCKED' ? 'error' : 'success'
      );
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Directory of registered investor accounts and status controls.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            icon={Search}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        {loading ? (
          <Skeleton type="table" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase font-semibold">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Mobile</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4">Total Investment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.mobile}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{u.referralCode}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(u.totalInvestment)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={u.status}>{u.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      {u.status === 'BLOCKED' ? (
                        <Button
                          variant="emerald"
                          size="sm"
                          icon={Unlock}
                          onClick={() => handleToggleBlock(u.id, u.name)}
                        >
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Lock}
                          onClick={() => handleToggleBlock(u.id, u.name)}
                        >
                          Block
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
