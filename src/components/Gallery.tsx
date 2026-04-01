import React from 'react';
import Masonry from './Masonry';
import backgroundImage from '@/assets/background.jpg';

// Images from public/videos/GALLERY/ and public/videos/NPM/
// Note: HEIC (2, 3, 4) excluded - convert to JPG/PNG for browser support
const galleryImages = [
  '/videos/GALLERY/2026_03_17_11_13_IMG_4698.JPG',
  '/videos/GALLERY/2026_03_17_11_13_IMG_4699.JPG',
  '/videos/GALLERY/2026_03_17_11_13_IMG_4700.JPG',
  '/videos/GALLERY/2026_03_17_11_13_IMG_4701.JPG',
  '/videos/GALLERY/2026_03_17_11_19_IMG_4704.WEBP',
  '/videos/GALLERY/2026_03_17_11_21_IMG_4705.JPG',
  '/videos/GALLERY/2026_03_17_11_24_IMG_4707.JPG',
  '/videos/GALLERY/2026_03_17_11_25_IMG_4708.JPG',
  '/videos/GALLERY/2026_03_17_11_26_IMG_4709.JPG',
  '/videos/GALLERY/2026_03_17_11_27_IMG_4710.JPG',
  '/videos/GALLERY/2026_03_17_11_29_IMG_4711.JPG',
  '/videos/GALLERY/2026_03_17_11_31_IMG_4712.JPG',
  '/videos/GALLERY/2026_03_17_11_31_IMG_4713.JPG',
  '/videos/GALLERY/2026_03_17_11_33_IMG_4714.JPG',
  '/videos/GALLERY/2026_03_17_11_34_IMG_4715.JPG',
  // NPM folder images
  '/videos/NPM/8%20copy.PNG',
  '/videos/NPM/1.jpeg',
  '/videos/NPM/6.PNG',
];

const heights = [400, 350, 500, 300, 450, 380, 420, 360, 480, 340, 410, 390, 440, 370, 460, 420, 380, 450, 400, 430, 390, 350];

const Gallery = () => {
  const items = galleryImages.map((img, index) => ({
    id: `gallery-img-${index + 1}`,
    img,
    height: heights[index % heights.length],
  }));

  return (
    <section className="relative py-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-soria mb-4 drop-shadow-md" style={{ fontSize: 'clamp(2rem, 6vw, 85px)' }}>
            Gallery
          </h2>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow">
            Explore our stunning collection of yacht experiences
          </p>
        </div>
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>
    </section>
  );
};

export default Gallery;
