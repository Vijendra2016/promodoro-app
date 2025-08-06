"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Timer({ activeTask }: { activeTask?: string }) {
  const totalTime = 25 * 60 * 1000; // 25 minutes in ms
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [now, setNow] = useState(Date.now());

  const getToday = () => new Date().toISOString().split("T")[0];

  // Load from localStorage on mount
  useEffect(() => {
    const savedStart = localStorage.getItem("pomodoro-startTime");
    const savedRunning = localStorage.getItem("pomodoro-isRunning");

    if (savedStart) setStartTime(parseInt(savedStart));
    if (savedRunning === "true") setIsRunning(true);

    const history = JSON.parse(localStorage.getItem("pomodoro-history") || "[]");
    const todayCount = history.filter((item: string) => item === getToday()).length;
    setDailyCount(todayCount);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (startTime) localStorage.setItem("pomodoro-startTime", startTime.toString());
    localStorage.setItem("pomodoro-isRunning", isRunning.toString());
  }, [startTime, isRunning]);

  // Update current time every second
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const elapsed = startTime ? now - startTime : 0;
  const timeLeft = Math.max(0, totalTime - elapsed);
  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  // Completion logic
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      // Play sound
      const audio = new Audio("/shri-krishna-mantra.mp3");
      audio.play().catch(() => console.warn("Autoplay blocked"));

      // Notification
      if (Notification.permission === "granted") {
        new Notification("⏰ Pomodoro Complete!", {
          body: activeTask
            ? `Finished: ${activeTask}. Take a short break!`
            : "Take a short break before your next session.",
        });
      }

      // Save to history
      const today = getToday();
      const history = JSON.parse(localStorage.getItem("pomodoro-history") || "[]");
      history.push(today);
      localStorage.setItem("pomodoro-history", JSON.stringify(history));

      const todayCount = history.filter((item: string) => item === today).length;
      setDailyCount(todayCount);

      localStorage.removeItem("pomodoro-startTime");
    }
  }, [timeLeft, isRunning, activeTask]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 mb-2">
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: "#ffffff",
            pathColor: isRunning ? "#16a34a" : "#dc2626",
            trailColor: "#d1d5db",
          })}
        />
      </div>

      {/* ✅ Display Today's Date */}
      <p className="mb-2 text-white text-sm">📅 {todayDate}</p>

      {activeTask && (
        <p className="mb-4 text-white text-lg">⏳ Working on: {activeTask}</p>
      )}

      <p className="mb-4 text-white text-xl font-semibold">
        ✅ Pomodoros completed today: {dailyCount}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            if (!isRunning) {
              setStartTime(Date.now());
            }
            setIsRunning(!isRunning);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setStartTime(null);
            localStorage.removeItem("pomodoro-startTime");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
