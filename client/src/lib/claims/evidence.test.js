import { extractClaims } from "./claimExtractor.js";
import { extractEvidence } from "./evidence.js";

const text =
    "Main SBI se bol raha hoon. Pay ₹2500 to support@sbi.com. " +
    "Call 9876543210 or visit https://sbi-example.com immediately.";

const claimResult = extractClaims(text);

const evidenceResult = extractEvidence(
    text,
    claimResult.claims
);

console.log("\nCLAIMS:");
console.log(JSON.stringify(claimResult, null, 2));

console.log("\nEVIDENCE:");
console.log(JSON.stringify(evidenceResult, null, 2));