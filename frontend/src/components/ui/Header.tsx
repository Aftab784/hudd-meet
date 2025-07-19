import React, { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const navItems = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
  { id: "guest", label: "Join as Guest" },
];

interface HeaderProps {
  sectionRefs?: Record<string, React.RefObject<HTMLDivElement>>;
}

const Header: React.FC<HeaderProps> = ({ sectionRefs }) => {
  const [active, setActive] = useState("home");

  // Scroll spy effect
  useEffect(() => {
    if (!sectionRefs) return;
    const handleScroll = () => {
      for (const item of navItems) {
        const ref = sectionRefs[item.id];
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  const scrollToSection = (id: string) => {
    sectionRefs?.[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-[#D9D9D9]/4">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="HuddMeet Logo" className="w-10 h-10" />
        <span className="font-germania text-2xl tracking-wide text-white">
          HuddMeet
        </span>
      </div>

      {/* Capsule Navigation */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex gap-2 md:gap-6 px-4 py-2 sticky rounded-full bg-white/10 border border-white/20 shadow-lg backdrop-blur-md">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                  active === item.id
                    ? "bg-[#ED467E] text-white shadow"
                    : "text-white hover:bg-[#ED467E]/80 hover:text-white"
                }`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Register/Login Buttons */}
      <div className="flex gap-3">
        <button className="rounded-full bg-[#ED467E] text-white px-6 py-2 font-semibold shadow transition hover:bg-[#d12d6a]">
          Register
        </button>
        <button className="rounded-full bg-[#D9D9D9] text-[#25458E] px-6 py-2 font-semibold shadow transition hover:bg-[#ED467E] hover:text-white">
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
