import { useEffect, useState } from "react";
import introVideo from "@/assets/videos/boat party.mp4";
import backgroundImage from "@/assets/background.jpg";

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Intro Video */}
        <div className="w-full max-w-xs mx-auto">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
          >
            <source src={introVideo} type="video/mp4" />
          </video>
        </div>

        {/* Text below illustration */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide animate-fade-in font-quicksand drop-shadow-md" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
          YATCH DEALERS TZ
        </h1>
      </div>
    </div>
  );
};

export default IntroScreen;
