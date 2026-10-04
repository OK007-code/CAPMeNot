// Payment verification for TrustLens
// Member 3: Trust + Authorization + Risk Engine

export function verifyPayment(input = {}) {
  const qr = input.qr || {};
  const claims = input.claims || [];
  const evidence = input.evidence || {};

  const paymentClaim = claims.find(
    (claim) => claim.category === "payment"
  );

  const qrRecipient = qr.recipient || null;

  const qrAmount =
    typeof qr.amount === "number"
      ? qr.amount
      : null;

  const claimedPayment = paymentClaim?.value || null;

  const recipientVerified =
    evidence.recipientVerified === true;

  const amountVerified =
    evidence.amountVerified === true;

  const reasons = [];

  if (!qrRecipient) {
    reasons.push("Payment recipient was not provided");
  }

  if (qrAmount === null) {
    reasons.push("Payment amount was not provided");
  }

  if (paymentClaim && !amountVerified) {
    reasons.push("Payment amount could not be verified");
  }

  if (qrRecipient && !recipientVerified) {
    reasons.push("Payment recipient could not be verified");
  }

  let status = "unverified";

  if (recipientVerified && amountVerified) {
    status = "verified";
  }

  return {
    status,
    recipient: qrRecipient,
    amount: qrAmount,
    claimedPayment,
    reasons
  };
}