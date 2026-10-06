

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Gift,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { register } = useAuth();
  const { showToast } = useToast();

  const refUrlParam = searchParams.get('ref')?.trim() || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: refUrlParam,
  });

  const [isRefReadOnly, setIsRefReadOnly] = useState(Boolean(refUrlParam));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refUrlParam) {
      setFormData((prev) => ({
        ...prev,
        referralCode: refUrlParam,
      }));

      setIsRefReadOnly(true);
    }
  }, [refUrlParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();
    const referralCode = formData.referralCode.trim();

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Referral code is mandatory
    if (!referralCode) {
      newErrors.referralCode = 'Referral code is required.';
    } else if (!/^[A-Z0-9]{3,20}$/i.test(referralCode)) {
      newErrors.referralCode = 'Invalid referral code format.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim(),
      });

      showToast(
        'Registration successful. Please sign in to continue.',
        'success'
      );

      navigate('/login');
    } catch (err) {
      // Registration failed:
      // Stay on the registration page.
      showToast(
        err?.message || 'Registration failed. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Create Account
          </h2>

          <p className="text-sm text-slate-400">
            Create your account to manage investments and referral activity.
          </p>
        </div>

        {formData.referralCode && (
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
            <Gift className="w-4 h-4 text-indigo-400 shrink-0" />

            <span>
              Invited by referral code{' '}
              <strong className="text-white font-mono">
                {formData.referralCode}
              </strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            icon={User}
            placeholder="Enter your full name"
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
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Mobile Number"
              name="mobile"
              icon={Phone}
              placeholder="Enter your mobile number"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Input
            label="Referral Code"
            name="referralCode"
            icon={Gift}
            placeholder="Enter referral code"
            value={formData.referralCode}
            onChange={handleChange}
            readOnly={isRefReadOnly}
            error={errors.referralCode}
            helperText={
              isRefReadOnly
                ? 'Referral code was provided through your invitation link.'
                : 'A valid referral code is required to create an account.'
            }
          />

          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />

            <span>
              <strong>Note:</strong> Referral rewards are credited only after
              the referred user completes an eligible payment that is
              successfully verified.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={ArrowRight}
            className="w-full mt-4"
          >
            Create Account & Continue
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-400 font-bold hover:underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};