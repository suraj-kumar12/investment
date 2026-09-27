import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { showToast } = useToast();

  const refUrlParam = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: refUrlParam,
  });

  const [isRefReadOnly, setIsRefReadOnly] = useState(!!refUrlParam);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refUrlParam) {
      setFormData((prev) => ({ ...prev, referralCode: refUrlParam }));
      setIsRefReadOnly(true);
    }
  }, [refUrlParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.referralCode && !/^[A-Z0-9]{3,10}$/i.test(formData.referralCode)) {
      newErrors.referralCode = 'Invalid referral code format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        referralCode: formData.referralCode,
      });

      showToast('Registration successful! Welcome to ApexInvest.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400">Join ApexInvest to manage investments and earn referral rewards.</p>
        </div>

        {formData.referralCode && (
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
            <Gift className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Invited by referral code <strong className="text-white font-mono">{formData.referralCode}</strong>.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            icon={User}
            placeholder="e.g. Rahul Sharma"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Mobile Number"
              name="mobile"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Input
            label="Referral Code (Optional)"
            name="referralCode"
            icon={Gift}
            placeholder="e.g. SUR123"
            value={formData.referralCode}
            onChange={handleChange}
            readOnly={isRefReadOnly}
            error={errors.referralCode}
            helperText={
              isRefReadOnly
                ? 'Referral code automatically locked from your invitation link.'
                : 'Enter a valid referral code if you were invited.'
            }
          />

          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Registration alone awards $0. The referrer receives $100 only after you successfully complete an eligible payment.
            </span>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={ArrowRight} className="w-full mt-4">
            Create Account & Continue
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
