"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div>
      <h1>Index page</h1>
      <button onClick={logout}>Uitloggen</button>
    </div>
  );
}
