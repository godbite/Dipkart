import { useState, useEffect, useCallback } from 'react';
import './HeroCarousel.css';

const banners = [
  {
    id: 1,
    image: '/carousel/banner1.png',
    alt: 'Save on International - Up to ₹25,000 Off',
    bgColor: '#2196f3'
  },
  {
    id: 2,
    image: '/carousel/banner2.png',
    alt: 'Epic Travel Days - Flat 13% Off on Flights',
    bgColor: '#8a4af3'
  },
  {
    id: 3,
    image: '/carousel/banner3.png',
    alt: 'Beds From ₹8,999',
    bgColor: '#2196f3'
  },
  {
    id: 4,
    image: '/carousel/banner4.png',
    alt: 'Nothing Phone 3a - From ₹22,999',
    bgColor: '#d5d8dc'
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div 
      className="hero-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="carousel-slide"
            style={{ backgroundColor: banner.bgColor }}
          >
            <img src={banner.image} alt={banner.alt} />
          </div>
        ))}
      </div>

      <button className="carousel-btn prev" onClick={prevSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="carousel-btn next" onClick={nextSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="carousel-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
