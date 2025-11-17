import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ReportOrganizer() {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3001/api/reports";

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(API_URL);
      setReports(res.data.reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Upload a report
  const uploadReport = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`${res.data.fileName} uploaded successfully!`);
      setFile(null);
      fetchReports();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete a report
  const deleteReport = async (fileName) => {
    if (!window.confirm(`Delete ${fileName}?`)) return;
    try {
      await axios.delete(`${API_URL}/${fileName}`);
      alert(`${fileName} deleted successfully!`);
      fetchReports();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  // Download a report
  const downloadReport = (fileName) => {
    window.open(`${API_URL}/download/${fileName}`, "_blank");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Report Organizer</h2>

      {/* Upload form */}
      <form onSubmit={uploadReport} className="mb-4 space-y-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Report"}
        </button>
      </form>

      {/* List of reports */}
      <div>
        {reports.length === 0 && <p>No reports uploaded yet.</p>}
        <ul className="space-y-2">
          {reports.map((fileName) => (
            <li key={fileName} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{fileName}</span>
              <div className="space-x-2">
                <button
                  onClick={() => downloadReport(fileName)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteReport(fileName)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
