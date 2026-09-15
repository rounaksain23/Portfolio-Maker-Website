import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Briefcase, GraduationCap, Code, UserCheck, FileText, Download } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as Globe } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplateClassic = ({ portfolioData }) => {
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

  let social = {};
  try {
    social = typeof rawSocialLinks === 'string' ? JSON.parse(rawSocialLinks) : (rawSocialLinks || {});
  } catch (e) {
    social = {};
  }

  const getValidUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const githubLink = social.github || social.githubUrl || social.githubLink || social.GitHub || '';
  const linkedinLink = social.linkedin || social.linkedinUrl || social.linkedinLink || social.LinkedIn || '';
  const twitterLink = social.twitter || social.twitterUrl || social.Twitter || '';
  const websiteLink = social.website || social.websiteUrl || social.Website || '';

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Header Bar */}
        <header style={{ background: '#0f172a', color: '#ffffff', padding: '3rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {profileImageUrl && (
              <img
                src={profileImageUrl.startsWith('http') || profileImageUrl.startsWith('/uploads') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`}
                alt={name}
                style={{ width: '130px', height: '130px', borderRadius: '0.75rem', objectFit: 'cover', border: '2px solid #334155' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                {name || 'Executive Name'}
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 600, marginBottom: '1rem' }}>
                {title || 'Senior Software Engineer'}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: '#94a3b8' }}>
                {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={15} color="#38bdf8" /> {email}</div>}
                {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={15} color="#38bdf8" /> {phone}</div>}
                {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={15} color="#38bdf8" /> {location}</div>}
              </div>
            </div>
          </div>

          {/* Social Row */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #1e293b', flexWrap: 'wrap' }}>
            {linkedinLink && <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 600 }}><Linkedin size={16} /> LinkedIn Profile</a>}
            {githubLink && <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 600 }}><Github size={16} /> GitHub Profile</a>}
            {twitterLink && <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}><Twitter size={16} /> Twitter</a>}
            {websiteLink && <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}><Globe size={16} /> Website</a>}
            {resumeUrl && (
              <>
                <a href={getResumeViewUrl(resumeUrl)} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 600 }}>
                  <FileText size={16} /> View Resume
                </a>
                <a href={getDownloadUrl(resumeUrl)} target="_blank" rel="noreferrer" download style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Download size={16} /> Download Resume
                </a>
              </>
            )}
          </div>
        </header>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem', padding: '2.5rem' }}>
          
          {/* Main Left Column */}
          <div>
            {bio && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={18} /> Executive Summary
                </h2>
                <p style={{ fontSize: '0.98rem', lineHeight: '1.7', color: '#334155' }}>{bio}</p>
              </section>
            )}

            {/* Experience */}
            {experienceList.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={18} /> Work Experience
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {experienceList.map((exp) => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{exp.position}</h3>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.4rem' }}>
                        {exp.company} {exp.location && `| ${exp.location}`}
                      </div>
                      {exp.description && <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Projects */}
            {projects.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Code size={18} /> Key Projects
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {projects.map((proj) => {
                    const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                    const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                    const primaryRedirectUrl = liveUrl || githubUrl;

                    return (
                      <div
                        key={proj.id}
                        onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          background: '#f8fafc',
                          cursor: primaryRedirectUrl ? 'pointer' : 'default',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ImageCarousel
                          images={proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : (proj.imageUrl ? [proj.imageUrl] : [])}
                          alt={proj.title}
                          height="220px"
                          fitMode="contain"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem', marginTop: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{proj.title}</h3>
                          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
                            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>GitHub</a>}
                            {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>Live Demo</a>}
                            {!liveUrl && !githubUrl && primaryRedirectUrl && (
                              <a href={primaryRedirectUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>Open Project</a>
                            )}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '0.5rem', lineHeight: '1.5' }}>{proj.description}</p>
                        {proj.techStack && (
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            <strong>Technologies:</strong> {proj.techStack}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.5rem' }}>
            
            {/* Skills */}
            {skills.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.35rem', marginBottom: '1rem' }}>
                  Core Competencies
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {skills.map((skill) => (
                    <div key={skill.id} style={{ background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.88rem', color: '#1e293b', fontWeight: 500 }}>
                      {skill.name} {skill.proficiency && <span style={{ float: 'right', color: '#64748b', fontSize: '0.78rem' }}>{skill.proficiency}%</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educationList.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <GraduationCap size={16} /> Education
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {educationList.map((edu) => (
                    <div key={edu.id}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{edu.degree}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#2563eb' }}>{edu.institution}</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{edu.startDate} – {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <footer style={{ background: '#f1f5f9', textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
          Portfolio generated via Portfolio Generator Platform
        </footer>
      </div>
    </div>
  );
};

export default TemplateClassic;
