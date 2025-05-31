export default function ReviewPreview() {
  const reviews = [
    {
      name: "مهدی ناظری",
      rating: 5,
      content:
        "دوره‌های آموزشی تنوع خوبی دارن و محتواها به‌روز هستن. تجهیزات کلاس مثل سیستم‌های صوتی و لپ‌تاپ‌های مدرن خیلی به یادگیری کمک می‌کنن. فقط به نظرم زمان‌بندی بعضی جلسات می‌تونست بهتر مدیریت بشه",
    },
    {
      name: "مریم منتظری",
      rating: 4,
      content:
        "کلاس‌های این مجموعه بسیار منظم و باکیفیت برگزار می‌شوند. استفاده از ابزارهای آموزشی پیشرفته مثل ویدئو پروژکتور و تخته‌های دیجیتال باعث شده یادگیری برای من خیلی راحت‌تر و لذت‌بخش‌تر بشه. اساتید هم کاملاً مسلط و صبور هستند.",
    },
  ];

  const StarRating = ({ rating = 5 }) => (
    <div className="flex space-x-1 text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-30 items-center justify-center p-6">
      <h1 className="text-center font-bold text-7xl">نظرات هنرجویان</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-7xl w-full">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2">{review.name}</h3>
            <StarRating rating={review.rating} />
            <p className="mt-4 text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
