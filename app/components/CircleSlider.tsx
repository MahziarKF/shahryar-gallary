"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const instruments = [
  { name: "guitar", src: "https://img.icons8.com/ios-filled/100/guitar.png" },
  { name: "piano", src: "https://img.icons8.com/ios-filled/100/piano.png" },
  { name: "violin", src: "https://img.icons8.com/ios-filled/100/violin.png" },
  { name: "drums", src: "https://img.icons8.com/ios-filled/100/drum-set.png" },
  {
    name: "saxophone",
    src: "https://img.icons8.com/ios-filled/100/saxophone.png",
  },
  { name: "trumpet", src: "https://img.icons8.com/ios-filled/100/trumpet.png" },
  { name: "flute", src: "https://img.icons8.com/ios-filled/100/flute.png" },
  {
    name: "accordion",
    src: "https://img.icons8.com/ios-filled/100/accordion.png",
  },
  { name: "banjo", src: "https://img.icons8.com/ios-filled/100/banjo.png" },
  {
    name: "harmonica",
    src: "https://img.icons8.com/ios-filled/100/harmonica.png",
  },
  { name: "maracas", src: "https://img.icons8.com/ios-filled/100/maracas.png" },
  {
    name: "xylophone",
    src: "https://img.icons8.com/ios-filled/100/xylophone.png",
  },
  { name: "harp", src: "https://img.icons8.com/ios-filled/100/harp.png" },
  { name: "cello", src: "https://img.icons8.com/ios-filled/100/cello.png" },
  {
    name: "clarinet",
    src: "https://img.icons8.com/ios-filled/100/clarinet.png",
  },
  {
    name: "trombone",
    src: "https://img.icons8.com/ios-filled/100/trombone.png",
  },
];

const CircleSlider = () => {
  const [page, setPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(instruments.length / itemsPerPage);

  const startAutoSlide = () => {
    // Clear existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Start a new one
    intervalRef.current = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 3000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPages]);

  const handleDotClick = (index: number) => {
    setPage(index);
    startAutoSlide(); // Reset timer when user manually changes page
  };

  const currentItems = instruments.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-6"
        >
          {currentItems.map((instrument, index) => (
            <Link key={index} href={`/${instrument.name}`}>
              <div className="w-24 h-24 rounded-full bg-gray-200 shadow-md flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src={instrument.src}
                  alt={instrument.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full ${
              page === i ? "bg-black" : "bg-gray-400"
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default CircleSlider;
