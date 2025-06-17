"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import heroBannerGuitarImage from "@/public/heroSectionGuitar.jpg";
import { Button } from "../productComponents/button";

const notes = ["♫", "♬", "♪", "♩", "♭"];

const HeroBanner = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-red-500 text-white flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl mb-8 shadow-lg overflow-hidden"
    >
      {/* Text Section */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 mb-6 md:mb-0 md:pr-6"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">گیتار های کلاسیک</h1>
        <Button
          variant="custom"
          className="bg-white text-black text-xl px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
        >
          مشاهده
        </Button>
      </motion.div>

      {/* Image Section */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="flex-1 relative aspect-[5/3] max-w-md md:max-w-lg lg:max-w-xl"
      >
        <Image
          src={heroBannerGuitarImage}
          alt="Guitar"
          fill
          className="rounded-2xl object-cover shadow-xl hover:scale-105 transition-transform duration-500 ease-in-out"
          priority
        />

        {/* Notes Animation */}
        <AnimatePresence>
          {isHovered &&
            notes.map((note, index) => (
              <motion.span
                key={note + index}
                initial={{ x: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: -150 - index * 50, // Fly further left
                  opacity: 0, // Fully fade out
                  scale: [1, 1.3, 1], // Optional slight pulse
                }}
                transition={{
                  delay: index * 0.2, // Sequential launch
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                exit={{ opacity: 0, x: 0, transition: { duration: 0.5 } }}
                className="absolute text-3xl select-none text-purple-400 pointer-events-none"
                style={{
                  top: `${30 + index * 40}px`, // Spread vertically
                  left: "-30px", // Start OUTSIDE the image to the left
                }}
              >
                {note}
              </motion.span>
            ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default HeroBanner;
