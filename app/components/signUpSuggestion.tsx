"use client";
import Image from "next/image";
import { useState } from "react";
import pic from "../../public/art2.png";
import SignUpModal from "./SignUpModal";
export default function SignUpSuggestion() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-screen bg-stone-100 grid grid-cols-5 grid-rows-2">
      {/* Left Side: Image */}
      <div className="col-span-2 row-span-2 flex items-center justify-center bg-white">
        <div className="w-4/5 h-4/5 relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={pic}
            alt="Musical Instruments"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Side: Text + CTA */}
      <div className="col-span-3 row-span-2 flex flex-col text-right justify-center px-10">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">هنوز شک داری؟</h2>
        <p className="text-lg text-gray-700 leading-loose mb-8">
          اگر تا الان همراه ما بودی، حتما متوجه شدی که مجموعه ما تنها یک
          آموزشگاه ساده نیست، بلکه فضایی‌ست برای رشد، خلاقیت و تجربه‌ی واقعی
          موسیقی. ما با بهره‌گیری از مدرن‌ترین روش‌های آموزشی، برنامه‌ریزی دقیق
          و اساتیدی که عاشق آموزش هستند، محیطی پویا و الهام‌بخش فراهم کرده‌ایم.
          در این مسیر، نه تنها مهارت‌های فنی‌ات تقویت می‌شوند، بلکه با جامعه‌ای
          از هنرجویان پرانرژی و حرفه‌ای هم‌مسیر می‌شوی. حالا وقتشه که تو هم به
          این مسیر پرهیجان بپیوندی و رؤیای موسیقایی‌ات رو به واقعیت تبدیل کنی!
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="self-end w-max inline-flex items-center justify-center bg-orange-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-orange-600 hover:ring-2 hover:ring-orange-600 transition-all duration-300"
        >
          ثبت‌نام کن و شروع کن!
        </button>
      </div>

      {/* Modal */}
      <SignUpModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
