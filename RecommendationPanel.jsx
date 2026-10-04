export default function RecommendationPanel() {
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
      <h2>🛡 Recommended Actions</h2>

      <ul>
        <li>Do not make the payment.</li>
        <li>Verify through official channels.</li>
        <li>Avoid responding under pressure.</li>
      </ul>
    </div>
  );
}