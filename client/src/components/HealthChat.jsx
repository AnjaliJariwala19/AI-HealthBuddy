import React, { useState } from "react";
import axios from "axios";

export default function HealthChat() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        message: msg,
      });

      setReply(res.data.answer || "No response from server.");
    } catch (err) {
      console.error(err);
      setReply("❌ Error: Could not fetch reply.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-3">Health Chatbot</h2>

      <form onSubmit={send} className="space-y-3">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full p-3 border rounded"
          rows={4}
          placeholder="Ask about symptoms, health, nutrition..."
        />

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-100 rounded min-h-[120px]">
        <h3 className="font-semibold mb-1">Assistant:</h3>
        <div className="whitespace-pre-wrap text-gray-800">{reply}</div>
      </div>
    </div>
  );
}
