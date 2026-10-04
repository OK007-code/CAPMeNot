const clean = (value) => value.replace(/\s+/g, " ").trim();

export function extractEvidence(input, claims = []) {
    const text = clean(input);
    const evidence = [];

    // 1. URLs
    const urls = text.match(/https?:\/\/[^\s]+/gi);

    if (urls) {
        for (const url of urls) {
            evidence.push({
                type: "url",
                value: url,
                source: "message"
            });
        }
    }

    // 2. Phone numbers
    const phones = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/g);

    if (phones) {
        for (const phone of phones) {
            evidence.push({
                type: "phone",
                value: phone,
                source: "message"
            });
        }
    }

    // 3. UPI IDs
    // 3. UPI IDs
const upiIds = text.match(
    /\b[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+(?=\s|$)/g
);

if (upiIds) {
    for (const upi of upiIds) {
        // Ignore normal email addresses
        if (upi.includes(".com") || upi.includes(".in") || upi.includes(".org")) {
            continue;
        }

        evidence.push({
            type: "upi",
            value: upi,
            source: "message"
        });
    }
}

    // 4. Organizations mentioned in claims
    for (const claim of claims) {
        if (
            claim.category === "organization" ||
            claim.category === "identity"
        ) {
            evidence.push({
                type: "organization_claim",
                value: claim.value,
                source: "claim"
            });
        }
    }

    // 5. Payment evidence
    for (const claim of claims) {
        if (claim.category === "payment") {
            evidence.push({
                type: "payment",
                value: claim.value,
                source: "claim"
            });
        }
    }

    return {
        evidence
    };
}