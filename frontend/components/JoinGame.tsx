"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function JoinGame() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleJoinGame(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/grid/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data.data));
      router.push("/game");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative w-full h-screen flex justify-center items-center">
      <div className="absolute inset-0 grid-bg pointer-events-none z-10" />
      <div className="relative z-10 flex flex-col items-center gap-10 bg-white border border-zinc-200 rounded-2xl p-10 shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight ">
          Capture the <span className="text-blue-400">Grid</span>
        </h1>

        <form onSubmit={handleJoinGame} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null); // clear error as user types
              }}
              placeholder="Enter a username"
              minLength={3}
              maxLength={20}
              disabled={isLoading}
              required
              className="p-3 border border-zinc-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-400 text-xs pl-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full bg-blue-500 hover:bg-blue-600 text-white font-medium
              py-3 rounded-lg transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95 cursor-pointer    
            "
          >
            {isLoading ? "Checking..." : "Join the Game"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default JoinGame;
