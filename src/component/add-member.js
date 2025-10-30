import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DashboardLayout from "../component/DashboardLayout";
import "../styles/AddMember.css"; // Import CSS

export default function AddMember() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    dateJoined: "",
    donationPreference: "",
    paymentAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [generatedID, setGeneratedID] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const generateMemberID = () => `MBR${Math.floor(1000 + Math.random() * 9000)}`;
  const generateSecretCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const memberID = generateMemberID();
      const secret = generateSecretCode();

      await addDoc(collection(db, "members"), {
        ...form,
        memberID,
        secretCode: secret,
        createdAt: serverTimestamp(),
      });

      setGeneratedID(memberID);
      setSecretCode(secret);
      setMsg("✅ Member added successfully!");
      setForm({
        fullName: "",
        gender: "",
        contactNumber: "",
        email: "",
        address: "",
        dateJoined: "",
        donationPreference: "",
        paymentAmount: "",
      });
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="add-member-container">
        <h2>Add Mosque Member</h2>
        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="add-member-row">
            {/* Left Column */}
            <div className="add-member-col">
              <label>Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />

              <label>Address</label>
              <textarea
                name="address"
                rows={5}
                value={form.address}
                onChange={handleChange}
                required
              ></textarea>

              <label>Payment Amount (LKR)</label>
              <input
                type="number"
                name="paymentAmount"
                value={form.paymentAmount}
                onChange={handleChange}
                placeholder="Enter amount in LKR"
                required
              />
            </div>

            {/* Right Column */}
            <div className="add-member-col">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />

              <label>Date Joined</label>
              <input type="date" name="dateJoined" value={form.dateJoined} onChange={handleChange} required />

              <label>Donation Preference</label>
              <select name="donationPreference" value={form.donationPreference} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
          </div>

          <button className="add-member-btn" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>

        {generatedID && (
          <div className="member-info">
            <div><strong>Member ID:</strong> {generatedID}</div>
            <div><strong>Secret Code:</strong> {secretCode}</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
