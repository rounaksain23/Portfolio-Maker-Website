import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, FileText, Download } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as Globe } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplateMinimal = ({ portfolioData }) => {
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
    <div style={{ backgroundColor: '#fafafa', color: '#171717', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        
        {/* Header */}
        <header style={{ borderBottom: '1px solid #e5e5e5', pb: '3rem', marginBottom: '3rem', paddingBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {profileImageUrl && (
              <img
                src={profileImageUrl.startsWith('http') || profileImageUrl.startsWith('/uploads') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`}
                alt={name}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e5e5' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '0.25rem' }}>{name || 'Your Name'}</h1>
              <p style={{ fontSize: '1.25rem', color: '#525252', fontWeight: 400, marginBottom: '1rem' }}>{title || 'Professional Title'}</p>
              
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#737373' }}>
                {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={15} /> {email}</div>}
                {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={15} /> {phone}</div>}
                {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={15} /> {location}</div>}
              </div>
            </div>
          </div>

          {bio && (
            <p style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#404040', maxWidth: '750px' }}>
              {bio}
            </p>
          )}

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {githubLink && (
              <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" style={{ color: '#171717', background: '#f5f5f5', border: '1px solid #e5e5e5', padding: '0.45rem 0.9rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }} title="GitHub Profile">
                <Github size={16} />
                <span>GitHub Profile</span>
              </a>
            )}
            {linkedinLink && (
              <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" style={{ color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.45rem 0.9rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }} title="LinkedIn Profile">
                <Linkedin size={16} />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {twitterLink && <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" style={{ color: '#404040' }}><Twitter size={20} /></a>}
            {websiteLink && <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" style={{ color: '#404040' }}><Globe size={20} /></a>}
            {resumeUrl && (
              <>
                <a
                  href={getResumeViewUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0958d9', background: '#e6f4ff', border: '1px solid #91caff', padding: '0.45rem 0.9rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  <FileText size={16} />
                  <span>View Resume</span>
                </a>
                <a
                  href={getDownloadUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ color: '#0958d9', background: '#e6f4ff', border: '1px solid #91caff', padding: '0.45rem 0.9rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </a>
              </>
            )}
          </div>
        </header>

        {/* Projects Section */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#0a0a0a', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>Featured Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj) => {
                const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                const primaryRedirectUrl = liveUrl || githubUrl;

                return (
                  <div
                    key={proj.id}
                    onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                    style={{
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.2s ease',
                      cursor: primaryRedirectUrl ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <ImageCarousel
                      images={proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : (proj.imageUrl ? [proj.imageUrl] : [])}
                      alt={proj.title}
                      height="220px"
                      fitMode="contain"
                    />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#171717', marginBottom: '0.5rem', marginTop: '0.5rem' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#525252', marginBottom: '1rem', lineHeight: '1.5', flex: 1 }}>{proj.description}</p>
                    {proj.techStack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {proj.techStack.split(',').map((t, idx) => (
                          <span key={idx} style={{ background: '#f5f5f5', color: '#525252', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', borderTop: '1px solid #f5f5f5', paddingTop: '0.75rem' }}>
                      {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: '#171717', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}><Github size={14}/> Code</a>}
                      {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={14}/> Live Demo</a>}
                      {!liveUrl && !githubUrl && primaryRedirectUrl && (
                        <a href={primaryRedirectUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={14}/> Open Project</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#0a0a0a', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>Skills & Expertise</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ background: '#ffffff', border: '1px solid #e5e5e5', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem', color: '#262626' }}>
                  {skill.name} {skill.category && <span style={{ color: '#a3a3a3', fontSize: '0.75rem', marginLeft: '0.25rem' }}>({skill.category})</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experienceList.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#0a0a0a', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {experienceList.map((exp) => (
                <div key={exp.id} style={{ borderLeft: '2px solid #171717', paddingLeft: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#171717' }}>{exp.position}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#525252', marginBottom: '0.5rem' }}>
                    <strong>{exp.company}</strong> {exp.location && `• ${exp.location}`} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && <p style={{ fontSize: '0.92rem', color: '#404040', lineHeight: '1.5' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {educationList.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#0a0a0a', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {educationList.map((edu) => (
                <div key={edu.id}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#171717' }}>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#525252' }}>{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer style={{ textAlign: 'center', borderTop: '1px solid #e5e5e5', paddingTop: '2rem', color: '#a3a3a3', fontSize: '0.85rem' }}>
          Published with Portfolio Generator
        </footer>
      </div>
    </div>
  );
};

export default TemplateMinimal;
