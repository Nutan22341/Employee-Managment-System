import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const LeaveHistory = () => {
  const [empId, setEmpId] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = () => {
    if (!empId) return;
    setLoading(true);

    fetch(`${API_URL}/employees/${empId}/leaves`)
      .then((res) => res.json())
      .then((data) => {
        setLeaves(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching leave history:", err);
        setLoading(false);
      });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: "10px" }}>Leave History</h2>

      {/* Input for Employee ID */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={fetchLeaves}
          style={{
            padding: "8px 15px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Fetch
        </button>
      </div>

      {/* Show Loading */}
      {loading && <p>Loading leave history...</p>}

      {/* Show Table or Message */}
      {!loading && leaves.length === 0 && empId && (
        <p>No leave history found for employee <b>{empId}</b>.</p>
      )}

      {!loading && leaves.length > 0 && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "auto",
            minWidth: "100%",
            tableLayout: "auto",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={thStyle}>Leave ID</th>
              <th style={thStyle}>Start Date</th>
              <th style={thStyle}>End Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td style={tdStyle}>{leave._id}</td>
                <td style={tdStyle}>{leave.start_date}</td>
                <td style={tdStyle}>{leave.end_date}</td>
                <td style={tdStyle}>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// 🔹 Styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  whiteSpace: "nowrap",
};

export default LeaveHistory;
