"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGrid } from "@/hooks/useGrid";

export interface User {
  id: string;
  username: string;
  color: string;
}

export default function GameBoard() {
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data || data === "undefined") {
      router.push("/");
      return;
    }
    setUserData(JSON.parse(data));
  }, []);

  if (!userData) return null;

  return <Game user={userData} />;
}

function Game({ user }: { user: User }) {
  const {
    cells,
    isLoading,
    onlineCount,
    myCells,
    claimCell,
    isOnCooldown,
    cooldownUntil,
    leaderboard,
  } = useGrid(user);

  const [cooldownDisplay, setCooldownDisplay] = useState("");

  useEffect(() => {
    if (!isOnCooldown || !cooldownUntil) {
      setCooldownDisplay("");
      return;
    }
    const interval = setInterval(() => {
      const remaining = (cooldownUntil - Date.now()) / 1000;
      if (remaining <= 0) {
        setCooldownDisplay("");
        clearInterval(interval);
      } else {
        setCooldownDisplay(remaining.toFixed(1) + "s");
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isOnCooldown, cooldownUntil]);

  return (
    <main className="w-full h-screen flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg border border-zinc-200"
            style={{ backgroundColor: user.color }}
          />
          <div>
            <p className="text-sm font-medium text-zinc-900">{user.username}</p>
            <p className="text-xs text-zinc-400">Your territory</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-900">{myCells}</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400">
              Cells
            </p>
          </div>
          <div className="w-px h-8 bg-zinc-200" />
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-900">{onlineCount}</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400">
              Online
            </p>
          </div>
          <div className="w-px h-8 bg-zinc-200" />
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5">
            <span className="text-xs text-zinc-500">Cooldown</span>
            <span
              className={`text-xs font-medium ${isOnCooldown ? "text-red-500" : "text-green-600"}`}
            >
              {isOnCooldown ? cooldownDisplay : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="w-full h-full flex">
        {/* Grid */}
        <div className="w-[80%] h-full overflow-y-auto py-10 flex justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <p className="text-zinc-400 text-sm">Loading grid...</p>
            </div>
          ) : (
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: "repeat(30, 22px)" }}
            >
              {cells.map((cell) => (
                <div
                  key={cell.id}
                  onClick={() => claimCell(cell.id)}
                  title={cell.ownerName ?? "Unclaimed"}
                  className={`
                    w-[22px] h-[22px] rounded-[3px] border border-black/5
                    cursor-pointer hover:scale-125 hover:z-10 relative
                    transition-transform duration-100
                    ${isOnCooldown ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  style={{
                    backgroundColor: cell.ownerColor ?? "#e8e8e6",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[20%] border-l border-zinc-200 flex flex-col bg-white">
          <div className="px-4 py-3 border-b border-zinc-200">
            <p className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Leaderboard
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.username}
                className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-50"
              >
                <span className="text-xs text-zinc-400 w-4">{index + 1}</span>
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-zinc-700 flex-1 truncate">
                  {entry.username}
                  {entry.username === user.username ? " (you)" : ""}
                </span>
                <span className="text-xs text-zinc-400">{entry.cells}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
