"use client"; // if you're using Next.js with app directory

import { motion } from "framer-motion";

export default function TeacherCard() {
  const ostads = [
    {
      name: "ابراهیمی",
      image: "",
      desc: "دارای 10 دانشجو. مهارت بالا",
      price: 750,
    },
    { name: "کاظمی", image: "", desc: "استاد تخصصی پیانو کلاسیک", price: 900 },
    { name: "فرجی", image: "", desc: "متخصص گیتار فلامنکو", price: 850 },
    {
      name: "میرزایی",
      image: "",
      desc: "تجربه بالا در آموزش موسیقی کودک",
      price: 700,
    },
    {
      name: "موسوی",
      image: "",
      desc: "آموزش ویالون با متد اروپایی",
      price: 950,
    },
    {
      name: "موسوی",
      image: "",
      desc: "آموزش ویالون با متد اروپایی",
      price: 950,
    },
  ];

  return (
    <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-10 py-8">
      {ostads.map((o, index) => (
        <motion.div
          key={index}
          className="ring-2 space-y-5 h- transition-transform duration-300 hover:cursor-pointer hover:-translate-y-2 ring-[#2C1B0E]  rounded-xl px-5 py-6 text-center font-bold flex flex-col items-center justify-around bg-white shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          viewport={{ once: true }}
        >
          <div className="w-3/5 h-1/2 aspect-square rounded-xl ring-2 ring-blue-400 flex items-center justify-center text-sm text-gray-600">
            عکس
          </div>

          <p className="text-4xl font-semibold text-amber-600">{o.name}</p>
          <p className="text-2xl font-normal text-gray-600">{o.desc}</p>
          <p className="text-2xl mt-2"> هزار تومان {o.price}</p>
        </motion.div>
      ))}
    </div>
  );
}
