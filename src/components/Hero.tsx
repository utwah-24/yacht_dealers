import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const SLIDESHOW_IMAGES = [
  "/slideshow/image1.jpg",
  "/slideshow/image2.jpg",
  "/slideshow/image3.jpg",
  "/slideshow/image4.jpg",
  "/slideshow/image5.jpg",
  "/slideshow/image6.jpg",
];

const SLIDE_INTERVAL_MS = 6000;
const FADE_DURATION_MS = 1000;

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {SLIDESHOW_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden={index !== activeIndex}
            className="absolute inset-0 h-full w-full object-cover object-center scale-[1.02]"
            style={{
              opacity: index === activeIndex ? 1 : 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/65" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-soria"
          style={{ animation: "heroFadeUp 0.9s ease-out 0.2s both" }}
        >
          Where luxury<br />
          <span className="mt-2 inline-block bg-black/50 px-4 py-1 font-soria text-white">
            meets the ocean
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"
          style={{ animation: "heroFadeUp 0.9s ease-out 0.6s both" }}
        >
          Experience the pristine waters of Tanzania aboard our premium yacht fleet.
          Discover hidden islands, pristine beaches, and unforgettable moments in
          Dar es Salaam and Zanzibar.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80"
          style={{ animation: "heroFadeUp 0.9s ease-out 1s both" }}
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
