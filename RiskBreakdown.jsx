export default function RiskBreakdown() {
  const items = [
    { name: "Identity", status: "Verified", icon: "✅" },
    { name: "Organization", status: "Verified", icon: "✅" },
    { name: "Role", status: "Unverified", icon: "⚠️" },
    { name: "Authorization", status: "Contradicted", icon: "❌" },
    { name: "Payment", status: "Unverified", icon: "⚠️" },
  ];

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
      <h2>📊 Risk Breakdown</h2>

      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <span>{item.name}</span>
          <span>
            {item.icon} {item.status}
          </span>
        </div>
      ))}

      <hr style={{ margin: "15px 0" }} />

      <h3>🔴 Overall Risk: HIGH</h3>
    </div>
  );
}