import { Link } from "react-router-dom";
import backgroundImage from "@/assets/background.jpg";
import { teamMembers } from "@/data/teamMembers";

const Team = () => {
  return (
    <section
      id="team"
      className="relative pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header — centered title + copy */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white tracking-tight font-soria">
            Our team
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed font-spartan">
            Meet the people behind every charter — leadership, culinary craft, operations, and
            storytelling — working together so your time on the water feels effortless.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <article key={member.id} className="text-left">
              <div className="overflow-hidden rounded-xl bg-white/5 aspect-[3/4]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-white font-spartan leading-snug">
                {member.name}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-white/65 font-spartan leading-snug">
                {member.title}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            to="/team"
            className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 font-spartan"
          >
            Read more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;
