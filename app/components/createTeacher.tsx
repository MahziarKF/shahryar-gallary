"use client";

import { useState } from "react";

type TeacherType = {
  id: number;
  name: string;
  professions: string[];
  bio?: string;
  image_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
};

export default function CreateTeacher() {
  const [teachers, setTeachers] = useState<TeacherType[] | null>(null);

  // Change professions from string to string array
  const [formData, setFormData] = useState({
    name: "",
    professions: [] as string[],
    bio: "",
    image_url: "",
    phone: "",
  });

  // Input field for adding a profession
  const [newProfession, setNewProfession] = useState("");

  const [message, setMessage] = useState<{
    message: string;
    isOk: boolean;
  } | null>(null);

  // Handlers

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfessionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewProfession(e.target.value);
  };

  const addProfession = () => {
    const trimmed = newProfession.trim();
    if (trimmed && !formData.professions.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        professions: [...prev.professions, trimmed],
      }));
      setNewProfession("");
    }
  };

  const removeProfession = (professionToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      professions: prev.professions.filter((p) => p !== professionToRemove),
    }));
  };

  // Add profession on Enter key press
  const handleProfessionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addProfession();
    }
  };

  // Placeholder addTeacher function (implement your logic)
  const addTeacher = async () => {
    // console.log(formData);
    // TODO: Implement adding teacher logic
    const res = await fetch("/api/createTeacher", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    console.log(result);
  };

  // Placeholder deleteTeacher function (implement your logic)
  const deleteTeacher = async (id: number) => {
    // TODO: Implement deleting teacher logic
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">مدیریت معلمان</h2>

      <div className="mb-6">
        <h3 className="font-bold mb-2">افزودن معلم جدید</h3>

        <input
          name="name"
          placeholder="نام معلم"
          value={formData.name}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />

        {/* Profession input & tags */}
        <label className="block font-semibold mb-1">حرفه‌ها</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.professions.map((profession) => (
            <div
              key={profession}
              className="flex items-center bg-orange-200 text-orange-800 px-3 py-1 rounded-full"
            >
              <span>{profession}</span>
              <button
                onClick={() => removeProfession(profession)}
                className="ml-2 text-orange-600 hover:text-orange-900 font-bold"
                type="button"
                aria-label={`Remove profession ${profession}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="افزودن حرفه جدید"
          value={newProfession}
          onChange={handleProfessionInputChange}
          onKeyDown={handleProfessionKeyDown}
          className="block mb-4 p-2 border rounded w-full"
        />
        <button
          type="button"
          onClick={addProfession}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          افزودن حرفه
        </button>

        <textarea
          name="bio"
          placeholder="بیوگرافی (اختیاری)"
          value={formData.bio}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="image_url"
          placeholder="آدرس عکس (اختیاری)"
          value={formData.image_url}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="phone"
          placeholder="تلفن (اختیاری)"
          value={formData.phone}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={addTeacher}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          افزودن معلم
        </button>
        {message && (
          <p
            className={`text-md mt-2 ${
              message.isOk ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.message}
          </p>
        )}
      </div>

      <div>
        <h3 className="font-bold mb-2">لیست معلمان</h3>
        {teachers && teachers.length > 0 ? (
          <ul className="list-none space-y-3">
            {teachers.map((t) => (
              <li
                key={t.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-600">
                    حرفه‌ها: {t.professions.join(", ")}
                  </p>
                  {t.phone && <p className="text-sm">تلفن: {t.phone}</p>}
                </div>
                <button
                  onClick={() => deleteTeacher(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>هیچ معلمی وجود ندارد.</p>
        )}
      </div>
    </div>
  );
}
