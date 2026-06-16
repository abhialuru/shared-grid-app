"use client";
import JoinGame from "@/components/JoinGame";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && user !== "undefined") {
      router.push("/game");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return null;

  return (
    <main>
      <JoinGame />
    </main>
  );
}
