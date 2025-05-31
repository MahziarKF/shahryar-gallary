import TeacherCard from "./teacherCard";
import CircleSlider from "./CircleSlider";
export default function MainMiddle() {
  return (
    <>
      <div className="w-auto">
        <h1 className="text-7xl font-semibold">محبوب ترین دوره ها</h1>
      </div>
      <CircleSlider></CircleSlider>
      {/* this is a placeholder for top 10 teachers will soon be developed with db interactions */}{" "}
      <hr className="w-2/3 border-t-2 border-gray-400 my-8" />
      <div className="w-auto">
        <h1 className="text-7xl font-semibold">استاید مفتخر</h1>
      </div>
      <TeacherCard />
    </>
  );
}
