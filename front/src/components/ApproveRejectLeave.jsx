import { useState } from "react";

const ApproveRejectLeave = () => {
  const [leaveId, setLeaveId] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL; // <-- from .env

  const handleDecision = async (decision) => {
    try {
      console.log(`📌 API Call: ${decision.toUpperCase()} Leave`, { leaveId });

      const res = await fetch(`${API_URL}/leaves/${leaveId}/action`, {
        method: "POST",
        body: JSON.stringify({ action: decision.toUpperCase() }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`❌ Error: ${errorData.detail || "Failed to process leave"}`);
        return;
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setLeaveId(""); // reset input
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: Could not connect to API");
    }
  };

  return (
    <div className="card">
      <h2>Approve / Reject Leave</h2>

      <input
        type="text"
        placeholder="Leave Request ID"
        value={leaveId}
        onChange={(e) => setLeaveId(e.target.value)}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => handleDecision("APPROVE")}>Approve</button>
        <button onClick={() => handleDecision("REJECT")}>Reject</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ApproveRejectLeave;
