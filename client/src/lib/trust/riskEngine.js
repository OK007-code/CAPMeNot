// CAPMeNot Risk Engine
// Member 3: Trust + Authorization + Risk Engine

import { verifyIdentity } from "./identityVerifier.js";
import { verifyAuthorization } from "./authorizationVerifier.js";
import { verifyPayment } from "./paymentVerifier.js";

export function calculateRisk(input = {}) {
  // Run all three verification modules
  const identityResult = verifyIdentity(input);
  const authorizationResult = verifyAuthorization(input);
  const paymentResult = verifyPayment(input);

  let riskScore = 0;

  const reasons = [];
  const recommendations = [];

  // --------------------------------
  // 1. Identity risk
  // --------------------------------

  if (identityResult.status === "unverified") {
    riskScore += 30;

    reasons.push(
      "Identity could not be verified"
    );

    recommendations.push(
      "Verify the person's identity through an official source"
    );
  }

  if (identityResult.status === "partially_verified") {
    riskScore += 15;

    reasons.push(
      "Identity or organization was only partially verified"
    );
  }

  // --------------------------------
  // 2. Authorization risk
  // --------------------------------

  if (authorizationResult.status === "unverified") {
    riskScore += 25;

    reasons.push(
      "Request authorization could not be verified"
    );

    recommendations.push(
      "Verify that the person is authorized to make this request"
    );
  }

  if (authorizationResult.status === "contradicted") {
    riskScore += 40;

    reasons.push(
      "Request authorization is inconsistent with the claimed role"
    );

    recommendations.push(
      "Do not follow the requested action until authorization is confirmed"
    );
  }

  // --------------------------------
  // 3. Payment risk
  // --------------------------------

  if (paymentResult.status === "unverified") {
    riskScore += 30;

    reasons.push(
      "Payment recipient or amount could not be verified"
    );

    recommendations.push(
      "Verify the payment recipient through an official source"
    );
  }

  // --------------------------------
  // 4. Calculate final risk
  // --------------------------------

  let overallRisk = "LOW";

  if (riskScore >= 60) {
    overallRisk = "HIGH";
  } else if (riskScore >= 30) {
    overallRisk = "MEDIUM";
  }

  // --------------------------------
  // 5. Final recommendations
  // --------------------------------

  if (overallRisk === "HIGH") {
    recommendations.push(
      "Do not make the payment or follow the request"
    );
  }

  if (overallRisk === "MEDIUM") {
    recommendations.push(
      "Verify the request before taking action"
    );
  }

  if (overallRisk === "LOW") {
    recommendations.push(
      "No major trust issue was detected from the available evidence"
    );
  }

  // --------------------------------
  // 6. Return Member 3 result
  // --------------------------------

  return {
    overallRisk,
    riskScore,

    identity: identityResult,

    organization: {
      status: identityResult.status
    },

    role: {
      status: authorizationResult.status
    },

    authorization: authorizationResult,

    payment: paymentResult,

    reasons,

    recommendations,

    source: "trust-engine",

    analyzedAt: new Date().toISOString()
  };
}