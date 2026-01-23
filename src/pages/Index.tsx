import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Fleet from "@/components/Fleet";
import Gallery from "@/components/Gallery";
import Locations from "@/components/Locations";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Locations />
      <Fleet />
      <Gallery />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
