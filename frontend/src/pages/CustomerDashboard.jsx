import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ImageCarousel from '../components/ImageCarousel';
import ThemeToggle from '../components/ThemeToggle';
import { User, Briefcase, GraduationCap, Layout, Eye, Globe, LogOut, Save, Plus, Trash2, Edit3, Upload, Check, Copy, ExternalLink, Sparkles, Code, Link2, X, Award, Download } from 'lucide-react';
import { exportPortfolioAsZip } from '../utils/exportPortfolioZip';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Portfolio State
  const [portfolio, setPortfolio] = useState({
    name: '',
    slug: '',
    title: '',
    tagline: '',
    bio: '',
    profileImageUrl: '',
    resumeUrl: '',
    phone: '',
    location: '',
    socialLinks: '{}',
    published: false,
    templateKey: 'modern-dark',
    projects: [],
    skills: [],
    educationList: [],
    experienceList: [],
    achievements: []
  });

  // Social Links helper state
  const [socials, setSocials] = useState({ github: '', linkedin: '', twitter: '', website: '' });

  // Project Modal State
  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projForm, setProjForm] = useState({ title: '', description: '', techStack: '', imageUrl: '', imageUrls: [], githubLink: '', liveLink: '', highlightStat1: '', highlightStat2: '' });

  // Skill Modal State
  const [skillModal, setSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', proficiency: 80 });

  // Experience Modal State
  const [expModal, setExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' });

  // Education Modal State
  const [eduModal, setEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });

  // Achievement Modal State
  const [achModal, setAchModal] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [achForm, setAchForm] = useState({ title: '', organization: '', duration: '', description: '' });

  const [copiedLink, setCopiedLink] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const handleDownloadZip = async () => {
    setExportingZip(true);
    try {
      showNotification('Generating your standalone React portfolio code ZIP...');
      await exportPortfolioAsZip(portfolio);
      showNotification('Portfolio React Code ZIP downloaded successfully!');
    } catch (err) {
      console.error('Zip export error:', err);
      showNotification('Failed to generate ZIP export', 'error');
    } finally {
      setExportingZip(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio/me');
      const data = response.data;
      setPortfolio(data);
      try {
        const parsedSocials = typeof data.socialLinks === 'string' ? JSON.parse(data.socialLinks || '{}') : (data.socialLinks || {});
        setSocials({
          github: parsedSocials.github || '',
          linkedin: parsedSocials.linkedin || '',
          twitter: parsedSocials.twitter || '',
          website: parsedSocials.website || ''
        });
      } catch (e) {
        setSocials({ github: '', linkedin: '', twitter: '', website: '' });
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const showNotification = (text, type = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  // Upload photo handler
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      showNotification('Uploading image...', 'info');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      callback(res.data.url);
      showNotification('Image uploaded successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Image upload failed', 'error');
    }
  };

  // Upload resume handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showNotification('Resume must be a PDF file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Resume must be under 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setResumeUploading(true);
    showNotification('Uploading resume...', 'info');

    try {
      const res = await api.post('/portfolio/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUrl = res.data.resumeUrl || res.data.url;
      setPortfolio((prev) => ({ ...prev, resumeUrl: updatedUrl }));
      showNotification('Resume uploaded successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Resume upload failed', 'error');
    } finally {
      setResumeUploading(false);
      e.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;
    try {
      showNotification('Removing resume...', 'info');
      await api.delete('/portfolio/resume');
      setPortfolio((prev) => ({ ...prev, resumeUrl: '' }));
      showNotification('Resume removed successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to remove resume', 'error');
    }
  };

  // Multi-image upload for projects
  const handleMultipleFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    showNotification(`Uploading ${files.length} image(s)...`, 'info');
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(res.data.url);
      } catch (err) {
        console.error('Failed to upload image', err);
      }
    }

    if (uploadedUrls.length > 0) {
      setProjForm((prev) => {
        const existing = prev.imageUrls || (prev.imageUrl ? [prev.imageUrl] : []);
        const combined = [...existing, ...uploadedUrls];
        return {
          ...prev,
          imageUrls: combined,
          imageUrl: combined[0] || ''
        };
      });
      showNotification(`Successfully uploaded ${uploadedUrls.length} project image(s)!`);
    }
  };

  const removeProjectImage = (indexToRemove) => {
    setProjForm((prev) => {
      const updated = (prev.imageUrls || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        imageUrls: updated,
        imageUrl: updated[0] || ''
      };
    });
  };

  // Save Personal Details
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...portfolio,
        socialLinks: JSON.stringify(socials)
      };
      const res = await api.put('/portfolio/me', payload);
      setPortfolio(res.data);
      showNotification('Personal details updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update details', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async () => {
    try {
      const res = await api.put('/portfolio/publish', { published: !portfolio.published });
      setPortfolio(res.data);
      showNotification(res.data.published ? 'Portfolio is now LIVE and Public!' : 'Portfolio is now private');
    } catch (err) {
      showNotification('Failed to change publish status', 'error');
    }
  };

  // Template Change
  const handleSelectTemplate = async (key) => {
    try {
      const res = await api.put('/portfolio/template', { templateKey: key });
      setPortfolio(res.data);
      showNotification(`Template changed to ${key}!`);
    } catch (err) {
      showNotification('Failed to change template', 'error');
    }
  };

  // Project Actions
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/portfolio/projects/${editingProject.id}`, projForm);
        showNotification('Project updated!');
      } else {
        await api.post('/portfolio/projects', projForm);
        showNotification('New project added!');
      }
      setProjectModal(false);
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/portfolio/projects/${id}`);
      showNotification('Project deleted');
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to delete project', 'error');
    }
  };

  // Skill Actions
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/portfolio/skills/${editingSkill.id}`, skillForm);
        showNotification('Skill updated!');
      } else {
        await api.post('/portfolio/skills', skillForm);
        showNotification('Skill added!');
      }
      setSkillModal(false);
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to save skill', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/portfolio/skills/${id}`);
      showNotification('Skill deleted');
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to delete skill', 'error');
    }
  };

  // Experience Actions
  const handleSaveExp = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await api.put(`/portfolio/experience/${editingExp.id}`, expForm);
        showNotification('Experience updated!');
      } else {
        await api.post('/portfolio/experience', expForm);
        showNotification('Experience entry added!');
      }
      setExpModal(false);
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to save experience', 'error');
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      await api.delete(`/portfolio/experience/${id}`);
      showNotification('Experience deleted');
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to delete experience', 'error');
    }
  };

  // Education Actions
  const handleSaveEdu = async (e) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await api.put(`/portfolio/education/${editingEdu.id}`, eduForm);
        showNotification('Education updated!');
      } else {
        await api.post('/portfolio/education', eduForm);
        showNotification('Education entry added!');
      }
      setEduModal(false);
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to save education', 'error');
    }
  };

  const handleDeleteEdu = async (id) => {
    try {
      await api.delete(`/portfolio/education/${id}`);
      showNotification('Education deleted');
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to delete education', 'error');
    }
  };

  // Achievement Actions
  const handleSaveAch = async (e) => {
    e.preventDefault();
    try {
      if (editingAch) {
        await api.put(`/portfolio/achievements/${editingAch.id}`, achForm);
        showNotification('Achievement updated!');
      } else {
        await api.post('/portfolio/achievements', achForm);
        showNotification('Achievement added!');
      }
      setAchModal(false);
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to save achievement', 'error');
    }
  };

  const handleDeleteAch = async (id) => {
    try {
      await api.delete(`/portfolio/achievements/${id}`);
      showNotification('Achievement deleted');
      fetchPortfolio();
    } catch (err) {
      showNotification('Failed to delete achievement', 'error');
    }
  };

  const copyPublicLink = () => {
    const link = `${window.location.origin}/portfolio/${portfolio.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
        <p>Loading your portfolio dashboard...</p>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/portfolio/${portfolio.slug}`;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <nav style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.6rem', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Portfolio Builder</h1>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Logged in as {portfolio.name || user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
            <button
              className="btn-secondary"
              onClick={handleDownloadZip}
              disabled={exportingZip}
              style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.4)', padding: '0.4rem 0.86rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <Download size={15} /> {exportingZip ? 'Packing ZIP...' : 'Export React Code (.zip)'}
            </button>

            {portfolio.published ? (
              <a href={`/portfolio/${portfolio.slug}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Globe size={15} /> View Live Portfolio
              </a>
            ) : (
              <span className="badge badge-invited">Draft Mode</span>
            )}

            <button className="btn-secondary" onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        
        {/* Sidebar Nav */}
        <aside>
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'details' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'details' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <User size={18} /> Personal Details
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'projects' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'projects' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Code size={18} /> Projects ({portfolio.projects?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'skills' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'skills' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Briefcase size={18} /> Skills & Experience
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'achievements' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'achievements' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Award size={18} /> Achievements ({portfolio.achievements?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'templates' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'templates' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Layout size={18} /> Design Templates
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                border: 'none', background: activeTab === 'publish' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === 'publish' ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Globe size={18} /> Publish & Link
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main>
          {msg.text && (
            <div style={{
              background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${msg.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              color: msg.type === 'error' ? '#fca5a5' : '#34d399',
              padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Sparkles size={16} /> {msg.text}
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'details' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                Personal Details
              </h2>

              <form onSubmit={handleSaveDetails}>
                {/* Photo uploader */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {portfolio.profileImageUrl ? (
                    <img
                      src={portfolio.profileImageUrl.startsWith('http') || portfolio.profileImageUrl.startsWith('/uploads') ? portfolio.profileImageUrl : `http://localhost:8080${portfolio.profileImageUrl}`}
                      alt="Profile"
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '2px dashed rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <User size={32} />
                    </div>
                  )}

                  <div>
                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      <Upload size={14} /> Upload Profile Photo
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, (url) => setPortfolio(p => ({ ...p, profileImageUrl: url })))} />
                    </label>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>Supports JPG, PNG or WEBP up to 10MB</p>
                  </div>
                </div>

                {/* Resume (PDF) Section */}
                <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={18} color="#818cf8" /> Resume (PDF)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Upload your PDF resume (max 5MB). Visitors can view or download it directly from your public portfolio.
                  </p>

                  {portfolio.resumeUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={18} color="#34d399" />
                        <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>Resume Uploaded</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                          href={portfolio.resumeUrl.startsWith('http') || portfolio.resumeUrl.startsWith('/uploads') ? (portfolio.resumeUrl.startsWith('/uploads') ? `http://localhost:8080${portfolio.resumeUrl}` : portfolio.resumeUrl) : portfolio.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <ExternalLink size={14} /> View Resume
                        </a>
                        <label className="btn-secondary" style={{ cursor: resumeUploading ? 'not-allowed' : 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                          <Upload size={14} /> {resumeUploading ? 'Replacing...' : 'Replace'}
                          <input type="file" accept=".pdf" disabled={resumeUploading} style={{ display: 'none' }} onChange={handleResumeUpload} />
                        </label>
                        <button
                          type="button"
                          onClick={handleResumeDelete}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.375rem', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="btn-primary" style={{ cursor: resumeUploading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>
                        <Upload size={16} /> {resumeUploading ? 'Uploading Resume...' : 'Upload PDF Resume'}
                        <input type="file" accept=".pdf" disabled={resumeUploading} style={{ display: 'none' }} onChange={handleResumeUpload} />
                      </label>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.75rem' }}>PDF only, up to 5MB</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={portfolio.name || ''} onChange={(e) => setPortfolio(p => ({ ...p, name: e.target.value }))} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title / Role</label>
                    <input type="text" className="form-input" placeholder="e.g. Senior Full Stack Engineer" value={portfolio.title || ''} onChange={(e) => setPortfolio(p => ({ ...p, title: e.target.value }))} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Hook Tagline (for Personal Brand template)</label>
                  <input type="text" className="form-input" placeholder="e.g. I design & build products that solve real business tasks" value={portfolio.tagline || ''} onChange={(e) => setPortfolio(p => ({ ...p, tagline: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio / Summary</label>
                  <textarea className="form-textarea" placeholder="Write a short summary about your background and passion..." value={portfolio.bio || ''} onChange={(e) => setPortfolio(p => ({ ...p, bio: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-input" placeholder="+1 (555) 000-0000" value={portfolio.phone || ''} onChange={(e) => setPortfolio(p => ({ ...p, phone: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-input" placeholder="San Francisco, CA" value={portfolio.location || ''} onChange={(e) => setPortfolio(p => ({ ...p, location: e.target.value }))} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '1.5rem', marginBottom: '1rem' }}>Social & Contact Links</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input type="text" className="form-input" placeholder="github.com/username or https://..." value={socials.github} onChange={(e) => setSocials(s => ({ ...s, github: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input type="text" className="form-input" placeholder="linkedin.com/in/username or https://..." value={socials.linkedin} onChange={(e) => setSocials(s => ({ ...s, linkedin: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Twitter / X URL</label>
                    <input type="text" className="form-input" placeholder="twitter.com/username or https://..." value={socials.twitter} onChange={(e) => setSocials(s => ({ ...s, twitter: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Personal Website</label>
                    <input type="text" className="form-input" placeholder="yourwebsite.com or https://..." value={socials.website} onChange={(e) => setSocials(s => ({ ...s, website: e.target.value }))} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '1rem' }}>
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Personal Details'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Manage Projects</h2>
                <button className="btn-primary" onClick={() => { setEditingProject(null); setProjForm({ title: '', description: '', techStack: '', imageUrl: '', imageUrls: [], githubLink: '', liveLink: '', highlightStat1: '', highlightStat2: '' }); setProjectModal(true); }}>
                  <Plus size={18} /> Add Project
                </button>
              </div>

              {portfolio.projects?.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No projects added yet. Click "Add Project" to showcase your work!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {portfolio.projects.map((proj) => (
                    <div key={proj.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                      <ImageCarousel
                        images={proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : (proj.imageUrl ? [proj.imageUrl] : [])}
                        alt={proj.title}
                        height="220px"
                        fitMode="contain"
                      />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>{proj.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem', flex: 1, lineHeight: '1.5' }}>{proj.description}</p>
                      
                      {proj.techStack && (
                        <div style={{ fontSize: '0.78rem', color: '#818cf8', marginBottom: '1rem' }}>
                          <strong>Stack:</strong> {proj.techStack}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>GitHub</a>}
                          {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: '0.8rem' }}>Demo</a>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-secondary" style={{ padding: '0.3rem 0.5rem' }} onClick={() => { setEditingProject(proj); setProjForm({ ...proj, imageUrls: proj.imageUrls || (proj.imageUrl ? [proj.imageUrl] : []), highlightStat1: proj.highlightStat1 || '', highlightStat2: proj.highlightStat2 || '' }); setProjectModal(true); }}>
                            <Edit3 size={14} />
                          </button>
                          <button className="btn-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDeleteProject(proj.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS & EXPERIENCE */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Skills */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Technical Skills</h2>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setEditingSkill(null); setSkillForm({ name: '', category: 'Frontend', proficiency: 80 }); setSkillModal(true); }}>
                    <Plus size={16} /> Add Skill
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {portfolio.skills?.map((skill) => (
                    <div key={skill.id} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{skill.name}</span>
                        {skill.category && <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '0.35rem' }}>({skill.category})</span>}
                      </div>
                      <button style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }} onClick={() => handleDeleteSkill(skill.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Work Experience</h2>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setEditingExp(null); setExpForm({ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }); setExpModal(true); }}>
                    <Plus size={16} /> Add Experience
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {portfolio.experienceList?.map((exp) => (
                    <div key={exp.id} style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{exp.position} @ {exp.company}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate} {exp.location && `| ${exp.location}`}</p>
                        {exp.description && <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.4rem' }}>{exp.description}</p>}
                      </div>
                      <button style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', height: 'fit-content' }} onClick={() => handleDeleteExp(exp.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Education</h2>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setEditingEdu(null); setEduForm({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }); setEduModal(true); }}>
                    <Plus size={16} /> Add Education
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {portfolio.educationList?.map((edu) => (
                    <div key={edu.id} style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{edu.degree} in {edu.fieldOfStudy}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#34d399' }}>{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', height: 'fit-content' }} onClick={() => handleDeleteEdu(edu.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: TEMPLATE GALLERY */}
          {activeTab === 'templates' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Design Templates</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                    Select a layout template for your portfolio. Switching templates instantly restyles your published page while leaving your content completely untouched.
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={handleDownloadZip}
                  disabled={exportingZip}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    borderColor: 'transparent',
                    padding: '0.6rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.25)'
                  }}
                >
                  <Download size={16} />
                  <span>{exportingZip ? 'Generating ZIP...' : 'Download React Code (.zip)'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                
                {/* Minimal */}
                <div
                  onClick={() => handleSelectTemplate('minimal')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'minimal' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'minimal' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#6366f1', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Minimal Clean</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Elegant monochrome aesthetic emphasizing typography and whitespace.</p>
                </div>

                {/* Modern Dark Cyber */}
                <div
                  onClick={() => handleSelectTemplate('modern-dark')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'modern-dark' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'modern-dark' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#6366f1', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Modern Dark Cyber</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Sleek dark theme with neon cyan gradients and glassmorphism card glows.</p>
                </div>

                {/* Creative Vibrant */}
                <div
                  onClick={() => handleSelectTemplate('creative')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'creative' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'creative' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#6366f1', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Creative Vibrant</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Playful gradient hero section with colorful badges and dynamic cards.</p>
                </div>

                {/* Classic Executive Resume */}
                <div
                  onClick={() => handleSelectTemplate('classic')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'classic' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'classic' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#6366f1', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Classic Executive</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Professional dual-column executive resume layout with clean timeline.</p>
                </div>

                {/* Aman Dev Cyber Pink */}
                <div
                  onClick={() => handleSelectTemplate('aman-dev')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'aman-dev' ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'aman-dev' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ec4899', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Aman Dev / Cyber Pink</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Minimalist dark aesthetic with italic serif headers, philosophy quote banner, and pink-purple glow.</p>
                </div>

                {/* Personal Brand */}
                <div
                  onClick={() => handleSelectTemplate('personal-brand')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${portfolio.templateKey === 'personal-brand' ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {portfolio.templateKey === 'personal-brand' && (
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ec4899', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={14} />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Personal Brand</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Story-driven layout with punchy tagline hero, categorized skill tabs, stats highlights, achievements timeline, and intent selector.</p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Honors & Achievements</h2>
                <button className="btn-primary" onClick={() => { setEditingAch(null); setAchForm({ title: '', organization: '', duration: '', description: '' }); setAchModal(true); }}>
                  <Plus size={18} /> Add Achievement
                </button>
              </div>

              {portfolio.achievements?.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No achievements added yet. Click "Add Achievement" to showcase your awards, hackathons, and certifications!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {portfolio.achievements?.map((ach) => (
                    <div key={ach.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{ach.title}</h3>
                        {ach.duration && <span style={{ fontSize: '0.75rem', color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', fontWeight: 600 }}>{ach.duration}</span>}
                      </div>
                      
                      {ach.organization && (
                        <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.5rem' }}>
                          {ach.organization}
                        </div>
                      )}

                      {ach.description && (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', flex: 1, lineHeight: '1.5', marginBottom: '1rem' }}>{ach.description}</p>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                        <button className="btn-secondary" style={{ padding: '0.3rem 0.5rem' }} onClick={() => { setEditingAch(ach); setAchForm({ title: ach.title || '', organization: ach.organization || '', duration: ach.duration || '', description: ach.description || '' }); setAchModal(true); }}>
                          <Edit3 size={14} />
                        </button>
                        <button className="btn-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDeleteAch(ach.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PUBLISH & LINK */}
          {activeTab === 'publish' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                Publishing & Public Link
              </h2>

              <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Portfolio Visibility Status</h3>
                    <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {portfolio.published ? 'Your portfolio is published and accessible to anyone via your public link.' : 'Your portfolio is private. Publish it to make it live online.'}
                    </p>
                  </div>

                  <button
                    onClick={handleTogglePublish}
                    className={portfolio.published ? 'btn-danger' : 'btn-primary'}
                    style={{ padding: '0.625rem 1.5rem' }}
                  >
                    {portfolio.published ? 'Unpublish Portfolio' : 'Publish Portfolio Now'}
                  </button>
                </div>
              </div>

              {/* Public URL Box */}
              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label">Your Public Portfolio URL Slug</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={portfolio.slug || ''}
                    onChange={(e) => setPortfolio(p => ({ ...p, slug: e.target.value }))}
                  />
                  <button className="btn-secondary" onClick={handleSaveDetails}>
                    Update Slug
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Link2 size={16} /> Live Shareable Link
                </h4>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.92rem', color: '#ffffff', wordBreak: 'break-all', marginBottom: '1rem', fontFamily: 'monospace' }}>
                  {publicUrl}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" onClick={copyPublicLink}>
                    <Copy size={16} /> {copiedLink ? 'Copied Link!' : 'Copy Public URL'}
                  </button>

                  <a href={publicUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                    <ExternalLink size={16} /> Preview Page
                  </a>
                </div>
              </div>

              {/* Standalone Code ZIP Export Box */}
              <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.12))', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '1rem', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={20} color="#ec4899" /> Download Standalone React Project (.zip)
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, maxWidth: '640px', lineHeight: '1.55' }}>
                      Download your entire portfolio as a ready-to-run <strong>React + Vite</strong> codebase. You get complete source code, your selected design template, JSON portfolio data, dependencies, and instructions to run locally or deploy to Vercel/Netlify!
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={handleDownloadZip}
                    disabled={exportingZip}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                      borderColor: 'transparent',
                      padding: '0.75rem 1.6rem',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)'
                    }}
                  >
                    <Download size={18} />
                    <span>{exportingZip ? 'Generating ZIP...' : 'Download React Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PROJECT MODAL */}
      {projectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>

            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" className="form-input" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Tech Stack (comma-separated)</label>
                <input type="text" className="form-input" placeholder="React, Spring Boot, MySQL" value={projForm.techStack} onChange={(e) => setProjForm({ ...projForm, techStack: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Project Images (Select Multiple for Carousel)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFilesUpload}
                />
                
                {/* Image Thumbnails Strip */}
                {projForm.imageUrls && projForm.imageUrls.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.75rem' }}>
                    {projForm.imageUrls.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid #6366f1' }}>
                        <img
                          src={url.startsWith('http') || url.startsWith('/uploads') ? url : `http://localhost:8080${url}`}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeProjectImage(idx)}
                          style={{
                            position: 'absolute', top: '3px', right: '3px',
                            background: 'rgba(239, 68, 68, 0.9)', color: '#ffffff',
                            border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">GitHub Link (optional)</label>
                  <input type="text" className="form-input" placeholder="github.com/username/repo" value={projForm.githubLink} onChange={(e) => setProjForm({ ...projForm, githubLink: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Demo Link (optional)</label>
                  <input type="text" className="form-input" placeholder="myproject.vercel.app or https://..." value={projForm.liveLink} onChange={(e) => setProjForm({ ...projForm, liveLink: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Highlight Stat 1 (optional)</label>
                  <input type="text" className="form-input" placeholder="e.g. 120+ stars" value={projForm.highlightStat1 || ''} onChange={(e) => setProjForm({ ...projForm, highlightStat1: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Highlight Stat 2 (optional)</label>
                  <input type="text" className="form-input" placeholder="e.g. 150+ LOC saved" value={projForm.highlightStat2 || ''} onChange={(e) => setProjForm({ ...projForm, highlightStat2: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setProjectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
              {editingSkill ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <form onSubmit={handleSaveSkill}>
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input type="text" className="form-input" placeholder="e.g. Java, React, Docker, PostgreSQL" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={skillForm.category || 'Frontend'} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proficiency (%): {skillForm.proficiency}%</label>
                <input type="range" min="10" max="100" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setSkillModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>Add Experience</h2>
            <form onSubmit={handleSaveExp}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <input type="text" className="form-input" value={expForm.position} onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="text" className="form-input" placeholder="Jan 2023" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="text" className="form-input" placeholder="Present" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} disabled={expForm.current} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setExpModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {eduModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>Add Education</h2>
            <form onSubmit={handleSaveEdu}>
              <div className="form-group">
                <label className="form-label">Institution</label>
                <input type="text" className="form-input" placeholder="University Name" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input type="text" className="form-input" placeholder="B.S. / M.S." value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Field of Study</label>
                  <input type="text" className="form-input" placeholder="Computer Science" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="text" className="form-input" placeholder="2019" value={eduForm.startDate} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="text" className="form-input" placeholder="2023" value={eduForm.endDate} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setEduModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACHIEVEMENT MODAL */}
      {achModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
              {editingAch ? 'Edit Achievement' : 'Add Achievement'}
            </h2>
            <form onSubmit={handleSaveAch}>
              <div className="form-group">
                <label className="form-label">Title / Award Name</label>
                <input type="text" className="form-input" placeholder="e.g. 1st Place Hackathon Winner" value={achForm.title} onChange={(e) => setAchForm({ ...achForm, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Organization / Host</label>
                  <input type="text" className="form-input" placeholder="e.g. Google MLH" value={achForm.organization} onChange={(e) => setAchForm({ ...achForm, organization: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date / Year</label>
                  <input type="text" className="form-input" placeholder="e.g. 2024" value={achForm.duration} onChange={(e) => setAchForm({ ...achForm, duration: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Brief summary of the achievement, impact, or placement..." value={achForm.description} onChange={(e) => setAchForm({ ...achForm, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setAchModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Achievement</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;
