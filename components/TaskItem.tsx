"use client";

import { deleteTask, toggleTaskComplete } from "@/app/actions";
import { useState } from "react";
import TaskForm from "./TaskForm";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskItemProps = {
  task: Task;
};

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle() {
    await toggleTaskComplete(task.id);
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      await deleteTask(task.id);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Task</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <TaskForm task={task} onSuccess={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-opacity ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                priorityColors[task.priority as keyof typeof priorityColors]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
          )}

          <p className="text-xs text-gray-400">
            Created: {new Date(task.createdAt).toISOString().split("T")[0]}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
