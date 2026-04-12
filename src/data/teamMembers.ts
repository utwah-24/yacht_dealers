import ceoPic from "@/assets/Our team /Company CEO/Pic.jpeg";
import chefPic from "@/assets/Our team /Chef/pic.jpeg";
import accountantPic from "@/assets/Our team /Accountant/pic.jpeg";
import videographerPic from "@/assets/Our team /Videographer/pic.jpeg";
import djPic from "@/assets/Our team /Dj/pic.jpeg";

export interface TeamMember {
  id: string;
  image: string;
  name: string;
  title: string;
  description: string;
}

/** Synced with Details.txt / details.txt in each `Our team /…` folder */
export const teamMembers: TeamMember[] = [
  {
    id: "ceo",
    image: ceoPic,
    name: "TONYEVERIST BENEDICT OLELAPUT",
    title: "COMPANY CEO",
    description:
      "As the CEO of Yacht Dealers, I am truly grateful to every customer who continues to choose us for their special moments on the water. My goal is not only to provide a luxury yacht experience, but to create unforgettable memories that reflect comfort, exclusivity, and genuine enjoyment. I focus on understanding each client's unique desires and turning them into personalized experiences—whether it's a relaxing escape, a celebration, or a private adventure. With every journey, I aim to exceed expectations through exceptional service, attention to detail, and consistency, ensuring that every guest feels valued and leaves with memories they will always cherish.",
  },
  {
    id: "chef",
    image: chefPic,
    name: "Nathan Ainea",
    title: "Private chef",
    description:
      "Behind every unforgettable yacht experience is a private chef who turns moments into masterpieces. From the gentle rhythm of the ocean to the elegance on every plate, our chef doesn't just cook—he crafts memories. Every dish is prepared with passion, precision, and a touch of luxury, making your journey not just a cruise, but a taste of perfection at sea.",
  },
  {
    id: "accountant",
    image: accountantPic,
    name: "JACOB CRISTOPHER ONYANGO",
    title: "ACCOUNTANT",
    description:
      "Our dedicated coordinator is the backbone of every successful yacht charter, ensuring that every detail is perfectly planned and executed. From the first inquiry to the final moments of the experience, they work closely with clients to understand their vision and bring it to life with precision and creativity. Whether it's organizing customized décor, scheduling entertainment, coordinating meals, or managing timelines, our coordinator ensures a smooth and stress-free journey for every guest. Their commitment to excellence and attention to detail guarantees that each yacht experience is seamless, luxurious, and truly unforgettable.",
  },
  {
    id: "videographer",
    image: videographerPic,
    name: "DIRECTOR ZOSA",
    title: "PROFETIONAL VIDEOGRAPHER AND CONTENT CREATOR",
    description:
      "Our professional videographer plays a vital role in capturing the true essence of every yacht experience, turning special moments into timeless memories. With a keen eye for detail and creativity, they focus on documenting the joy, laughter, and unique atmosphere our customers enjoy while on board. From cinematic shots of the ocean to candid moments of celebration, every clip is carefully crafted to reflect luxury, happiness, and unforgettable experiences. Their work not only showcases the beauty of our yacht services but also helps us tell authentic stories that inspire future guests to create their own memorable journeys with us.",
  },
  {
    id: "dj",
    image: djPic,
    name: "Dj Jonx",
    title: "Yachdealers Dj",
    description:
      "Our DJ is committed in creating an unforgettable atmosphere on every yacht experience, carefully curating music that matches the mood, energy, and style of each event. His target is to deliver a seamless blend of sound that keeps guests engaged, excited, and fully immersed from the moment they step on board until the end of the cruise. By reading the crowd and adapting in real-time, he ensures every guest feels the vibe, turning each journey into a lively, memorable celebration on the water.",
  },
];
