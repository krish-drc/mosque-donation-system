import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "../component/DashboardLayout";
import { Card, Row, Col, Table, Form } from "react-bootstrap";

export default function ViewFunds() {
  const [funds, setFunds] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  const fundCollection = collection(db, "funds");
  const memberCollection = collection(db, "members");

  useEffect(() => {
    fetchFunds();
    fetchMembers();
  }, []);

  const fetchFunds = async () => {
    const data = await getDocs(fundCollection);
    setFunds(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

  const fetchMembers = async () => {
    const data = await getDocs(memberCollection);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

  // ----- Overall Totals -----
  const totalPaid = funds.reduce((sum, f) => sum + f.amount, 0);
  const totalExpectedPayment = members.reduce(
    (sum, m) => sum + (parseFloat(m.paymentAmount) || 0),
    0
  );
  const totalPending = totalExpectedPayment - totalPaid;

  const filteredMembers = members.filter(
    (m) =>
      m.memberID.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.fullName.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mt-4">
        <h3 className="text-center mb-4">🕌 Mosque Fund Summary</h3>

        {/* ----- Dashboard Cards ----- */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="text-center text-white" style={{ backgroundColor: "#FF9800" }}>
              <Card.Body>
                <Card.Title>Total Payment Expected</Card.Title>
                <Card.Text>Rs {totalExpectedPayment}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center text-white" style={{ backgroundColor: "#4CAF50" }}>
              <Card.Body>
                <Card.Title>Total Paid Amount</Card.Title>
                <Card.Text>Rs {totalPaid}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center text-white" style={{ backgroundColor: "#f44336" }}>
              <Card.Body>
                <Card.Title>Total Pending Amount</Card.Title>
                <Card.Text>Rs {totalPending >= 0 ? totalPending : 0}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ----- Member Search ----- */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Member by ID or Name"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
          />
        </Form.Group>

        {/* ----- Member Funds Table ----- */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Member ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>One-time Paid</th>
              <th>Monthly Paid</th>
              <th>Yearly Paid</th>
              <th>Total Paid</th>
              <th>Expected Amount</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m, index) => {
              const memberFunds = funds.filter((f) => f.memberId === m.memberID);

              const oneTime = memberFunds
                .filter((f) => f.type === "One-time")
                .reduce((sum, f) => sum + f.amount, 0);
              const monthly = memberFunds
                .filter((f) => f.type === "Monthly")
                .reduce((sum, f) => sum + f.amount, 0);
              const yearly = memberFunds
                .filter((f) => f.type === "Yearly")
                .reduce((sum, f) => sum + f.amount, 0);
              const total = oneTime + monthly + yearly;
              const expected = parseFloat(m.paymentAmount) || 0;
              const pending = expected - total;

              return (
                <tr key={m.docId}>
                  <td>{index + 1}</td>
                  <td>{m.memberID}</td>
                  <td>{m.fullName}</td>
                  <td>{m.contactNumber}</td>
                  <td>Rs {oneTime}</td>
                  <td>Rs {monthly}</td>
                  <td>Rs {yearly}</td>
                  <td>Rs {total}</td>
                  <td>Rs {expected}</td>
                  <td>Rs {pending >= 0 ? pending : 0}</td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f1f1f1" }}>
              <td colSpan={4}>Totals</td>
              <td>Rs {funds.filter(f => f.type === "One-time").reduce((sum, f) => sum + f.amount, 0)}</td>
              <td>Rs {funds.filter(f => f.type === "Monthly").reduce((sum, f) => sum + f.amount, 0)}</td>
              <td>Rs {funds.filter(f => f.type === "Yearly").reduce((sum, f) => sum + f.amount, 0)}</td>
              <td>Rs {totalPaid}</td>
              <td>Rs {totalExpectedPayment}</td>
              <td>Rs {totalPending >= 0 ? totalPending : 0}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
