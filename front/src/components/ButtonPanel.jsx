const ButtonPanel = ({ setActiveComponent }) => {
  return (
    <div className="container">
      <button onClick={() => setActiveComponent("employee")}>Add New Employee</button>
      <button onClick={() => setActiveComponent("leave")}>Apply for Leave</button>
      <button onClick={() => setActiveComponent("approve")}>Approve / Reject Leave</button>
      <button onClick={() => setActiveComponent("balance")}>Fetch Leave Balance</button>
      <button onClick={() => setActiveComponent("list")}>View All Employees</button>
      <button onClick={() => setActiveComponent("leave_history")}>Leave History</button>
    </div>
  );
};

export default ButtonPanel;
