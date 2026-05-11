import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const videoStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  transform: 'scale(1.02)',
  transition: 'opacity 1s ease-in-out',
};

const Hero = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: '100%', height: '100%' }}>
        {isMobile ? (
          <video
            key="mobile"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/hero_vid_phone_poster.jpg"
            style={videoStyle}
          >
            <source src="/videos/hero_vid_phone_compressed.mp4" type="video/mp4" />
          </video>
        ) : (
          <video
            key="desktop"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/hero_vid_poster.jpg"
            style={videoStyle}
          >
            <source src="/videos/hero_vid_compressed.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/65"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-soria"
          style={{ animation: 'heroFadeUp 0.9s ease-out 0.2s both' }}
        >
          Where luxury
          <span className="block bg-gradient-ocean bg-clip-text text-transparent font-soria">
            meets the ocean
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"
          style={{ animation: 'heroFadeUp 0.9s ease-out 0.6s both' }}
        >
          Experience the pristine waters of Tanzania aboard our premium yacht fleet. 
          Discover hidden islands, pristine beaches, and unforgettable moments in 
          Dar es Salaam and Zanzibar.
        </p>

        {/* Location Badges */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80"
          style={{ animation: 'heroFadeUp 0.9s ease-out 1s both' }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-spartan text-xl">Dar es Salaam • Slipway Hotel</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-spartan text-xl">Zanzibar • Hotel Verde & Nungwi</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;