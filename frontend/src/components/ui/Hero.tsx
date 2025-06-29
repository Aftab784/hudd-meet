import React from "react";
import hero from "@/assets/hero-img.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import type { Variants, Transition } from "framer-motion";

const textVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: "spring" as const },
  }),
};

const Hero: React.FC = () => (
  <section className="flex flex-col md:flex-row items-center justify-between px-12 py-16">
    {/* Left: Text */}
    <div className="max-w-xl">
      <motion.h1
        className="text-5xl font-bold leading-tight mb-6"
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={0}
      >
        <span className="text-[#ED467E]">Meet</span> like you’re in
        <br />
        the <span className="text-[#ED467E]">Same room</span>
      </motion.h1>
      <motion.p
        className="text-lg text-[#e5e7eb] mb-8"
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={1}
      >
        Crystal-clear video, real-time voice, and features that make distance disappear
      </motion.p>
      <motion.div
        className="flex gap-4"
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={2}
      >
        <Button color="grey" size="lg" className="transition-all duration-200">
          Get started free
        </Button>
        <Button color="primary" size="lg" className="transition-all duration-200">
          Try Demo
        </Button>
      </motion.div>
    </div>
    {/* Right: Hero Image */}
    <motion.div
      className="mt-10 md:mt-0"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
    >
      <img src={hero} alt="Hero" width={420} height={320} />
    </motion.div>
  </section>
);

export default Hero;