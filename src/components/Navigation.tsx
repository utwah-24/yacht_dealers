import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#fleet", label: "Our Fleet" },
    { href: "#locations", label: "Packages" },
    { href: "#team", label: "Our Team" },
    { to: "/menu", label: "Our Menu" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020810] backdrop-blur-md border-b border-blue-900/50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between bg-[#020810]">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src="/videos/cc.PNG" 
            alt="Yacht Dealers Tanzania" 
            className="h-10 w-auto object-contain bg-[#020810] rounded"
          />
          <span className="text-xl font-semibold text-white font-soria">Yachtdealers.tz</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) =>
            "to" in item && item.to ? (
              <Link
                key={item.to}
                to={item.to}
                className="relative text-white/95 hover:text-white transition-colors duration-300 font-spartan font-medium text-base group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-400 rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_6px_#60a5fa]" />
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="relative text-white/95 hover:text-white transition-colors duration-300 font-spartan font-medium text-base group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-400 rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_6px_#60a5fa]" />
              </a>
            )
          )}
          <Link to="/booking">
            <Button variant="ocean" size="sm" className="font-spartan text-base font-medium">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:text-white hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#020810] backdrop-blur-md border-b border-blue-900/50">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) =>
              "to" in item && item.to ? (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block text-white hover:text-blue-200 transition-colors duration-300 font-quicksand font-black"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-white hover:text-blue-200 transition-colors duration-300 font-quicksand font-black"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
            <Link to="/booking" className="w-full">
              <Button variant="ocean" className="w-full font-quicksand" onClick={() => setIsOpen(false)}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;