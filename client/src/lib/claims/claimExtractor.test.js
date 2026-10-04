import { extractClaims } from "./claimExtractor.js";

const testCases = [
    "Main SBI se bol raha hoon. Aapka account block ho jayega. ₹2500 immediately pay karo.",

    "I am an SBI bank officer. Pay ₹500 for verification immediately.",

    "Main ABES se bol raha hoon. Verification ke liye ₹1000 fee submit karo.",

    "Your account will be blocked. Send your OTP and pay ₹2000 right now."
];

for (const text of testCases) {
    console.log("\n==============================");
    console.log("INPUT:");
    console.log(text);
    console.log("\nOUTPUT:");

    console.log(
        JSON.stringify(extractClaims(text), null, 2)
    );
}