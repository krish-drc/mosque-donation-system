import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 🧩 Admin Imports
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/dashboard"; // Make sure path correct
import AddMember from "./component/add-member";
import ManageMembers from "./component/manage-members";
import EditMember from "./component/edit-member";
import AddAgent from "./component/add-agent";
import ManageAgents from "./component/manage-agents";
import EditAgent from "./component/edit-agent";
import ViewFunds from "./component/view-funds";
import FundManagement from "./component/fund-management";
import PaymentHistory from "./component/payment_history";
import PaymentCollection from "./component/pending_collection";

// 👨‍💼 Agent Imports
import AgentLogin from "./agent/login";
import AgentLayout from "./agent/AgentLayout";
import AgentDashboard from "./agent/agent-dashboard";
import AgentAddMember from "./agent/add-member";
import AgentProfile from "./agent/profile";
import AgentManageMembers from "./agent/my-members";
import AgentPendingCollection from "./agent/AgentPendingCollection";
import AgentPaymentHistory from "./agent/AgentPaymentHistory";
import AgentViewFunds from "./agent/AgentViewFunds";
import AgentFundManager from "./agent/AgentFundManager";
import AgentEditMember from "./agent/edit-member";

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing login route */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Dashboard route */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/manage-members" element={<ManageMembers />} />
        <Route path="/edit-member/:id" element={<EditMember />} />
        <Route path="/add-agent" element={<AddAgent />} />
        <Route path="/manage-agents" element={<ManageAgents />} />
        <Route path="/edit-agent/:id" element={<EditAgent />} />
        <Route path="/view-funds" element={<ViewFunds />} />
        <Route path="/fund-management" element={<FundManagement />} />
        <Route path="/payment_history" element={<PaymentHistory />} />
        <Route path="/pending_collection" element={<PaymentCollection />} />

       
        <Route path="/agent/login" element={<AgentLogin />} />

        <Route path="/agent" element={<AgentLayout />}>
          <Route path="agent-dashboard" element={<AgentDashboard />} />
          <Route path="add-member" element={<AgentAddMember />} />
          <Route path="profile" element={<AgentProfile />} /> 
          <Route path="my-members" element={<AgentManageMembers />} />
          <Route path="AgentPendingCollection" element={<AgentPendingCollection />} />
          <Route path="AgentPaymentHistory" element={<AgentPaymentHistory />} />
          <Route path="AgentViewFunds" element={<AgentViewFunds />} />
          <Route path="AgentFundManager" element={<AgentFundManager />} />
          <Route path="edit-member/:id" element={<AgentEditMember />} />
        </Route>

        </Routes>
    </Router>
  );
}

export default App;
