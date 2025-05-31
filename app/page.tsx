import Header from "./components/header";
import Link from "next/link";
import MainMiddle from "./components/mainMiddle";
import MainTop from "./components/mainTop";
import MainDown from "./components/mainDown";
import { ArrowRight } from "lucide-react";
import CircleSlider from "./components/CircleSlider";
import SignUpSuggestion from "./components/signUpSuggestion";
import { getUser } from "@/lib/auth";
import HeaderWrapper from "./components/headerWraper";

export default async function Page() {
  const user: any = await getUser();
  return (
    <>
      <HeaderWrapper></HeaderWrapper>
      <div className="overflow-x-hidden">
        {/* Section 1 */}
        <section className="w-screen h-screen bg-[#FFF7E6] flex flex-col shadow-2xl">
          {/* Use flex-1 so MainTop takes remaining height without breaking layout */}
          <div className="flex-1 overflow-y-hidden">
            <MainTop />
          </div>
        </section>

        {/* Section 2 */}

        <section className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-between gap-y-25 pt-15">
          <MainMiddle />
        </section>
        <div className="w-full text-center"></div>

        <section className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-between gap-y-25 pt-15">
          <Link href={"/"}>
            <button className="group inline-flex items-center gap-2 bg-[#EA580C] text-white font-semibold text-xl px-8 py-4 rounded-2xl shadow-md hover:bg-white hover:text-[#EA580C] hover:ring-2 hover:ring-[#EA580C] transition-all duration-300 ease-in-out">
              مشاهده دوره ها
              <ArrowRight className="w-6 h-6 mt-2 transition-transform duration-300 transform group-hover:translate-x-2" />
            </button>
          </Link>
          <hr className="w-2/3 border-t-2 border-gray-400 my-8" />
          <MainDown></MainDown>
        </section>
        <section className="w-screen min-h-screen bg-gray-200">
          {" "}
          <SignUpSuggestion></SignUpSuggestion>
        </section>
      </div>
    </>
  );
}
