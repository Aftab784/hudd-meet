import React, { useMemo } from "react";
import Header from "@/components/ui/Header";
import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/ui/Hero";
import Section from "@/components/ui/Section";

const sections = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
  { id: "guest", label: "Join as Guest" },
];

export default function LandingPage() {
  const sectionRefs = useMemo(
    () =>
      sections.reduce((acc, section) => {
        acc[section.id] = React.createRef<HTMLDivElement>();
        return acc;
      }, {} as Record<string, React.RefObject<HTMLDivElement | null>>),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#25458E] to-[#1D074B] font-['Poppins','Montserrat','sans-serif'] text-white">
      {/* Stacked header layers */}
      <div className="relative h-[120px] w-full">
        <Header />
      </div>
      {/* Main content with top padding so it's not hidden */}
      <main className="pt-[64px]">
        <div ref={sectionRefs["home"]}>
          <Hero />
        </div>
        <Section
          id="features"
          ref={sectionRefs["features"]}
          title="Features"
          description="Explore the powerful features of HuddMeet."
        />
        <Section
          id="faqs"
          ref={sectionRefs["faqs"]}
          title="FAQs"
          description="Frequently Asked Questions"
        />
        <Section
          id="contact"
          ref={sectionRefs["contact"]}
          title="Contact"
          description="Get in touch with us!"
        />
        <Section
          id="guest"
          ref={sectionRefs["guest"]}
          title="Join as Guest"
          description="Try HuddMeet as a guest user."
        />
      </main>
    </div>
  );
}
