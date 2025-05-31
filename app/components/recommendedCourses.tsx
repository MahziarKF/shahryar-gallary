export default function CourseList() {
  const courses = [
    {
      title: "آموزش گیتار از صفر",
      description: "یادگیری گام به گام گیتار، مناسب برای تمام سنین",
    },
    {
      title: "تئوری موسیقی کاربردی",
      description: "شناخت نُت‌ها، گام‌ها، هارمونی و نحوه استفاده در اجرا",
    },
    {
      title: "آموزش پیانو کلاسیک",
      description: "دوره‌ی تخصصی نواختن پیانو با متد استاندارد جهانی",
    },
  ];

  return (
    <section className="w-full px-10 py-16 -[#1A120B] text-white space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-amber-300 text-right">
        دوره‌های پیشنهادی
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-[#2C1B0E] hover:-translate-y-1 transition-transform duration-300 hover:cursor-pointer transform p-6 rounded-2xl font-semibold text-center shadow-lg hover:bg-amber-900 transition-colors duration-300"
          >
            <h3 className="text-xl font-semibold text-amber-200 mb-2">
              {course.title}
            </h3>
            <p className="text-amber-50 text-sm">{course.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
