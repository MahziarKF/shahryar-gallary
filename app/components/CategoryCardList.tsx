// components/CategoryCardList.tsx
type Category = {
  id: number;
  name: string;
};

export default function CategoryCardList({
  categories,
  handleDeleteCategory,
}: {
  categories: Category[];
  handleDeleteCategory: (id: number) => void;
}) {
  console.log(categories);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="p-3 border rounded shadow bg-gray-50 text-center flex flex-col items-center"
        >
          <span className="text-lg font-medium">{cat.name}</span>
          <button
            onClick={() => handleDeleteCategory(cat.id)}
            className="w-full bg-red-600 text-white rounded py-1 px-3 hover:bg-red-700 transition max-w-[120px] text-sm text-center mt-2"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
