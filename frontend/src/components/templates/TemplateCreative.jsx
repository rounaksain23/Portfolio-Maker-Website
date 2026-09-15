import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Heart, Rocket, Award, Star, FileText, Download } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, GlobeIcon as Globe } from '../SocialIcons';
import ImageCarousel from '../ImageCarousel';
import { getResumeViewUrl, getDownloadUrl } from '../../utils/resumeUtils';

const TemplateCreative = ({ portfolioData }) => {
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
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: '"Space Grotesk", sans-serif', paddingBottom: '4rem' }}>
      
      {/* Dynamic Gradient Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
        padding: '5rem 1.5rem 6rem',
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          {profileImageUrl && (
            <img
              src={profileImageUrl.startsWith('http') || profileImageUrl.startsWith('/uploads') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`}
              alt={name}
              style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '5px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)', marginBottom: '1.5rem' }}
            />
          )}

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            {name || 'Creative Maker'}
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fbcfe8', fontWeight: 500, marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            ✨ {title || 'Creative Technologist'} ✨
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', color: '#ffffff', opacity: 0.95, fontSize: '0.95rem' }}>
            {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 1rem', borderRadius: '999px' }}><Mail size={16} /> {email}</div>}
            {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 1rem', borderRadius: '999px' }}><Phone size={16} /> {phone}</div>}
            {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 1rem', borderRadius: '999px' }}><MapPin size={16} /> {location}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {githubLink && (
              <a href={getValidUrl(githubLink)} target="_blank" rel="noreferrer" style={{ background: '#ffffff', color: '#4f46e5', padding: '0.6rem 1.25rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }} title="GitHub Profile">
                <Github size={20} />
                <span>GitHub Profile</span>
              </a>
            )}
            {linkedinLink && (
              <a href={getValidUrl(linkedinLink)} target="_blank" rel="noreferrer" style={{ background: '#ffffff', color: '#7c3aed', padding: '0.6rem 1.25rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }} title="LinkedIn Profile">
                <Linkedin size={20} />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {twitterLink && <a href={getValidUrl(twitterLink)} target="_blank" rel="noreferrer" style={{ background: '#ffffff', color: '#db2777', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Twitter size={20} /></a>}
            {websiteLink && <a href={getValidUrl(websiteLink)} target="_blank" rel="noreferrer" style={{ background: '#ffffff', color: '#059669', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Globe size={20} /></a>}
            {resumeUrl && (
              <>
                <a href={getResumeViewUrl(resumeUrl)} target="_blank" rel="noreferrer" style={{ background: '#ffffff', color: '#4f46e5', padding: '0.6rem 1.25rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                  <FileText size={20} />
                  <span>View Resume</span>
                </a>
                <a href={getDownloadUrl(resumeUrl)} target="_blank" rel="noreferrer" download style={{ background: '#ffffff', color: '#7c3aed', padding: '0.6rem 1.25rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                  <Download size={20} />
                  <span>Download Resume</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Dynamic background art */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(0,0,0,0) 80%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header Hero */}
        <header style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(244, 63, 94, 0.2)',
          borderRadius: '1.5rem',
          padding: '3rem 2.5rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl.startsWith('http') || profileImageUrl.startsWith('/uploads') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`}
                alt={name}
                style={{ width: '120px', height: '120px', borderRadius: '1.5rem', objectFit: 'cover', border: '3px solid #f43f5e' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '1.5rem', background: 'linear-gradient(135deg, #f43f5e, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 800 }}>
                {name ? name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Sparkles size={14} /> Creative Portfolio
              </div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 0%, #f43f5e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                {name || 'Your Name'}
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#a855f7', fontWeight: 700, marginTop: '0.25rem' }}>
                {title || 'Creative Professional'}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                {email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16} color="#f43f5e" /> {email}</div>}
                {phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16} color="#f43f5e" /> {phone}</div>}
                {location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} color="#f43f5e" /> {location}</div>}
              </div>
            </div>
          </div>

          {bio && (
            <p style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#e2e8f0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
              {bio}
            </p>
          )}

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {social.github && <a href={getValidUrl(social.github)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Github size={18} /></a>}
            {social.linkedin && <a href={getValidUrl(social.linkedin)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#38bdf8', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Linkedin size={18} /></a>}
            {social.twitter && <a href={getValidUrl(social.twitter)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#818cf8', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Twitter size={18} /></a>}
            {social.website && <a href={getValidUrl(social.website)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#a855f7', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><Globe size={18} /></a>}
          </div>
        </header>

        {/* Projects Grid */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f43f5e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Rocket size={26} /> Featured Creations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj) => {
                const liveUrl = getValidUrl(proj.liveLink || proj.liveUrl);
                const githubUrl = getValidUrl(proj.githubLink || proj.githubUrl);
                const primaryRedirectUrl = liveUrl || githubUrl;

                return (
                  <div
                    key={proj.id}
                    onClick={() => primaryRedirectUrl && window.open(primaryRedirectUrl, '_blank')}
                    style={{
                      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                      border: '2px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '1.25rem',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: primaryRedirectUrl ? 'pointer' : 'default'
                    }}
                  >
                    <ImageCarousel
                      images={proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : (proj.imageUrl ? [proj.imageUrl] : [])}
                      alt={proj.title}
                      height="230px"
                      fitMode="contain"
                    />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.5', flex: 1 }}>{proj.description}</p>
                    
                    {proj.techStack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                        {proj.techStack.split(',').map((t, idx) => (
                          <span key={idx} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><Github size={15}/> Code</a>}
                      {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" style={{ color: '#f43f5e', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={15}/> Live Demo</a>}
                      {!liveUrl && !githubUrl && primaryRedirectUrl && (
                        <a href={primaryRedirectUrl} target="_blank" rel="noreferrer" style={{ color: '#f43f5e', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={(e) => e.stopPropagation()}><ExternalLink size={15}/> Open Link</a>
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
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#a855f7', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={26} /> Superpowers
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', color: '#ffffff', padding: '0.6rem 1.25rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}>
                  {skill.name} {skill.proficiency && <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: '0.3rem' }}>{skill.proficiency}%</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experienceList.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={26} /> Journey & Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experienceList.map((exp) => (
                <div key={exp.id} style={{ background: '#1e293b', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{exp.position}</h3>
                    <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{exp.company} {exp.location && `(${exp.location})`}</p>
                  {exp.description && <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educationList.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginBottom: '1.5rem' }}>Education</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {educationList.map((edu) => (
                <div key={edu.id} style={{ background: '#1e293b', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{edu.degree}</h3>
                  <p style={{ color: '#34d399', fontSize: '0.9rem' }}>{edu.institution}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '3rem' }}>
          Made with <Heart size={14} color="#f43f5e" style={{ display: 'inline', verticalAlign: 'middle' }} /> via Portfolio Generator
        </footer>
      </div>
    </div>
  );
};

export default TemplateCreative;
