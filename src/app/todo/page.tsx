"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useCallback } from "react";
interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTodos: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Todo() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalTodos: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchTodos = useCallback(
    async (page: number = pagination.currentPage) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`/api/todos?page=${page}&limit=5`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error("Error parsing response:", err);
          data = null;
        }

        if (response.ok && data) {
          setTodos(data.todos);
          setPagination({ ...data.pagination, currentPage: page });
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.currentPage]
  ); // dependencies of fetchTodos

  useEffect(() => {
    fetchTodos(1);
  }, [fetchTodos]);
  console.log("pagination value", pagination);
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodo }),
      });

      const data = await response.json();
      console.log("Add todo response:", data);

      if (response.ok) {
        setNewTodo("");
        // After adding, fetch first page to see the new todo
        fetchTodos(1);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Toggle todo
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      const data = await response.json();
      console.log("Toggle todo response:", data);

      if (response.ok) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === id ? { ...todo, completed: !completed } : todo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Delete todo response:", data);

      if (response.ok) {
        // If we delete the last todo on a page, go to previous page
        if (todos.length === 1 && pagination.currentPage > 1) {
          fetchTodos(pagination.currentPage - 1);
        } else {
          fetchTodos(pagination.currentPage); // Refresh current page
        }
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchTodos(page);
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNext) {
      fetchTodos(pagination.currentPage + 1);
    }
  };
  console.log("value of pagination", pagination);

  console.log("value of array", [...Array(pagination.totalPages)]);
  const goToPrevPage = () => {
    if (pagination.hasPrev) {
      fetchTodos(pagination.currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-6">Todo App</h2>

      {/* Add Todo Form */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mb-6">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Label htmlFor="todo" className="sr-only">
              Todo
            </Label>
            <input
              type="text"
              id="todo"
              value={newTodo || ""}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
          </div>
          <Button
            onClick={addTodo}
            className="text-white bg-teal-500 hover:bg-teal-600 whitespace-nowrap"
          >
            Add Todo
          </Button>
        </div>
      </div>

      {/* Todo List shown here*/}
      <div className="w-full max-w-md">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">
              {pagination.currentPage > 1
                ? "No todos on this page"
                : "No todos yet. Add one above!"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`bg-white p-4 rounded shadow border flex justify-between items-center ${
                    todo.completed ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={!!todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.completed)}
                      className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <Button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm ml-2"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination Controls written here prv and next button*/}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 p-3 bg-white rounded shadow border">
                <Button
                  onClick={goToPrevPage}
                  disabled={!pagination.hasPrev}
                  className="bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300"
                  size="sm"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  {/* Page number buttons for quick navigation */}
                  <div className="flex gap-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      console.log("pageNumber", pageNumber);
                      return (
                        <Button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`w-8 h-8 text-sm ${
                            pageNumber === pagination.currentPage
                              ? "bg-teal-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          size="sm"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={goToNextPage}
                  disabled={!pagination.hasNext}
                  className="bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 text-center text-gray-600">
        <p>
          Total: {pagination.totalTodos} todo
          {pagination.totalTodos !== 1 ? "s" : ""} | Showing: {todos.length} on
          page {pagination.currentPage}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Completed: {todos.filter((t) => t.completed).length} | Pending:{" "}
          {todos.filter((t) => !t.completed).length}
        </p>
      </div>
    </div>
  );
}
