import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

type Content = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
};

const UserDashboard = () => {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    axios.get("/content").then(res => setContents(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Submissions</h2>
        <Link className="text-blue-600 bg-gray-300 py-1 px-4 rounded-2xl " to="/submit">Submit</Link>
      </div>
      <ul>
        {contents.map(item => (
          <li key={item.id} className="bg-white p-4 rounded shadow mb-4">
            <div className="font-semibold">{item.title}</div>
            <div className="text-gray-700">{item.description}</div>
            <div className="mt-2 text-sm text-gray-500">
              Status: <span className={
                item.status === "approved"
                  ? "text-green-600"
                  : item.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }>{item.status}</span>{" "}
              &middot; Submitted: {new Date(item.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
