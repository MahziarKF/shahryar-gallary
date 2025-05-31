async function enrollUserToCourse(userId: number, courseId: number) {
  const res = await fetch("/api/enrollUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    console.error("Failed to enroll user:", errorMsg);
    return null;
  }

  const data = await res.json();
  return data; // { message: "User enrolled successfully" }
}

// Usage:
enrollUserToCourse(1, 10).then((response) => {
  if (response) {
    console.log(response.message);
  }
});
