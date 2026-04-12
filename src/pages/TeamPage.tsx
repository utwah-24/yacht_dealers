import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { teamMembers } from "@/data/teamMembers";
import backgroundImage from "@/assets/background.jpg";

const TeamPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navigation />
      <section className="relative pt-8 pb-20 md:pb-28">
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="mb-10 md:mb-12">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10 font-spartan -ml-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <header className="text-center mb-14 md:mb-20">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-soria drop-shadow-md"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
            >
              Our team
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed font-spartan">
              The people behind every charter — read more about each role and how we work together on
              the water.
            </p>
          </header>

          <div className="space-y-16 md:space-y-24">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 lg:gap-14"
              >
                <div className="w-full md:w-[min(100%,380px)] md:flex-shrink-0 mx-auto md:mx-0">
                  <div className="overflow-hidden rounded-xl bg-white/5 aspect-[3/4] shadow-lg shadow-black/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left pt-0 md:pt-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-spartan leading-tight tracking-tight">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-medium text-white/80 uppercase tracking-wide font-spartan">
                    {member.title}
                  </p>
                  <p className="mt-6 text-base sm:text-[1.05rem] text-white/90 leading-relaxed font-spartan">
                    {member.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TeamPage;
