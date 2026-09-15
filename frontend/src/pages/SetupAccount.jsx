import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import { UserCheck, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const SetupAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setTokenError('No invite token provided in URL link.');
      setValidating(false);
      return;
    }

    const checkToken = async () => {
      try {
        await api.get(`/auth/validate-invite?token=${token}`);
        setTokenValid(true);
      } catch (err) {
        const msg = err.response?.data?.message || 'This invite link is invalid or has expired.';
        setTokenError(msg);
      } finally {
        setValidating(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (password.length < 6) {
      setSubmitError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/setup-account', {
        token,
        name,
        password
      });

      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Account setup failed. Please try again.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
        <p>Validating your invite link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '1.5rem' }}>
        <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Invalid or Expired Link</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>{tokenError}</p>
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div style={{ width: '100%', maxWidth: '460px' }} className="animate-fade-in">
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
            <UserCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>Set Up Your Account</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '0.25rem' }}>Complete your registration to build your portfolio</p>
        </div>

        <div className="glass-card" style={{ padding: '2.25rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          {submitError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} color="#34d399" /> Your Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={14} color="#34d399" /> Choose Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={14} color="#34d399" /> Confirm Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }} disabled={loading}>
              {loading ? 'Activating Account...' : 'Activate & Enter Dashboard'} <ArrowRight size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SetupAccount;
