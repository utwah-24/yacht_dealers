import Footer from "@/components/Footer";
import foodImage from "@/assets/food.jpeg";

const MenuPage = () => {
  const menuCategories = [
    {
      title: "CHEF MENU",
      items: [
        "Beef skewers",
        "Fish skewers",
        "BBQ rosemary chicken",
        "Garlic prawns",
        "Plantains",
        "Roast potatoes",
        "Veg. Fried rice",
        "Apple salad",
        "Avocado salad",
        "Tommysalad",
        "Cubes salad",
        "Chachandu",
        "Matunda"
      ]
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          className="relative py-20 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${foodImage})` }}
        >
          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-quicksand mb-6 drop-shadow-md" style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}>
                Our Food Menu
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Discover our exquisite selection of dishes crafted with the finest ingredients
              </p>
            </div>

            {/* Menu Content */}
            <div className="max-w-4xl mx-auto">
              {menuCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
                  <h2 className="text-3xl md:text-4xl font-black text-black font-quicksand mb-8 pb-4 border-b-4 border-black">
                    {category.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-black group-hover:bg-black/70 transition-colors"></div>
                          <span className="text-lg md:text-xl font-semibold text-gray-800 font-quicksand">
                            {item}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      <Footer />
      </div>
    </>
  );
};

export default MenuPage;

