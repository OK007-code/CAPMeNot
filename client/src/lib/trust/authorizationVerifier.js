// Authorization verification for CAPMeNot
// Member 3: Trust + Authorization + Risk Engine

export function verifyAuthorization(input = {}) {
  const claims = input.claims || [];
  const evidence = input.evidence || {};

  const roleClaim = claims.find(
    (claim) => claim.category === "role"
  );

  const intentClaim = claims.find(
    (claim) => claim.category === "intent"
  );

  const role = roleClaim?.value || null;
  const requestedAction = intentClaim?.value || null;

  const authorizationVerified =
    evidence.authorizationVerified === true;

  const authorizationContradicted =
    evidence.authorizationContradicted === true;

  const reasons = [];

  if (!roleClaim) {
    reasons.push("No role information was provided");
  }

  if (!intentClaim) {
    reasons.push("No requested action was provided");
  }

  if (authorizationContradicted) {
    reasons.push(
      "The requested action is inconsistent with the claimed authority"
    );
  }

  if (!authorizationVerified && !authorizationContradicted) {
    reasons.push("Authorization could not be verified");
  }

  let status = "unverified";

  if (authorizationContradicted) {
    status = "contradicted";
  } else if (authorizationVerified) {
    status = "verified";
  }

  return {
    status,
    role,
    requestedAction,
    reasons
  };
}