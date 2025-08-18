import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

type Stats = { total: number; approved: number; pending: number; rejected: number };
type Activity = { id: string; title: string; status: string; createdAt: string; createdBy: { email: string } };

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recent, setRecent] = useState<Activity[]>([]);
  const [filter, setFilter] = useState({ status: "", keyword: "" });
  const [results, setResults] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get("/content/stats").then(res => setStats(res.data));
    axios.get("/content/recent").then(res => setRecent(res.data));
    axios.get("/content/search").then(res => setResults(res.data));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filter.status) params.append("status", filter.status);
    if (filter.keyword) params.append("keyword", filter.keyword);
    const res = await axios.get(`/content/search?${params.toString()}`);
    setResults(res.data);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Analytics</h3>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded shadow flex-1 text-center">
            <div className="text-lg font-bold text-green-700">{stats.approved}</div>
            <div className="text-gray-700">Approved</div>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 text-center">
            <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-700">Pending</div>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 text-center">
            <div className="text-lg font-bold text-red-700">{stats.rejected}</div>
            <div className="text-gray-700">Rejected</div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <form className="flex gap-2 mb-2" onSubmit={handleSearch}>
          <input
            type="text"
            className="border p-2 rounded flex-1"
            placeholder="Keyword"
            value={filter.keyword}
            onChange={e => setFilter({ ...filter, keyword: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="bg-blue-500 text-white px-4 rounded">Filter</button>
        </form>
        <div>
          {results.map(item => (
            <div key={item.id} className="bg-white p-3 rounded shadow mb-2">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600">
                {item.status} &middot; by {item.createdBy.email} &middot; {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <ul>
          {recent.map(act => (
            <li key={act.id} className="bg-gray-50 rounded my-1 p-2">
              <b>{act.title}</b> was <span className={
                act.status === "approved" ? "text-green-700" : "text-red-700"
              }>{act.status}</span> at {new Date(act.createdAt).toLocaleString()} by {act.createdBy.email}
            </li>
          ))}
        </ul>
      </section>
      <Link to="/approvals" className="text-blue-700 underline">Go to Approvals</Link>
    </div>
  );
};

export default AdminDashboard;
