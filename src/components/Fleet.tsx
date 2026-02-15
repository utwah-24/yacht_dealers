import { useNavigate } from "react-router-dom";
import AnimatedItem from "@/components/ui/animated-item";
import { getAllBoats } from "@/utils/boats";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/background.jpg";

const Fleet = () => {
  const navigate = useNavigate();
  const allBoats = getAllBoats();
  const displayedBoats = allBoats.slice(0, 4);
  const hasMoreBoats = allBoats.length > 4;

  const handleReadMore = (boatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/boat/${boatId}`);
  };

  return (
    <section id="fleet" className="relative py-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white font-quicksand drop-shadow-md" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Our <span className="text-white font-quicksand">Fleet</span>
          </h2>
          <p className="text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Discover our premium catamaran fleet, each vessel designed to provide you with an unforgettable yacht experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {displayedBoats.map((yacht, index) => (
            <AnimatedItem key={yacht.id} delay={index * 100} animation="fadeInUp">
              <div className="overflow-hidden group">
                {/* Image */}
                <div 
                  className="w-full aspect-square bg-cover bg-center mb-2 rounded-lg max-w-[200px] mx-auto relative overflow-hidden cursor-pointer"
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

        {hasMoreBoats && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/all-boats')}
              className="bg-black text-white hover:bg-black/90 px-8 py-6 text-lg font-semibold rounded-lg"
            >
              See All
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Fleet;


