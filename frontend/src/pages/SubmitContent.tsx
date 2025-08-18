import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const SubmitContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/content", { title, description });
      navigate("/dashboard");
    } catch {
      setError("Submission failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-6">Submit New Content</h2>
        <input
          className="border p-2 rounded w-full mb-3"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="border p-2 rounded w-full mb-3"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">Submit</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default SubmitContent;
