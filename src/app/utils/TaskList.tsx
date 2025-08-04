"use client";

import { useState, useEffect } from "react";

type Task = { id: number; title: string; completed: boolean };

export default function TaskList({ setActiveTask }: { setActiveTask: (task: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white  mb-4">Tasks</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1  text-white border border-white px-2 py-1 rounded"
          placeholder="New task..."
        />
        <button onClick={addTask} className="px-4 py-1 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2 text-white">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-2 border border-white rounded flex justify-between items-center ${
              task.completed ? "line-through  text-white" : ""
            }`}
          >
            <span onClick={() => toggleTask(task.id)} className="cursor-pointer flex-1">
              {task.title}
            </span>
            <button
              className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded"
              onClick={() => setActiveTask(task.title)}
            >
              Focus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
