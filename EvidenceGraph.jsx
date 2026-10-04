export default function EvidenceGraph() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2>📊 Evidence Analysis</h2>

      <div style={{ marginTop: "15px" }}>
        <p><strong>Claim:</strong> SBI Employee</p>

        <p>⬇️</p>

        <p>✅ SBI Mentioned</p>

        <p>⬇️</p>

        <p>⚠ Employee Role Not Verified</p>

        <p>⬇️</p>

        <p>❌ Payment Recipient Unknown</p>

        <p>⬇️</p>

        <p><strong>🔴 HIGH RISK</strong></p>
      </div>
    </div>
  );
}