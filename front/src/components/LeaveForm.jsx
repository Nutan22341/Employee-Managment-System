import { useState } from "react";

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    start_date: "",
    end_date: ""
  });

  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL; // <-- from .env

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyLeave = async () => {
    try {
      console.log("📌 API Call: Apply Leave", formData);

      const res = await fetch(`${API_URL}/leaves`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`❌ Error: ${errorData.detail || "Failed to apply leave"}`);
        return;
      }

      const data = await res.json();
      setMessage(`✅ Leave applied successfully! ID: ${data.id}`);
      setFormData({
        employee_id: "",
        start_date: "",
        end_date: ""
      }); // reset form
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: Could not connect to API");
    }
  };

  return (
    <div className="card">
      <h2>Apply for Leave</h2>

      <input
        type="text"
        name="employee_id"
        placeholder="Employee ID"
        value={formData.employee_id}
        onChange={handleChange}
      />

      <label>Start Date</label>
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
      />

      <label>End Date</label>
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
      />

      <button onClick={handleApplyLeave}>Apply</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default LeaveForm;
