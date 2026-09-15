import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, ExternalLink, Sparkles, Briefcase, GraduationCap, 
  Code, ArrowUpRight, CheckCircle2, Award, Terminal, Layers, Send, 
  ChevronRight, Sun, Moon, User, FileText, Download, Globe, Calendar, Building, Zap
} from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as GlobeIcon } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplatePersonalBrand = ({ portfolioData }) => {
  const {
    name,
    title,
    tagline,
    bio,
    profileImageUrl,
    resumeUrl,
    email,
    phone,
    location,
    socialLinks: rawSocialLinks,
    projects = [],
    skills = [],
    educationList = [],
    experienceList = [],
    achievements = []
  } = portfolioData || {};

  // Local Theme State (Dark / Light toggle)
  const [isDark, setIsDark] = useState(true);

  // Projects Pagination State
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(3);

  let social = {};
  try {
    social = typeof rawSocialLinks === 'string' ? JSON.parse(rawSocialLinks || '{}') : (rawSocialLinks || {});
  } catch (e) {
    social = {};
  }

  // Categorized Skills
  const rawSkillsList = Array.isArray(skills) ? skills : [];
  const categoriesMap = {};
  rawSkillsList.forEach((sk) => {
    const categoryName = (sk.category && sk.category.trim()) ? sk.category.trim() : 'Core Skills';
    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = [];
    }
    categoriesMap[categoryName].push(sk);
  });

  const categoryNames = Object.keys(categoriesMap);
  const [activeCategory, setActiveCategory] = useState('All');

  // Contact Form State
  const [intent, setIntent] = useState('Interested in Hiring!');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isMsgFocused, setIsMsgFocused] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
      setSenderName('');
      setSenderEmail('');
    }, 4000);
  };

  const getProfileImgSrc = (url) => {
    if (!url) return '';
    return url.startsWith('http') || url.startsWith('/uploads') ? url : `http://localhost:8080${url}`;
  };

  const getValidUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const formatTitleCase = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().split(/\s+/).map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const githubLink = social.github || social.githubUrl || social.githubLink || social.GitHub || '';
  const linkedinLink = social.linkedin || social.linkedinUrl || social.linkedinLink || social.LinkedIn || '';
  const twitterLink = social.twitter || social.twitterUrl || social.Twitter || '';
  const websiteLink = social.website || social.websiteUrl || social.Website || '';

  const heroHook = (tagline && tagline.trim())
    ? tagline
    : (title ? `Building scalable software systems as a ${formatTitleCase(title)}.` : 'Engineering robust full-stack applications & digital experiences.');

  // Theme Palette
  const theme = {
    bg: isDark ? '#0b0f19' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    cardBg: isDark ? 'rgba(17, 24, 39, 0.75)' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)',
    cardShadow: isDark ? '0 12px 35px -10px rgba(0, 0, 0, 0.5)' : '0 10px 25px -10px rgba(0, 0, 0, 0.05)',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(203, 213, 225, 0.8)',
    accentPink: '#ec4899',
    accentPurple: '#8b5cf6',
    accentCyan: '#06b6d4',
  };

  const displayedProjects = projects.slice(0, visibleProjectsCount);
  const hasMoreProjects = projects.length > visibleProjectsCount;

  return (
    <div style={{
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '5rem',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Background Ambient Glows */}
      {isDark && (
        <>
          <div style={{
            position: 'fixed',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.06) 50%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'fixed',
            bottom: '-150px',
            right: '-100px',
            width: '600px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}

      {/* Global Component Styles */}
      <style>{`
        .pb-card {
          background: ${theme.cardBg};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${theme.cardBorder};
          border-radius: 1.25rem;
          box-shadow: ${theme.cardShadow};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pb-card:hover {
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-3px);
        }

        .pb-btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #ffffff;
          font-weight: 700;
          padding: 0.75rem 1.6rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.25s ease;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
        }

        .pb-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }

        .pb-btn-secondary {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'};
          color: ${theme.text};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(203, 213, 225, 0.9)'};
          font-weight: 600;
          padding: 0.75rem 1.6rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .pb-btn-secondary:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#f1f5f9'};
          border-color: rgba(99, 102, 241, 0.4);
        }

        .pb-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(203,213,225,0.8)'};
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9'};
          color: ${theme.text};
        }

        .pb-chip-btn:hover {
          border-color: #6366f1;
          color: #818cf8;
          transform: translateY(-1px);
        }

        .pb-tab {
          padding: 0.5rem 1.1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .pb-tab-active {
          background: rgba(99, 102, 241, 0.18);
          color: #818cf8;
          border-color: rgba(99, 102, 241, 0.4);
        }

        .pb-tab-inactive {
          background: ${isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9'};
          color: ${theme.textMuted};
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(203, 213, 225, 0.6)'};
        }

        .pb-tab-inactive:hover {
          color: ${theme.text};
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'};
        }
      `}</style>

      {/* TOP HEADER / BRAND NAVBAR */}
      <header style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Identity */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: theme.text, lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            {name || 'Developer Portfolio'}
          </div>
          {title && (
            <div style={{ fontSize: '0.85rem', color: theme.textMuted, fontWeight: 500, marginTop: '0.2rem' }}>
              {formatTitleCase(title)}
            </div>
          )}
        </div>

        {/* Right Navigation & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {githubLink && (
            <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" className="pb-chip-btn" title="GitHub">
              <Github size={15} />
              <span>GitHub</span>
            </a>
          )}
          {linkedinLink && (
            <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" className="pb-chip-btn" title="LinkedIn" style={{ color: '#38bdf8' }}>
              <Linkedin size={15} />
              <span>LinkedIn</span>
            </a>
          )}
          {twitterLink && (
            <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" className="pb-chip-btn" title="Twitter">
              <Twitter size={15} />
            </a>
          )}
          {websiteLink && (
            <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" className="pb-chip-btn" title="Website">
              <Globe size={15} />
            </a>
          )}

          {/* Resume Pills */}
          {resumeUrl && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              color: theme.textMuted,
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 213, 225, 0.8)'}`
            }}>
              <FileText size={14} color="#818cf8" />
              <span style={{ fontWeight: 600, color: theme.text }}>Resume:</span>
              <a href={getResumeViewUrl(resumeUrl)} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>View</a>
              <span>·</span>
              <a href={getDownloadUrl(resumeUrl)} target="_blank" rel="noreferrer" download style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Download</a>
            </div>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.15)'}`,
              background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#ffffff',
              color: isDark ? '#fbbf24' : '#6366f1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isDark ? (
              <>
                <Sun size={15} color="#fbbf24" />
                <span style={{ color: '#e2e8f0' }}>Light</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#6366f1" />
                <span style={{ color: '#0f172a' }}>Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* HERO SHOWCASE SECTION */}
        <section style={{ marginBottom: '5rem', paddingTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Intro Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#818cf8',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={14} /> Available for Technical Roles & Projects
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: '1.15',
                color: theme.text,
                marginBottom: '1.5rem'
              }}>
                {heroHook}
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: theme.textMuted,
                lineHeight: '1.7',
                marginBottom: '2rem',
                fontWeight: 400
              }}>
                {bio || `Hi, I'm ${name || 'a full-stack software engineer'}. ${title ? `I work as a ${formatTitleCase(title)}.` : ''} I build clean, high-performance web applications, RESTful APIs, and scalable database systems.`}
              </p>

              {/* Quick Info Badges */}
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '0.88rem', color: theme.textMuted }}>
                {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={15} color="#818cf8" /> {email}</div>}
                {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={15} color="#818cf8" /> {phone}</div>}
                {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={15} color="#818cf8" /> {location}</div>}
              </div>

              {/* CTA Button Row */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="#projects" className="pb-btn-primary">
                  <span>Explore Projects</span>
                  <ChevronRight size={18} />
                </a>
                <a href="#contact" className="pb-btn-secondary">
                  <Mail size={18} />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>

            {/* Right Profile Card Column */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '250px', height: '250px' }}>
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  borderRadius: '2rem',
                  filter: 'blur(16px)',
                  opacity: isDark ? 0.25 : 0.15
                }} />

                <div className="pb-card" style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '1.75rem',
                  overflow: 'hidden',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark ? '#111827' : '#ffffff'
                }}>
                  {profileImageUrl ? (
                    <img
                      src={getProfileImgSrc(profileImageUrl)}
                      alt={name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '1.35rem',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '1.35rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '1rem'
                    }}>
                      <User size={64} />
                      <div style={{ fontWeight: 800, marginTop: '0.75rem', fontSize: '1.2rem' }}>
                        {name || 'Software Engineer'}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.2rem' }}>
                        {title ? formatTitleCase(title) : 'Full Stack Developer'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WORK EXPERIENCE TIMELINE SECTION */}
        {experienceList.length > 0 && (
          <section id="experience" style={{ marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.text, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Briefcase color="#818cf8" size={24} /> Professional Experience
              </h2>
              <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Career journey and software engineering roles</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {experienceList.map((exp, idx) => (
                <div key={exp.id || idx} className="pb-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: theme.text, margin: 0 }}>
                        {exp.position}
                      </h3>
                      <div style={{ fontSize: '0.95rem', color: '#818cf8', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building size={15} /> {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                    </div>

                    <div style={{
                      background: exp.current ? 'rgba(34, 197, 94, 0.15)' : (isDark ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9'),
                      color: exp.current ? '#4ade80' : theme.textMuted,
                      border: `1px solid ${exp.current ? 'rgba(34, 197, 94, 0.3)' : 'transparent'}`,
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Calendar size={13} />
                      <span>{exp.startDate} – {exp.current ? 'Present' : (exp.endDate || 'Present')}</span>
                    </div>
                  </div>

                  {exp.description && (
                    <div style={{ fontSize: '0.95rem', color: theme.textMuted, lineHeight: '1.75', marginTop: '1rem', whiteSpace: 'pre-line' }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNICAL SKILLS SECTION */}
        {rawSkillsList.length > 0 && (
          <section id="skills" style={{ marginBottom: '5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.text, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers color="#818cf8" size={24} /> Technical Skills & Tools
              </h2>
              <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Languages, frameworks, databases, and practices</p>
            </div>

            {/* Category Filter Tabs */}
            {categoryNames.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`pb-tab ${activeCategory === 'All' ? 'pb-tab-active' : 'pb-tab-inactive'}`}
                >
                  All Skills ({rawSkillsList.length})
                </button>
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`pb-tab ${activeCategory === cat ? 'pb-tab-active' : 'pb-tab-inactive'}`}
                  >
                    {cat} ({categoriesMap[cat].length})
                  </button>
                ))}
              </div>
            )}

            <div className="pb-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {(activeCategory === 'All'
                  ? rawSkillsList
                  : (categoriesMap[activeCategory] || [])
                ).map((sk, index) => {
                  const skillName = typeof sk === 'object' ? (sk.name || sk.skillName || JSON.stringify(sk)) : sk;
                  const catLabel = typeof sk === 'object' ? sk.category : null;
                  const proficiency = typeof sk === 'object' ? sk.proficiency : null;

                  return (
                    <div key={index} style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
                      padding: '0.85rem 1.1rem',
                      borderRadius: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 700, color: theme.text }}>
                          <CheckCircle2 size={16} color="#818cf8" />
                          <span>{skillName}</span>
                        </div>
                        {proficiency && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8' }}>{proficiency}%</span>
                        )}
                      </div>
                      {catLabel && (
                        <div style={{ fontSize: '0.75rem', color: theme.textMuted, marginLeft: '1.35rem' }}>
                          {catLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED PROJECTS SECTION */}
        {projects.length > 0 && (
          <section id="projects" style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.text, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Terminal color="#818cf8" size={24} /> Featured Projects
                </h2>
                <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>
                  Demonstrated applications and full-stack software solutions ({projects.length})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {displayedProjects.map((proj, idx) => {
                const projectImages = (proj.imageUrls && proj.imageUrls.length > 0)
                  ? proj.imageUrls
                  : ((proj.images && proj.images.length > 0)
                    ? proj.images
                    : (proj.imageUrl ? [proj.imageUrl] : []));

                const parsedTech = proj.techStack
                  ? proj.techStack.split(',').map(t => t.trim()).filter(Boolean)
                  : (proj.technologies
                    ? (Array.isArray(proj.technologies) ? proj.technologies : proj.technologies.split(',').map(t => t.trim()).filter(Boolean))
                    : []);

                const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                const primaryRedirectUrl = liveUrl || githubUrl;

                return (
                  <div
                    key={proj.id || idx}
                    className="pb-card"
                    onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                    style={{
                      overflow: 'hidden',
                      cursor: primaryRedirectUrl ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0' }}>
                      
                      {/* Left: Media / Carousel */}
                      <div style={{ height: '280px', minHeight: '100%', background: isDark ? '#000000' : '#f1f5f9' }}>
                        {projectImages.length > 0 ? (
                          <ImageCarousel images={projectImages} title={proj.title} />
                        ) : (
                          <div style={{
                            height: '100%',
                            minHeight: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.textMuted,
                            padding: '2rem',
                            textAlign: 'center'
                          }}>
                            <Code size={44} opacity={0.4} />
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.5rem' }}>{proj.title}</div>
                          </div>
                        )}
                      </div>

                      {/* Right: Content Details */}
                      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          <Zap size={14} /> Project {String(idx + 1).padStart(2, '0')}
                        </div>

                        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, marginBottom: '0.65rem' }}>
                          {proj.title}
                        </h3>

                        <p style={{ fontSize: '0.95rem', color: theme.textMuted, lineHeight: '1.65', marginBottom: '1.25rem' }}>
                          {proj.description}
                        </p>

                        {/* Highlight Stats */}
                        {(proj.highlightStat1 || proj.highlightStat2) && (
                          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', padding: '0.6rem 1rem', background: isDark ? 'rgba(99, 102, 241, 0.08)' : '#f1f5f9', borderRadius: '0.75rem', border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(203, 213, 225, 0.8)'}` }}>
                            {proj.highlightStat1 && (
                              <div>
                                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#818cf8' }}>{proj.highlightStat1}</div>
                              </div>
                            )}
                            {proj.highlightStat2 && (
                              <div>
                                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#a855f7' }}>{proj.highlightStat2}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tech Stack Badges */}
                        {parsedTech.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                            {parsedTech.map((tech, tIdx) => (
                              <span key={tIdx} style={{ fontSize: '0.78rem', fontWeight: 600, background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9', color: theme.text, padding: '0.25rem 0.65rem', borderRadius: '0.375rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.7)'}` }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                          {liveUrl && (
                            <a href={liveUrl} target="_blank" rel="noreferrer" className="pb-btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }} onClick={(e) => e.stopPropagation()}>
                              <span>Live Application</span>
                              <ArrowUpRight size={16} />
                            </a>
                          )}
                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={liveUrl ? "pb-btn-secondary" : "pb-btn-primary"}
                              style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={16} />
                              <span>Source Code</span>
                            </a>
                          )}
                          {!liveUrl && !githubUrl && primaryRedirectUrl && (
                            <a href={primaryRedirectUrl} target="_blank" rel="noreferrer" className="pb-btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }} onClick={(e) => e.stopPropagation()}>
                              <span>View Details</span>
                              <ArrowUpRight size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreProjects && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setVisibleProjectsCount(prev => prev + 3)}
                  className="pb-btn-secondary"
                >
                  <span>Load More Projects ({projects.length - visibleProjectsCount} remaining)</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* EDUCATION & ACADEMICS SECTION */}
        {educationList.length > 0 && (
          <section id="education" style={{ marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.text, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap color="#818cf8" size={24} /> Education & Qualifications
              </h2>
              <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Academic degrees and educational institutions</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {educationList.map((edu, index) => (
                <div key={edu.id || index} className="pb-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.text, margin: 0 }}>
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={13} />
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.description && (
                    <p style={{ fontSize: '0.88rem', color: theme.textMuted, marginTop: '0.85rem', lineHeight: '1.6' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS & HONORS SECTION */}
        {achievements.length > 0 && (
          <section id="achievements" style={{ marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.text, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award color="#818cf8" size={24} /> Honors & Achievements
              </h2>
              <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Awards, competition wins, and professional milestones</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {achievements.map((ach, index) => (
                <div key={ach.id || index} className="pb-card" style={{ padding: '1.75rem', borderLeft: '4px solid #818cf8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.text, margin: 0 }}>
                      {ach.title}
                    </h3>
                    {ach.duration && (
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', fontWeight: 600 }}>
                        {ach.duration}
                      </span>
                    )}
                  </div>

                  {ach.organization && (
                    <div style={{ fontSize: '0.88rem', color: '#a855f7', fontWeight: 600, marginBottom: '0.6rem' }}>
                      {ach.organization}
                    </div>
                  )}

                  {ach.description && (
                    <p style={{ fontSize: '0.88rem', color: theme.textMuted, lineHeight: '1.6', margin: 0 }}>
                      {ach.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INTERACTIVE CONTACT SECTION */}
        <section id="contact" style={{ marginBottom: '3rem' }}>
          <div className="pb-card" style={{ padding: '3.5rem 2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
              
              {/* Left Column */}
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <ArrowUpRight size={44} color="#818cf8" style={{ strokeWidth: 2.5 }} />
                </div>

                <h2 style={{
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: '1.15',
                  color: theme.text,
                  marginBottom: '1.5rem'
                }}>
                  Let's Connect &<br />Build Together
                </h2>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    style={{
                      display: 'inline-block',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: '#818cf8',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      marginBottom: '2rem'
                    }}
                  >
                    {email}
                  </a>
                )}

                {/* Social Cluster */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxWidth: '340px' }}>
                  {githubLink && (
                    <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" className="pb-chip-btn">
                      <Github size={15} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {linkedinLink && (
                    <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" className="pb-chip-btn" style={{ color: '#38bdf8' }}>
                      <Linkedin size={15} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {twitterLink && (
                    <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" className="pb-chip-btn">
                      <Twitter size={15} />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column Form */}
              <div>
                <p style={{ fontSize: '1rem', color: theme.textMuted, lineHeight: '1.6', marginBottom: '2rem' }}>
                  Send a direct message regarding open roles, project inquiries, or technical collaborations.
                </p>

                <form onSubmit={handleContactSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: theme.text, marginBottom: '0.5rem' }}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          borderRadius: '0.65rem',
                          padding: '0.8rem 1rem',
                          color: theme.text,
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: theme.text, marginBottom: '0.5rem' }}>
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          borderRadius: '0.65rem',
                          padding: '0.8rem 1rem',
                          color: theme.text,
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: theme.text, marginBottom: '0.5rem' }}>
                      Your Message
                    </label>
                    <div
                      style={{
                        background: theme.inputBg,
                        border: `1.5px solid ${isMsgFocused ? '#6366f1' : theme.inputBorder}`,
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isMsgFocused ? '0 0 0 3px rgba(99, 102, 241, 0.25)' : 'none'
                      }}
                    >
                      <textarea
                        rows={4}
                        placeholder="Write your message or inquiry here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        onFocus={() => setIsMsgFocused(true)}
                        onBlur={() => setIsMsgFocused(false)}
                        required
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: theme.text,
                          fontSize: '0.95rem',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />

                      {/* Intent Selection Pills */}
                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => setIntent('Interested in Hiring!')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: intent === 'Interested in Hiring!' ? '1px solid #22c55e' : `1px solid ${theme.inputBorder}`,
                            background: intent === 'Interested in Hiring!' ? 'rgba(34, 197, 94, 0.12)' : (isDark ? '#1f2937' : '#ffffff'),
                            color: intent === 'Interested in Hiring!' ? '#22c55e' : theme.textMuted,
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                          <span>Interested in Hiring!</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIntent('Project Inquiry!')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: intent === 'Project Inquiry!' ? '1px solid #6366f1' : `1px solid ${theme.inputBorder}`,
                            background: intent === 'Project Inquiry!' ? 'rgba(99, 102, 241, 0.12)' : (isDark ? '#1f2937' : '#ffffff'),
                            color: intent === 'Project Inquiry!' ? '#818cf8' : theme.textMuted,
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                          <span>Project Inquiry</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {contactSubmitted ? (
                    <div style={{ padding: '0.9rem 1.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center' }}>
                      ✓ Message recorded! Thank you for reaching out.
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="pb-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', borderRadius: '0.75rem', padding: '0.85rem' }}
                    >
                      <Send size={18} />
                      <span>Send Message</span>
                    </button>
                  )}
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', color: theme.textMuted, fontSize: '0.85rem', marginTop: '4rem' }}>
          Portfolio Showcase Platform • {name || 'Software Engineer'}
        </footer>
      </main>
    </div>
  );
};

export default TemplatePersonalBrand;
