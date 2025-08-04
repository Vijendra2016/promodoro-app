"use client";

import { useState } from "react";
import Timer from "./component/Timer";
import TaskList from "./utils/TaskList";

export default function Home() {
  const [activeTask, setActiveTask] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-10">Pomodoro App</h1>
      <Timer activeTask={activeTask} />
      <TaskList setActiveTask={setActiveTask} /> {/* ✅ Pass prop here */}
    </div>
  );
}
