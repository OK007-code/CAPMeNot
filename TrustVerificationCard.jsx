export default function TrustVerificationCard() {
  return (
    <div
      style={{
        border: "2px solid green",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "10px"
      }}
    >
      <h2>🔍 Trust Verification</h2>

      <p>✅ Identity Verified</p>
      <p>✅ Organization Verified</p>
      <p>⚠ Role Unverified</p>
      <p>❌ Authorization Contradicted</p>
      <p>⚠ Payment Unverified</p>
    </div>
  );
}