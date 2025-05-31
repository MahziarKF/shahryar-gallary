"use client";
interface Props {
  username: string;
}

export default function Settings({ username }: Props) {
  const handleLogOut = async () => {
    await fetch("/api/logout");
    window.location.href = "/";
  };
  return (
    <>
      <button
        onClick={handleLogOut}
        className="h-2/3 hover:bg-[#C2410C] bg-[#EA580C] hover:cursor-pointer  rounded-lg text-xl font-bold text-white px-2 py-1"
      >
        log out
      </button>
    </>
  );
}
