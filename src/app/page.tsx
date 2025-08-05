"use client";

import { useState } from "react";
import Timer from "./component/Timer";
import TaskList from "./utils/TaskList";
import Image from "next/image";
export default function Home() {
  const [activeTask, setActiveTask] = useState<string | undefined>(undefined);

  return (
   <div className="min-h-screen bg-black flex items-center justify-center py-10">
  <div className="grid grid-cols-12 gap-6 w-full max-w-7xl px-4">

    {/* Left Column - Quote (2/12) */}
    <div className="col-span-2 flex justify-center items-center">
      <div className="pt-20 text-center">
        <h1 className="text-xl text-white font-[family-name:var(--font-geist-mono)] font-light mb-10">
          “You have power over your mind — not outside events. Realize this, and you will find strength.”
          <br />
          <span className="text-base">from Meditations, Book 12</span>
        </h1>


         <h2 className="text-sm text-white font-[family-name:var(--font-geist-mono)] font-light mb-10">Here’s the basic formula: After [CURRENT HABIT], I will [TRACK MY HABIT].</h2>
      </div>
    </div>

    {/* Center Column - Pomodoro App (8/12) */}
    <div className="col-span-8 flex flex-col items-center">
      <h1 className="text-3xl text-white font-[family-name:var(--font-geist-mono)] font-light mb-10">
        Vijendra pomodoro app
      </h1>

      <Timer activeTask={activeTask} />
      <TaskList setActiveTask={setActiveTask} /> {/* ✅ Pass prop here */}
    </div>

    {/* Right Column - Image (2/12) */}
    <div className="col-span-2 flex justify-center items-center">
      <Image
        className="dark:invert"
        src="https://cdn.prod.website-files.com/67860b0fa33a316e96823102/6890aafcd641b90f25c7f9d2_portrait-stoic-marcus-aurelius-black-white-film-grain-highly-detailed-masterpiece_1097265-29410.png"
        alt="Marcus Aurelius"
        width={300}
        height={300}
        priority
      />
    </div>

  </div>
 
</div>



  );
}
