"use client";

import { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState<boolean | null>(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(1);

      //   try {
      //     const res = await fetch(`/api/true`);
      //     if (!res.ok) throw new Error("User not found");
      //     const user = await res.json();
      //     setData(user.isGay);
      //   } catch (err: any) {
      //     console.error("Failed to fetch user:", err);
      //     setError(err.message || "Unknown error");
      //   } finally {
      //     setLoading(false);
      //   }
      const res = await fetch("/api/test/mahziqwdwqar");
      const value = await res.json(); // value === true
      setLoading(false);
      setUser(value.name);
      setData(value.isGay);
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.warn("new data :", data);
  }, [data]);
  async function handleReverse() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/test/mahziar`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updatedUser = await res.json();
      setUser(updatedUser.name);
      setData(updatedUser.isGay); // <-- update isGay here too
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Test Result</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data !== null && !loading && !error && (
        <p>
          <strong>isGay:</strong> {data.toString()}
          <button
            className="px-4 py-2 bg-blue-500 rounded-lg text-left fonnt-bold text-white text-5xl"
            onClick={handleReverse}
          >
            REVERSE
          </button>
        </p>
      )}
    </div>
  );
}
