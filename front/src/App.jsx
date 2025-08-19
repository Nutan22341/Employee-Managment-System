import { useState } from "react";
import Header from "./components/Header";
import ButtonPanel from "./components/ButtonPanel";
import EmployeeForm from "./components/EmployeeForm";
import LeaveForm from "./components/LeaveForm";
import ApproveRejectLeave from "./components/ApproveRejectLeave";
import LeaveBalance from "./components/LeaveBalance";
import EmployeeList from "./components/EmployeeList";
import LeaveHistory from "./components/LeaveHistory";

function App() {
  const [activeComponent, setActiveComponent] = useState("");

  return (
    <>
      <Header />
      <ButtonPanel setActiveComponent={setActiveComponent} />
      <div className="container">
        {activeComponent === "employee" && <EmployeeForm />}
        {activeComponent === "leave" && <LeaveForm />}
        {activeComponent === "approve" && <ApproveRejectLeave />}
        {activeComponent === "balance" && <LeaveBalance />}
        {activeComponent === "list" && <EmployeeList />}
        {activeComponent === "leave_history" && <LeaveHistory />}
      </div>
    </>
  );
}

export default App;
