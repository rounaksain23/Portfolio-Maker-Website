import React, { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Sparkles, Briefcase, GraduationCap, Code, ArrowUpRight, CheckCircle2, User, Terminal, Layers, Sun, Moon, Plus, FileText, Download } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as Globe } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplateAmanDev = ({ portfolioData }) => {
  const {
    name,
    title,
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
    experienceList = []
  } = portfolioData || {};

  // Theme State (Dark / Light toggle)
  const [isDark, setIsDark] = useState(true);

  // Projects Pagination State
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(3);

  let social = {};
  try {
    social = typeof rawSocialLinks === 'string' ? JSON.parse(rawSocialLinks) : (rawSocialLinks || {});
  } catch (e) {
    social = {};
  }

  const githubLink = social.github || social.githubUrl || social.githubLink || social.GitHub || '';
  const linkedinLink = social.linkedin || social.linkedinUrl || social.linkedinLink || social.LinkedIn || '';
  const twitterLink = social.twitter || social.twitterUrl || social.Twitter || '';
  const websiteLink = social.website || social.websiteUrl || social.Website || '';

  // Parse skill string into array if needed
  const skillArray = Array.isArray(skills)
    ? skills
    : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

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

  const themeStyles = {
    bg: isDark ? '#09090b' : '#f8fafc',
    text: isDark ? '#f4f4f5' : '#0f172a',
    textMuted: isDark ? '#a1a1aa' : '#64748b',
    cardBg: isDark ? 'rgba(24, 24, 27, 0.6)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)',
    cardShadow: isDark ? '0 12px 30px -10px rgba(236, 72, 153, 0.15)' : '0 10px 25px -10px rgba(0, 0, 0, 0.06)'
  };

  const displayedProjects = projects.slice(0, visibleProjectsCount);
  const hasMoreProjects = projects.length > visibleProjectsCount;

  return (
    <div style={{
      backgroundColor: themeStyles.bg,
      color: themeStyles.text,
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '5rem',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Dynamic Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .aman-serif {
          font-family: 'Instrument Serif', Georgia, serif;
        }

        .aman-gradient-text {
          background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .aman-glass-card {
          background: ${themeStyles.cardBg};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${themeStyles.cardBorder};
          border-radius: 1.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .aman-glass-card:hover {
          border-color: rgba(236, 72, 153, 0.4);
          transform: translateY(-4px);
          box-shadow: ${themeStyles.cardShadow};
        }

        .aman-btn-primary {
          background: linear-gradient(135deg, #ec4899, #a855f7);
          color: #ffffff;
          font-weight: 600;
          padding: 0.75rem 1.75rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
          border: none;
          cursor: pointer;
        }

        .aman-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(236, 72, 153, 0.5);
        }

        .aman-btn-secondary {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'};
          color: ${themeStyles.text};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(203, 213, 225, 0.9)'};
          font-weight: 500;
          padding: 0.75rem 1.75rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .aman-btn-secondary:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9'};
          border-color: rgba(236, 72, 153, 0.4);
          color: ${themeStyles.text};
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          animation: pulse-ring 1.8s infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>

      {/* Ambient Glows */}
      {isDark && (
        <>
          <div style={{
            position: 'fixed',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(168, 85, 247, 0.08) 40%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'fixed',
            bottom: '-200px',
            right: '-100px',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}

      {/* Navbar Container */}
      <header style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 0 1.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="aman-glass-card" style={{
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '9999px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {profileImageUrl ? (
              <img
                src={getProfileImgSrc(profileImageUrl)}
                alt={name}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ec4899' }}
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff'
              }}>
                {name ? name.charAt(0).toUpperCase() : <User size={20} />}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: themeStyles.text, lineHeight: '1.2' }}>
                {name || 'Portfolio'}
              </div>
              <div style={{ fontSize: '0.75rem', color: themeStyles.textMuted }}>
                {title || 'Developer'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Availability pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              color: '#4ade80',
              fontWeight: 500
            }}>
              <span className="pulse-dot"></span>
              <span>Available for work</span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Theme"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.15)'}`,
                background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                color: isDark ? '#fbbf24' : '#ec4899',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isDark ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#ec4899" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* HERO SECTION WITH PROMINENT PROFILE AVATAR */}
        <section style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '1rem' }}>
          
          {/* Profile Picture Card */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '1.75rem' }}>
            <div style={{
              position: 'absolute',
              inset: '-6px',
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              opacity: 0.6
            }} />
            {profileImageUrl ? (
              <img
                src={getProfileImgSrc(profileImageUrl)}
                alt={name}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  position: 'relative',
                  border: '3px solid #ec4899',
                  boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)'
                }}
              />
            ) : (
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: '#fff',
                fontSize: '3rem',
                fontWeight: 700,
                border: '3px solid #ec4899',
                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)'
              }}>
                {name ? name.charAt(0).toUpperCase() : <User size={60} />}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span className="aman-serif" style={{ fontSize: '1.6rem', fontStyle: 'italic', color: '#ec4899' }}>
              hello world
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            color: themeStyles.text
          }}>
            I design & craft <span className="aman-serif aman-gradient-text" style={{ fontStyle: 'italic', fontWeight: 400 }}>digital experiences</span> that solve real problems.
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: themeStyles.textMuted,
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6',
            fontWeight: 300
          }}>
            {bio || `Hi, I'm ${name || 'a developer'}. ${title ? `I work as a ${title}.` : ''} I build clean, robust applications with modern architecture and seamless UX.`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {email && (
              <a href={`mailto:${email}`} className="aman-btn-primary">
                <Mail size={18} />
                <span>Get in touch</span>
              </a>
            )}
            {githubLink && (
              <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" className="aman-btn-secondary" title="GitHub Profile">
                <Github size={18} />
                <span>GitHub Profile</span>
              </a>
            )}
            {linkedinLink && (
              <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" className="aman-btn-secondary" title="LinkedIn Profile" style={{ color: '#38bdf8' }}>
                <Linkedin size={18} />
                <span>LinkedIn Profile</span>
              </a>
            )}
            <a href="#projects" className="aman-btn-secondary">
              <span>View Projects</span>
              <ArrowUpRight size={18} />
            </a>
            {resumeUrl && (
              <>
                <a
                  href={getResumeViewUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aman-btn-secondary"
                  style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.4)' }}
                >
                  <FileText size={18} />
                  <span>View Resume</span>
                </a>
                <a
                  href={getDownloadUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="aman-btn-secondary"
                  style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.4)' }}
                >
                  <Download size={18} />
                  <span>Download Resume</span>
                </a>
              </>
            )}
          </div>

          {/* Social Links Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '2.5rem'
          }}>
            {githubLink && (
              <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" title="GitHub Profile" style={{
                color: themeStyles.text,
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(203, 213, 225, 0.8)'}`,
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}>
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            {linkedinLink && (
              <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" title="LinkedIn Profile" style={{
                color: '#38bdf8',
                background: isDark ? 'rgba(56, 189, 248, 0.12)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(203, 213, 225, 0.8)'}`,
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}>
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            {twitterLink && (
              <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" title="Twitter" style={{
                color: themeStyles.textMuted,
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(203, 213, 225, 0.8)'}`,
                padding: '0.65rem',
                borderRadius: '50%',
                display: 'flex',
                transition: 'all 0.2s ease'
              }}>
                <Twitter size={20} />
              </a>
            )}
            {websiteLink && (
              <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" title="Website" style={{
                color: themeStyles.textMuted,
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(203, 213, 225, 0.8)'}`,
                padding: '0.65rem',
                borderRadius: '50%',
                display: 'flex',
                transition: 'all 0.2s ease'
              }}>
                <Globe size={20} />
              </a>
            )}
          </div>
        </section>

        {/* PHILOSOPHY QUOTE BANNER */}
        <section style={{ marginBottom: '5rem' }}>
          <div className="aman-glass-card" style={{
            padding: '3rem 2.5rem',
            textAlign: 'center',
            position: 'relative'
          }}>
            <span className="aman-serif" style={{
              fontSize: '4rem',
              lineHeight: 1,
              color: 'rgba(236, 72, 153, 0.3)',
              display: 'block',
              marginBottom: '-1.5rem'
            }}>“</span>
            <blockquote className="aman-serif" style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              fontStyle: 'italic',
              color: themeStyles.text,
              fontWeight: 400,
              lineHeight: '1.4',
              maxWidth: '800px',
              margin: '0 auto 1.5rem auto'
            }}>
              My approach to work is <span className="aman-gradient-text">logic, consistency, and rationality</span> — turning complex ideas into simple, elegant engineering.
            </blockquote>
            <div style={{ fontSize: '0.9rem', color: themeStyles.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              — {name || 'Developer Philosophy'}
            </div>
          </div>
        </section>

        {/* SKILLS / WORK STACK */}
        {skillArray.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Layers size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: themeStyles.text, margin: 0 }}>
                  Skills & Tech Stack
                </h2>
                <p style={{ fontSize: '0.85rem', color: themeStyles.textMuted, margin: 0 }}>Technologies and frameworks I specialize in</p>
              </div>
            </div>

            <div className="aman-glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                {skillArray.map((sk, index) => {
                  const skillName = typeof sk === 'object' ? (sk.name || sk.skillName || JSON.stringify(sk)) : sk;
                  return (
                    <div key={index} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(203, 213, 225, 0.8)'}`,
                      padding: '0.6rem 1.1rem',
                      borderRadius: '9999px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: themeStyles.text,
                      transition: 'all 0.2s ease'
                    }}>
                      <CheckCircle2 size={15} color="#ec4899" />
                      <span>{skillName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS SECTION WITH REDIRECTION & "SEE MORE" PAGINATION */}
        {projects.length > 0 && (
          <section id="projects" style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <Terminal size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: themeStyles.text, margin: 0 }}>
                    Featured Projects
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: themeStyles.textMuted, margin: 0 }}>
                    Showing {Math.min(visibleProjectsCount, projects.length)} of {projects.length} projects (click any card to view)
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {displayedProjects.map((proj, idx) => {
                const projectImages = proj.images && proj.images.length > 0 
                  ? proj.images 
                  : (proj.imageUrl ? [proj.imageUrl] : []);

                const parsedTech = proj.technologies 
                  ? (Array.isArray(proj.technologies) ? proj.technologies : proj.technologies.split(',').map(t => t.trim()))
                  : [];

                const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                const primaryRedirectUrl = liveUrl || githubUrl;

                return (
                  <div
                    key={proj.id || idx}
                    className="aman-glass-card"
                    onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                    style={{
                      overflow: 'hidden',
                      cursor: primaryRedirectUrl ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0' }}>
                      {/* Project Multi-Image Carousel */}
                      <div style={{ height: '280px', minHeight: '100%', background: '#000' }}>
                        {projectImages.length > 0 ? (
                          <ImageCarousel images={projectImages} title={proj.title} />
                        ) : (
                          <div style={{
                            height: '100%',
                            minHeight: '220px',
                            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: themeStyles.textMuted
                          }}>
                            <Code size={40} opacity={0.4} />
                          </div>
                        )}
                      </div>

                      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: themeStyles.text, marginBottom: '0.6rem' }}>
                          {proj.title}
                        </h3>

                        <p style={{ fontSize: '0.94rem', color: themeStyles.textMuted, lineHeight: '1.6', marginBottom: '1.25rem' }}>
                          {proj.description}
                        </p>

                        {/* Tech stack badges */}
                        {parsedTech.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                            {parsedTech.map((tech, tIdx) => (
                              <span key={tIdx} style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: 'rgba(236, 72, 153, 0.1)',
                                color: '#ec4899',
                                border: '1px solid rgba(236, 72, 153, 0.25)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '0.375rem'
                              }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Links */}
                        <div style={{ display: 'flex', gap: '1rem', borderTop: `1px solid ${themeStyles.cardBorder}`, paddingTop: '1rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                          {liveUrl && (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight size={15} />
                            </a>
                          )}
                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.85rem', fontWeight: 600, color: themeStyles.textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={15} />
                              <span>Code</span>
                            </a>
                          )}
                          {!liveUrl && !githubUrl && primaryRedirectUrl && (
                            <a
                              href={primaryRedirectUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>Open Project</span>
                              <ArrowUpRight size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SEE MORE PROJECTS BUTTON */}
            {hasMoreProjects && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setVisibleProjectsCount(prev => prev + 3)}
                  className="aman-btn-secondary"
                  style={{ fontSize: '0.95rem', padding: '0.85rem 2.2rem' }}
                >
                  <Plus size={18} color="#ec4899" />
                  <span>See More Projects ({projects.length - visibleProjectsCount} remaining)</span>
                </button>
              </div>
            )}
            
            {visibleProjectsCount > 3 && !hasMoreProjects && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setVisibleProjectsCount(3)}
                  className="aman-btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.5rem' }}
                >
                  <span>Show Less</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experienceList.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Briefcase size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: themeStyles.text, margin: 0 }}>
                  Work Experience
                </h2>
                <p style={{ fontSize: '0.85rem', color: themeStyles.textMuted, margin: 0 }}>My professional journey and track record</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experienceList.map((exp, index) => (
                <div key={exp.id || index} className="aman-glass-card" style={{ padding: '1.75rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: themeStyles.text, margin: 0 }}>
                        {exp.position || exp.role}
                      </h3>
                      <div style={{ fontSize: '0.95rem', color: '#ec4899', fontWeight: 500, marginTop: '0.15rem' }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                      border: `1px solid ${themeStyles.cardBorder}`,
                      padding: '0.3rem 0.8rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      color: themeStyles.text,
                      fontWeight: 500
                    }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '0.92rem', color: themeStyles.textMuted, lineHeight: '1.6', margin: 0 }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {educationList.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: themeStyles.text, margin: 0 }}>
                  Education & Credentials
                </h2>
                <p style={{ fontSize: '0.85rem', color: themeStyles.textMuted, margin: 0 }}>Academic background and certifications</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {educationList.map((edu, index) => (
                <div key={edu.id || index} className="aman-glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: themeStyles.text, marginBottom: '0.25rem' }}>
                    {edu.degree}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#a855f7', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: themeStyles.textMuted }}>
                    {edu.startYear || edu.startDate} - {edu.endYear || edu.endDate || 'Present'}
                  </div>
                  {edu.description && (
                    <p style={{ fontSize: '0.85rem', color: themeStyles.textMuted, marginTop: '0.75rem', lineHeight: '1.5' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT / FOOTER */}
        <section style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <div className="aman-glass-card" style={{ padding: '3.5rem 2rem' }}>
            <h2 className="aman-serif" style={{ fontSize: '2.5rem', fontWeight: 400, fontStyle: 'italic', color: themeStyles.text, marginBottom: '1rem' }}>
              Let's create something <span className="aman-gradient-text">extraordinary</span> together.
            </h2>
            <p style={{ fontSize: '1.05rem', color: themeStyles.textMuted, maxWidth: '500px', margin: '0 auto 2rem auto', fontWeight: 300 }}>
              Have a project in mind or want to collaborate? Feel free to reach out directly.
            </p>
            {email && (
              <a href={`mailto:${email}`} className="aman-btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2.25rem' }}>
                <Mail size={20} />
                <span>{email}</span>
              </a>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2.5rem', fontSize: '0.85rem', color: themeStyles.textMuted }}>
              {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={15} color="#ec4899" /> {phone}</div>}
              {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={15} color="#ec4899" /> {location}</div>}
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${themeStyles.cardBorder}`, fontSize: '0.8rem', color: themeStyles.textMuted }}>
              © {new Date().getFullYear()} {name || 'Portfolio'}. All rights reserved.
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default TemplateAmanDev;
