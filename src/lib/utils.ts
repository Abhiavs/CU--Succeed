import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getScoreGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) return { grade: "A+", label: "Exceptional", color: "text-blue-400" };
  if (score >= 80) return { grade: "A", label: "Advanced", color: "text-indigo-500" };
  if (score >= 70) return { grade: "B+", label: "Proficient", color: "text-cyan-400" };
  if (score >= 60) return { grade: "B", label: "Competent", color: "text-blue-400" };
  if (score >= 50) return { grade: "C", label: "Developing", color: "text-amber-400" };
  return { grade: "D", label: "Foundational", color: "text-rose-400" };
}
