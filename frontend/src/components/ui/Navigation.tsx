import React, { useEffect, useState } from "react";

type NavigationProps = {
  sections: { id: string; label: string }[];
  sectionRefs: Record<string, React.RefObject<HTMLDivElement>>;
};

const Navigation: React.FC<NavigationProps> = ({ sections, sectionRefs }) => {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const ref = sectionRefs[section.id];
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, sectionRefs]);

  const scrollToSection = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-4 z-30 flex justify-center">
      <ul className="flex gap-2 md:gap-6 py-2 px-4 rounded-full bg-white/10 border border-white/20 shadow-lg backdrop-blur-md">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                active === section.id
                  ? "bg-[#2b3a67] text-[#ED467E] shadow"
                  : "hover:bg-[#2b3a67]/60 hover:text-[#ED467E]"
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

