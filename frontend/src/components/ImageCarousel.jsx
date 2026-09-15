import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const ImageCarousel = ({ images = [], alt = 'Project Screenshot', height = '240px', fitMode = 'contain' }) => {
  // Normalize images array
  const imageList = Array.isArray(images) && images.length > 0
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (imageList.length === 0) {
    return null;
  }

  const getFullUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') || url.startsWith('/uploads') ? url : `http://localhost:8080${url}`;
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const currentImage = getFullUrl(imageList[currentIndex]);

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: height,
          borderRadius: '0.85rem',
          overflow: 'hidden',
          backgroundColor: '#090d16',
          marginBottom: '1rem',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.45)',
          userSelect: 'none'
        }}
      >
        {/* Blurred Background Layer (prevents ugly empty bars & fills aspect ratio) */}
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            backgroundImage: `url(${currentImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.4)',
            opacity: 0.7,
            transform: 'scale(1.15)',
            zIndex: 0
          }}
        />

        {/* Main Foreground Image */}
        <img
          key={currentIndex}
          src={currentImage}
          alt={`${alt} ${currentIndex + 1}`}
          onClick={() => setLightboxOpen(true)}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            objectFit: fitMode, // 'contain' fits full image without cropping!
            display: 'block',
            cursor: 'zoom-in',
            transition: 'all 0.3s ease-in-out',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        />

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          title="View full image"
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Maximize2 size={15} />
        </button>

        {/* Navigation Arrows (Only if > 1 image) */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                top: '50%',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                zIndex: 3
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              style={{
                position: 'absolute',
                top: '50%',
                right: '0.75rem',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                zIndex: 3
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {imageList.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              color: '#e2e8f0',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 3
            }}
          >
            {currentIndex + 1} / {imageList.length}
          </div>
        )}

        {/* Bottom Pagination Dots */}
        {imageList.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(6px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 3
            }}
          >
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => goToSlide(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? '18px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: idx === currentIndex ? '#10b981' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <X size={24} />
          </button>

          <img
            src={currentImage}
            alt={alt}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
            }}
          />
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
