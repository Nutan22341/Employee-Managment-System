import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000"; // change if needed

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/employees`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching employees:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="card">
      <h2 style={{ marginBottom: "10px" }}>All Employees</h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "auto",       // 🔹 only as wide as content
          tableLayout: "auto", // 🔹 columns fit to content
        }}
      >
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={thStyle}>Employee ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Joining Date</th>
            <th style={thStyle}>Leave Balance</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td style={tdStyle}>{emp._id}</td>
              <td style={tdStyle}>{emp.name}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.department}</td>
              <td style={tdStyle}>{emp.joining_date}</td>
              <td style={tdStyle}>{emp.leave_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default Employees;
