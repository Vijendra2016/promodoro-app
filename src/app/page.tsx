"use client";

import { useState } from "react";
import Timer from "./component/Timer";
import TaskList from "./utils/TaskList";
import Image from "next/image";
export default function Home() {
  const [activeTask, setActiveTask] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <h1 className="text-3xl text-white font-bold mb-10">Vijendra pomodoro app</h1>
      <Timer activeTask={activeTask} />
      <TaskList setActiveTask={setActiveTask} /> {/* ✅ Pass prop here */}
    
    <div className="pt-20">

      <Image
          className="dark:invert"
          src="https://cdn.prod.website-files.com/67860b0fa33a316e96823102/6890a2097991bbfd8884c42e_marcus-aurelius-8062793_1280.jpg"
          alt="Next.js logo"
          width={1200}
          height={800}
          priority
        />
        </div>
    </div>
  );
}
