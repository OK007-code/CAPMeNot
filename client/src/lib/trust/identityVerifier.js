// Identity verification for CAPMeNot
// Member 3: Trust + Authorization + Risk Engine

export function verifyIdentity(input = {}) {
  const claims = input.claims || [];
  const evidence = input.evidence || {};

  const identityClaim = claims.find(
    (claim) => claim.category === "identity"
  );

  const organizationClaim = claims.find(
    (claim) => claim.category === "organization"
  );

  const identityValue = identityClaim?.value || null;
  const organizationValue = organizationClaim?.value || null;

  // Identity is verified only when trusted evidence confirms it.
  const identityVerified = evidence.identityVerified === true;
  const organizationVerified = evidence.organizationVerified === true;

  const reasons = [];

  if (!identityClaim) {
    reasons.push("No identity claim was provided");
  }

  if (identityClaim && !identityVerified) {
    reasons.push("Identity could not be verified");
  }

  if (organizationClaim && !organizationVerified) {
    reasons.push("Organization could not be verified");
  }

  let status = "unverified";

  if (identityVerified && organizationVerified) {
    status = "verified";
  } else if (identityVerified || organizationVerified) {
    status = "partially_verified";
  }

  return {
    status,
    identity: identityValue,
    organization: organizationValue,
    reasons
  };
}