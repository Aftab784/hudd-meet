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
  // Create refs for each section only once
  const sectionRefs = useMemo(
    () =>
      sections.reduce((acc, section) => {
        acc[section.id] = React.createRef<HTMLDivElement>();
        return acc;
      }, {} as Record<string, React.RefObject<HTMLDivElement>>),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#25458E] via-[#25458E] via-35% to-[#1D074B] font-['Poppins','Montserrat','sans-serif'] text-white">
      {/* Sticky capsule navigation bar */}
      <Navigation sections={sections} sectionRefs={sectionRefs} />
      {/* Transparent logo+buttons header */}
      <Header />
      <main>
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
