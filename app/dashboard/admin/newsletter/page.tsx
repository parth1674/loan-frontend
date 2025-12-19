"use client";

import { useEffect, useState } from "react";
import { getSubscribers, deleteSubscriber } from "@/api/newsletter";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load subscribers on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const res = await getSubscribers();  // Token will attach here

        setSubs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);




  async function handleDelete(id: string) {
    if (!window.confirm("Delete this subscriber?")) return;

    try {
      setDeletingId(id);
      await deleteSubscriber(id);
      setSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  function exportCSV() {
    if (!subs.length) {
      alert("No subscribers to export");
      return;
    }

    const header = "id,email,createdAt\n";
    const rows = subs
      .map(
        (s) =>
          `${s.id},"${s.email.replace(/"/g, '""')}",${new Date(
            s.createdAt
          ).toISOString()}`
      )
      .join("\n");

    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Newsletter Subscribers
          </h1>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {!loading && !subs.length && (
          <p className="text-gray-500">No subscribers found.</p>
        )}

        {!loading && subs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2 text-left">ID</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Subscribed At</th>
                  <th className="border px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border px-3 py-2">{s.id}</td>
                    <td className="border px-3 py-2">{s.email}</td>
                    <td className="border px-3 py-2">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:bg-red-400"
                      >
                        {deletingId === s.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
