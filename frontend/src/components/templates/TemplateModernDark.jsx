import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Sparkles, Briefcase, GraduationCap, Code, FileText, Download } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as Globe } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplateModernDark = ({ portfolioData }) => {
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

  const getValidUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const social = rawSocialLinks || {};
  const githubLink = social.github || social.githubUrl || social.githubLink || social.GitHub || '';
  const linkedinLink = social.linkedin || social.linkedinUrl || social.linkedinLink || social.LinkedIn || '';
  const twitterLink = social.twitter || social.twitterUrl || social.Twitter || '';
  const websiteLink = social.website || social.websiteUrl || social.Website || '';

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f3f4f6', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif', paddingBottom: '4rem' }}>
      
      {/* Glow background decoration */}
      <div style={{ position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(0,0,0,0) 80%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Hero Card */}
        <header style={{
          background: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '3rem 2.5rem',
          marginBottom: '3.5rem',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl.startsWith('http') || profileImageUrl.startsWith('/uploads') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`}
                alt={name}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 700 }}>
                {name ? name.charAt(0).toUpperCase() : 'M'}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                <Sparkles size={14} /> Full Stack Portfolio
              </div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                {name || 'Your Name'}
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#06b6d4', fontWeight: 600, marginTop: '0.25rem' }}>
                {title || 'Software Engineer'}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
                {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16} color="#6366f1" /> {email}</div>}
                {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16} color="#6366f1" /> {phone}</div>}
                {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} color="#6366f1" /> {location}</div>}
              </div>
            </div>
          </div>

          {bio && (
            <p style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#d1d5db', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
              {bio}
            </p>
          )}

          {/* Social icons & profile badges */}
          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {githubLink && (
              <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }} title="GitHub Profile">
                <Github size={18} />
                <span>GitHub Profile</span>
              </a>
            )}
            {linkedinLink && (
              <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }} title="LinkedIn Profile">
                <Linkedin size={18} />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {twitterLink && <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#38bdf8', padding: '0.6rem', borderRadius: '50%', display: 'flex' }} title="Twitter"><Twitter size={18} /></a>}
            {websiteLink && <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#a855f7', padding: '0.6rem', borderRadius: '50%', display: 'flex' }} title="Website"><Globe size={18} /></a>}
            {resumeUrl && (
              <>
                <a
                  href={getResumeViewUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  <FileText size={18} />
                  <span>View Resume</span>
                </a>
                <a
                  href={getDownloadUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  <Download size={18} />
                  <span>Download Resume</span>
                </a>
              </>
            )}
          </div>
        </header>

        {/* Projects Grid */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code color="#6366f1" /> Featured Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj) => {
                const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                const primaryRedirectUrl = liveUrl || githubUrl;

                return (
                  <div
                    key={proj.id}
                    onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                    style={{
                      background: 'rgba(17, 24, 39, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, border-color 0.2s',
                      cursor: primaryRedirectUrl ? 'pointer' : 'default'
                    }}
                  >
                    <ImageCarousel
                      images={proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : (proj.imageUrl ? [proj.imageUrl] : [])}
                      alt={proj.title}
                      height="230px"
                      fitMode="contain"
                    />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: '#9ca3af', flex: 1, marginBottom: '1rem', lineHeight: '1.6' }}>{proj.description}</p>
                    
                    {proj.techStack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {proj.techStack.split(',').map((t, idx) => (
                          <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><Github size={15}/> Code</a>}
                      {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={15}/> Live Demo</a>}
                      {!liveUrl && !githubUrl && primaryRedirectUrl && (
                        <a href={primaryRedirectUrl} target="_blank" rel="noreferrer" style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={15}/> Open Link</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles color="#06b6d4" /> Technical Skills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>{skill.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>{skill.proficiency || 80}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.proficiency || 80}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experienceList.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase color="#a855f7" /> Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experienceList.map((exp) => (
                <div key={exp.id} style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{exp.position}</h3>
                    <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#06b6d4', fontWeight: 500, marginBottom: '0.75rem' }}>
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.6' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educationList.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap color="#10b981" /> Education
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {educationList.map((edu) => (
                <div key={edu.id} style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>{edu.degree}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 500, marginBottom: '0.5rem' }}>{edu.institution}</p>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginTop: '4rem' }}>
          Crafted with Portfolio Generator Platform
        </footer>
      </div>
    </div>
  );
};

export default TemplateModernDark;
