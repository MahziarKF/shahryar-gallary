"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (mode === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("رمز عبور و تکرار آن مطابقت ندارند.");
        return;
      }
      if (!form.username || !form.email || !form.password) {
        setError("لطفا همه فیلدها را پر کنید.");
        return;
      }
    } else {
      if (!form.username || !form.password) {
        setError("نام کاربری و رمز عبور الزامی است.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/newUser" : "/api/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      console.log(
        "sent data",
        JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      );
      if (res.ok) {
        setSuccess(true);
        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        router.push("/dashboard");
      } else {
        const text = await res.text();
        setError(text || "خطایی رخ داده است.");
      }
    } catch {
      setError("خطای شبکه.");
    } finally {
      setLoading(false);
    }
  }

  return !isOpen ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {mode === "signup" ? "فرم ثبت‌نام" : "ورود به حساب"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="نام کاربری"
            value={form.username}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />

          {mode === "signup" && (
            <input
              type="email"
              name="email"
              placeholder="ایمیل"
              value={form.email}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />

          {mode === "signup" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="تکرار رمز عبور"
              value={form.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:cursor-pointer text-white py-2 rounded-md hover:bg-orange-500 transition disabled:opacity-50"
          >
            {loading
              ? "در حال ارسال..."
              : mode === "signup"
              ? "ثبت‌نام"
              : "ورود"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-600 text-center">
            {mode === "signup"
              ? "ثبت‌نام با موفقیت انجام شد!"
              : "با موفقیت وارد شدید!"}
          </p>
        )}

        <p className="mt-4 text-md text-center text-gray-700">
          {mode === "signup" ? "حساب کاربری دارید؟" : "حساب ندارید؟"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "signup" ? "login" : "signup"))
            }
            className="text-orange-600 hover:text-orange-700 hover:underline hover:cursor-pointer"
          >
            {mode === "signup" ? "ورود به حساب" : "ثبت‌نام"}
          </button>
        </p>
      </div>
    </div>
  );
}
