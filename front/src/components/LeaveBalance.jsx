import { useState } from "react";

const LeaveBalance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL; // backend URL from .env

  const handleFetchBalance = async () => {
    try {
      console.log("📌 API Call: Fetch Balance", { employeeId });

      const res = await fetch(`${API_URL}/employees/${employeeId}/balance`);

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`❌ Error: ${errorData.detail || "Failed to fetch balance"}`);
        setBalance(null);
        return;
      }

      const data = await res.json();
      setBalance(data.leave_balance);
      setMessage(""); // clear error if successful
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: Could not connect to API");
      setBalance(null);
    }
  };

  return (
    <div className="card">
      <h2>Fetch Leave Balance</h2>

      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />

      <button onClick={handleFetchBalance}>Check Balance</button>

      {balance !== null && <p>✅ Leave Balance: {balance} days</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LeaveBalance;
