import { useState } from "react";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    joining_date: "",
    leave_balance: 20
  });

  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL; // <-- load from env

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      console.log("📌 API Call: Add Employee", formData);

      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`❌ Error: ${errorData.detail || "Failed to add employee"}`);
        return;
      }

      const data = await res.json();
      setMessage(`✅ Employee added successfully! ID: ${data.id}`);
      setFormData({
        name: "",
        email: "",
        department: "",
        joining_date: "",
        leave_balance: 20
      }); // reset form
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: Could not connect to API");
    }
  };

  return (
    <div className="card">
      <h2>Add New Employee</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />

      <label>Joining Date</label>
      <input
        type="date"
        name="joining_date"
        value={formData.joining_date}
        onChange={handleChange}
      />

      <label>Leave Balance</label>
      <input
        type="number"
        name="leave_balance"
        value={formData.leave_balance}
        onChange={handleChange}
      />

      <button onClick={handleAddEmployee}>Submit</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EmployeeForm;
