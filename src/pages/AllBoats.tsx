import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";
import AnimatedItem from "@/components/ui/animated-item";
import { getAllBoats } from "@/utils/boats";
import backgroundImage from "@/assets/background.jpg";

const AllBoats = () => {
  const navigate = useNavigate();
  const allBoats = getAllBoats();

  const handleReadMore = (boatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/boat/${boatId}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <section className="relative py-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white font-quicksand drop-shadow-md" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
              Our Complete <span className="text-white font-quicksand">Fleet</span>
            </h2>
            <p className="text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Explore our entire premium catamaran fleet, each vessel designed to provide you with an unforgettable yacht experience.
            </p>
          </div>

          {/* All Boats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {allBoats.map((yacht, index) => (
              <AnimatedItem key={yacht.id} delay={index * 50} animation="fadeInUp">
                <div className="overflow-hidden group">
                  {/* Image */}
                  <div 
                    className="w-full aspect-square bg-cover bg-center mb-2 rounded-lg max-w-[250px] mx-auto relative overflow-hidden cursor-pointer"
                    style={{ backgroundImage: `url(${yacht.image})` }}
                    onClick={() => navigate(`/boat/${yacht.id}`)}
                  >
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                      <button 
                        onClick={(e) => handleReadMore(yacht.id, e)}
                        className="bg-white text-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-black text-center text-base md:text-lg font-bold font-quicksand bg-white px-3 py-1.5 rounded-md inline-block">
                    {yacht.name}
                  </h3>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllBoats;

