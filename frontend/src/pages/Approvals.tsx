import { useEffect, useState } from "react";
import axios from "../api/axios";

type Content = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  description: string;
  createdBy: { email: string };
};

const Approvals = () => {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    axios.get("/content").then(res => setContents(res.data));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await axios.put(`/content/${id}/${action}`);
    setContents(content => content.map(
      c => c.id === id ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c
    ));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">All Submissions</h2>
      <ul>
        {contents.map(item => (
          <li key={item.id} className="bg-white p-4 rounded shadow mb-4">
            <div className="font-semibold">{item.title}</div>
            <div className="text-gray-700 mb-2">{item.description}</div>
            <div className="text-sm text-gray-500 mb-1">
              Status: <span className={
                item.status === "approved"
                  ? "text-green-600"
                  : item.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }>{item.status}</span>{" "}
              &middot; by {item.createdBy ? item.createdBy.email : "N/A"}
            </div>
            {item.status === "pending" && (
              <div className="flex gap-2 mt-1">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAction(item.id, "approve")}
                >Approve</button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAction(item.id, "reject")}
                >Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Approvals;
