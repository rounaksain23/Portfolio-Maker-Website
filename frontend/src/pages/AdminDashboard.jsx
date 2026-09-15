import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import { Users, Mail, UserPlus, RefreshCw, Ban, CheckCircle, Copy, LogOut, Search, Globe, Shield, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [createdInviteLink, setCreatedInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteError('');
    setCreatedInviteLink('');
    setInviteLoading(true);

    try {
      const response = await api.post('/admin/invite', { email: inviteEmail });
      setCreatedInviteLink(response.data.setupUrl);
      setInviteEmail('');
      fetchCustomers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send invite.';
      setInviteError(msg);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleResendInvite = async (userId) => {
    try {
      const response = await api.post(`/admin/resend-invite/${userId}`);
      alert(`Invite token regenerated! Setup URL:\n${response.data.setupUrl}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend invite');
    }
  };

  const handleToggleDisable = async (userId) => {
    try {
      await api.put(`/admin/disable/${userId}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredCustomers = customers.filter(c =>
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Metrics
  const totalCount = customers.length;
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length;
  const invitedCount = customers.filter(c => c.status === 'INVITED').length;
  const publishedCount = customers.filter(c => c.published).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      
      {/* Top Navbar */}
      <nav style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.6rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Shield size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Superadmin Dashboard</h1>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Portfolio Platform Management</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} color="#818cf8" /> {user?.email}
            </span>
            <button className="btn-secondary" onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL CUSTOMERS</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>{totalCount}</h2>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>ACTIVE CUSTOMERS</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>{activeCount}</h2>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>PENDING INVITES</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>{invitedCount}</h2>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>PORTFOLIOS PUBLISHED</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>{publishedCount}</h2>
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={() => { setShowInviteModal(true); setCreatedInviteLink(''); setInviteError(''); }}>
            <UserPlus size={18} /> Invite New Customer
          </button>
        </div>

        {/* Customer Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
                <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Portfolio</th>
                <th style={{ padding: '1rem 1.25rem' }}>Joined / Invited</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No customers found. Click "Invite New Customer" to send your first invite!</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{c.name || 'Account Pending'}</div>
                      <div style={{ fontSize: '0.83rem', color: '#94a3b8' }}>{c.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {c.status === 'ACTIVE' && <span className="badge badge-active"><CheckCircle size={12}/> Active</span>}
                      {c.status === 'INVITED' && <span className="badge badge-invited">Invited</span>}
                      {c.status === 'DISABLED' && <span className="badge badge-disabled">Disabled</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {c.published ? (
                        <a
                          href={`/portfolio/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                        >
                          <Globe size={14} /> /portfolio/{c.slug} <ExternalLink size={12}/>
                        </a>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{c.portfolioCreated ? 'Draft' : 'Not Created'}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        {c.status === 'INVITED' && c.setupUrl && (
                          <button
                            className="btn-secondary"
                            onClick={() => copyToClipboard(c.setupUrl)}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                            title="Copy setup link for testing"
                          >
                            <Copy size={14}/> Copy Link
                          </button>
                        )}
                        {c.status === 'INVITED' && (
                          <button
                            className="btn-secondary"
                            onClick={() => handleResendInvite(c.id)}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          >
                            <RefreshCw size={14}/> Resend
                          </button>
                        )}
                        <button
                          className={c.status === 'DISABLED' ? 'btn-secondary' : 'btn-danger'}
                          onClick={() => handleToggleDisable(c.id)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          {c.status === 'DISABLED' ? 'Enable' : 'Disable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>

      {/* Invite Customer Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Invite New Customer</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Enter the customer's email. We'll generate a unique 48h activation link and trigger an email invite.</p>

            {inviteError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {inviteError}
              </div>
            )}

            {createdInviteLink ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Invite Generated & Email Triggered!</p>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.6rem', borderRadius: '0.375rem', wordBreak: 'break-all', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
                  {createdInviteLink}
                </div>
                <button className="btn-primary" onClick={() => copyToClipboard(createdInviteLink)} style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem' }}>
                  <Copy size={16} /> {copiedLink ? 'Copied to Clipboard!' : 'Copy Activation Link'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit}>
                <div className="form-group">
                  <label className="form-label">Customer Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="customer@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={inviteLoading}>
                    {inviteLoading ? 'Sending Invite...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            )}

            {createdInviteLink && (
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setShowInviteModal(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
