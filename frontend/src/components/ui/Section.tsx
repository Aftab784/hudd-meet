import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface SectionProps {
  id: string;
  title: string;
  description: string;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ id, title, description }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null);

    // This combines the forwarded ref and local ref for animation
    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const isInView = useInView(localRef, {
      once: true,
      margin: "-100px",
    });

    const controls = useAnimation();

    useEffect(() => {
      if (isInView) controls.start("visible");
    }, [isInView, controls]);

    return (
      <motion.section
        id={id}
        ref={setRefs}
        className="py-24 px-8 md:px-24 scroll-mt-28"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
        }}
      >
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-[#e5e7eb]">{description}</p>
      </motion.section>
    );
  }
);

export default Section;
