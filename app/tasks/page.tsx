"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/task.service";

interface Task {
  id: number;
  task: string;
  user_id: number;
}

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  // Get Tasks
  const handleGetTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const data = await getTasks();

      setTasks(data);
    } catch (error: any) {
      console.error("GET TASKS ERROR:", error);

      if (error.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.trim()) {
      setMessage("Task is required");
      return;
    }

    try {
      setCreating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const newTask = await createTask(task.trim());

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);

      setTask("");
      setMessage("Task created successfully!");
    } catch (error: any) {
      console.error("CREATE TASK ERROR:", error);

      if (error.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setMessage(error.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  // Update Task
  const handleUpdateTask = async (id: number) => {
    if (!editingTask.trim()) {
      setMessage("Task is required");
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const updatedTask = await updateTask(
        id,
        editingTask.trim()
      );

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );

      setEditingId(null);
      setEditingTask("");
      setMessage("Task updated successfully!");
    } catch (error: any) {
      console.error("UPDATE TASK ERROR:", error);

      if (error.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setMessage(error.message || "Something went wrong");
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      await deleteTask(id);

      setTasks((previousTasks) =>
        previousTasks.filter((item) => item.id !== id)
      );

      setMessage("Task deleted successfully!");
    } catch (error: any) {
      console.error("DELETE TASK ERROR:", error);

      if (error.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setMessage(error.message || "Something went wrong");
    }
  };

  // Start Editing
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTask(task.task);
    setMessage("");
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingTask("");
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Loading tasks...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              My Tasks
            </h1>

            <p className="mt-2 text-slate-400">
              Create and manage your tasks
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {/* Create Task */}
        <form
          onSubmit={handleCreateTask}
          className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <label
            htmlFor="task"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            New Task
          </label>

          <div className="flex gap-3">
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {creating ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <div className="mb-5 flex items-center justify-between rounded-lg bg-blue-500/10 px-4 py-3 text-sm text-blue-400">
            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="ml-4 text-lg font-bold text-blue-400 hover:text-white"
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        {/* Tasks */}
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No tasks found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                {editingId === item.id ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editingTask}
                      onChange={(e) =>
                        setEditingTask(e.target.value)
                      }
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                    />

                    <button
                      onClick={() =>
                        handleUpdateTask(item.id)
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEditing}
                      className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white">
                        {item.task}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Task #{item.id}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditing(item)
                        }
                        className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteTask(item.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
