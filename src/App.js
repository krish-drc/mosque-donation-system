import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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


        </Routes>
    </Router>
  );
}

export default App;
