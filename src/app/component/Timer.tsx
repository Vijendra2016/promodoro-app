"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Timer({ activeTask }: { activeTask?: string }) {
  const totalTime = 25 * 60; // 25 minutes
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  // Helper to get today's date as YYYY-MM-DD
  const getToday = () => new Date().toISOString().split("T")[0];

  // 1️⃣ Load state + daily count on mount
  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoro-timeLeft");
    const savedRunning = localStorage.getItem("pomodoro-isRunning");
    const savedTimestamp = localStorage.getItem("pomodoro-timestamp");

    if (savedTime) {
      let remaining = parseInt(savedTime, 10);
      const running = savedRunning === "true";

      // Calculate elapsed if timer was running
      if (running && savedTimestamp) {
        const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp, 10)) / 1000);
        remaining -= elapsed;
        if (remaining < 0) remaining = 0;
      }

      setTimeLeft(remaining || totalTime);
      setIsRunning(running && remaining > 0);
    }

    // Load today's Pomodoro count
    const history = JSON.parse(localStorage.getItem("pomodoro-history") || "[]");
    const todayCount = history.filter((item: string) => item === getToday()).length;
    setDailyCount(todayCount);
  }, []);

  // 2️⃣ Save timer state
  useEffect(() => {
    localStorage.setItem("pomodoro-timeLeft", timeLeft.toString());
    localStorage.setItem("pomodoro-isRunning", isRunning.toString());
    if (isRunning) {
      localStorage.setItem("pomodoro-timestamp", Date.now().toString());
    }
  }, [timeLeft, isRunning]);

  // 3️⃣ Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // 4️⃣ Completion logic with history tracking
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      // Play sound
      const audio = new Audio("/shri-krishna-mantra.mp3");
      audio.play().catch(() => console.warn("Autoplay blocked"));

      // Show notification
      if (Notification.permission === "granted") {
        new Notification("⏰ Pomodoro Complete!", {
          body: activeTask
            ? `Finished: ${activeTask}. Take a short break!`
            : "Take a short break before your next session.",
         
        });
      }

      // Save to daily history
      const today = getToday();
      const history = JSON.parse(localStorage.getItem("pomodoro-history") || "[]");
      history.push(today);
      localStorage.setItem("pomodoro-history", JSON.stringify(history));

      // Update daily count
      const todayCount = history.filter((item: string) => item === today).length;
      setDailyCount(todayCount);
    }
  }, [timeLeft, isRunning, activeTask]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 mb-6">
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: "#ffff",
            pathColor: isRunning ? "#16a34a" : "#dc2626",
            trailColor: "#d1d5db",
          })}
        />
      </div>

      {activeTask && <p className="mb-4  text-white text-lg">⏳ Working on: {activeTask}</p>}

      <p className="mb-4  text-white text-xl font-semibold">
        ✅ Pomodoros completed today: {dailyCount}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(totalTime);
            localStorage.removeItem("pomodoro-timestamp");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
