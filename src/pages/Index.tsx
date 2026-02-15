import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Fleet from "@/components/Fleet";
import FoodMenu from "@/components/FoodMenu";
import Gallery from "@/components/Gallery";
import Locations from "@/components/Locations";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/ui/animated-section";
import backgroundImage from "@/assets/background.jpg";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navigation />
      <Hero />
      <AnimatedSection animation="fadeInUp" delay={0}>
        <Locations />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={100}>
        <Fleet />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={100}>
        <FoodMenu />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={100}>
        <Gallery />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={100}>
        <Team />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={100}>
        <Contact />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
