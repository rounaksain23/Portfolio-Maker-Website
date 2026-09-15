import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import TemplateMinimal from '../components/templates/TemplateMinimal';
import TemplateModernDark from '../components/templates/TemplateModernDark';
import TemplateCreative from '../components/templates/TemplateCreative';
import TemplateClassic from '../components/templates/TemplateClassic';
import TemplateAmanDev from '../components/templates/TemplateAmanDev';
import TemplatePersonalBrand from '../components/templates/TemplatePersonalBrand';
import { AlertCircle, Lock, Home } from 'lucide-react';

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const res = await api.get(`/public/portfolio/${slug}`);
        setPortfolioData(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Portfolio not found or currently unpublished.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading portfolio...</p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '1.5rem', color: '#ffffff' }}>
        <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Portfolio Unavailable</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none', justifyContent: 'center' }}>
            <Home size={16} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const templateKey = portfolioData.templateKey || 'modern-dark';

  switch (templateKey) {
    case 'minimal':
      return <TemplateMinimal portfolioData={portfolioData} />;
    case 'creative':
      return <TemplateCreative portfolioData={portfolioData} />;
    case 'classic':
      return <TemplateClassic portfolioData={portfolioData} />;
    case 'aman-dev':
      return <TemplateAmanDev portfolioData={portfolioData} />;
    case 'personal-brand':
      return <TemplatePersonalBrand portfolioData={portfolioData} />;
    case 'modern-dark':
    default:
      return <TemplateModernDark portfolioData={portfolioData} />;
  }
};

export default PublicPortfolio;
