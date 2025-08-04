"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsPage() {
  // Example static data (replace with LocalStorage history later)
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Pomodoros Completed",
        data: [3, 4, 2, 5, 1, 0, 0],
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Weekly Pomodoro Stats</h1>
      <div className="w-full max-w-xl">
        <Bar data={data} />
      </div>
    </div>
  );
}
