const clean = (value) => value.replace(/\s+/g, " ").trim();

const addClaim = (claims, category, value, evidence) => {
    if (!value || !evidence) return;

    claims.push({
        category,
        value: clean(value),
        evidence: clean(evidence),
        status: "unverified"
    });
};

export function extractClaims(input) {
    const text = clean(input);
    const lowerText = text.toLowerCase();

    const claims = [];

    // -------------------------
    // 1. IDENTITY
    // -------------------------

    const identityPatterns = [
        /(?:i am|i'm)\s+(?:from\s+)?([a-zA-Z][a-zA-Z\s]*?)(?:\s+speaking|\s+representative|\s+employee|$)/i,

        /(?:main|mai)\s+(.+?)\s+se\s+(?:bol|baat)\s+raha\s+hoon/i,

        /([a-zA-Z]+)\s+(?:representative|employee|officer)/i
    ];

    for (const pattern of identityPatterns) {
        const match = text.match(pattern);

        if (match) {
            addClaim(
                claims,
                "identity",
                match[0],
                match[0]
            );
            break;
        }
    }

    // -------------------------
    // 2. ORGANIZATION
    // -------------------------

    const organizations = [
        "SBI",
        "HDFC",
        "ICICI",
        "Axis Bank",
        "Paytm",
        "PhonePe",
        "Google Pay",
        "Amazon",
        "Flipkart",
        "ABES"
    ];

    for (const organization of organizations) {
        const regex = new RegExp(`\\b${organization}\\b`, "i");

        if (regex.test(text)) {
            addClaim(
                claims,
                "organization",
                organization,
                organization
            );
            break;
        }
    }

    // -------------------------
    // 3. ROLE
    // -------------------------

    const rolePatterns = [
        /\b(bank officer|bank employee|account officer|manager|police officer|customer care|support executive|delivery agent|government officer)\b/i,
        /\b(officer|employee|representative|agent|executive)\b/i
    ];

    for (const pattern of rolePatterns) {
        const match = text.match(pattern);

        if (match) {
            addClaim(
                claims,
                "role",
                match[0],
                match[0]
            );
            break;
        }
    }

    // -------------------------
    // 4. PAYMENT
    // -------------------------

    const paymentMatch = text.match(
        /(?:₹|rs\.?|inr)\s?[\d,]+/i
    );

    if (paymentMatch) {
        addClaim(
            claims,
            "payment",
            paymentMatch[0],
            paymentMatch[0]
        );
    }

    // -------------------------
    // 5. INTENT
    // -------------------------

    const intentPatterns = [
        {
            pattern: /(?:pay|send|transfer|deposit|submit).{0,40}(?:₹|rs\.?|inr)/i,
            value: "Payment requested"
        },
        {
            pattern: /(?:verification|verify).{0,30}(?:fee|payment|charge)/i,
            value: "Verification payment requested"
        },
        {
            pattern: /(?:account).{0,30}(?:block|suspend|close)/i,
            value: "Account action threatened"
        },
        {
            pattern: /(?:otp|one time password|pin|cvv|password).{0,30}(?:share|send|provide|tell)/i,
            value: "Sensitive credential requested"
        }
    ];

    for (const item of intentPatterns) {
        const match = text.match(item.pattern);

        if (match) {
            addClaim(
                claims,
                "intent",
                item.value,
                match[0]
            );
            break;
        }
    }

    // -------------------------
    // 6. AUTHORITY
    // -------------------------

    const authorityPatterns = [
        /account\s+(?:will be|can be|may be)\s+blocked/i,
        /account\s+block/i,
        /legal\s+action/i,
        /police\s+case/i,
        /arrest/i,
        /fine/i,
        /penalty/i
    ];

    for (const pattern of authorityPatterns) {
        const match = text.match(pattern);

        if (match) {
            addClaim(
                claims,
                "authority",
                match[0],
                match[0]
            );
            break;
        }
    }

    // -------------------------
    // 7. URGENCY
    // -------------------------

    const urgencyWords = [
        "immediately",
        "urgent",
        "right now",
        "within 10 minutes",
        "within 5 minutes",
        "within 1 hour",
        "jaldi",
        "abhi",
        "turant",
        "aaj hi"
    ];

    const urgency = urgencyWords.find((word) =>
        lowerText.includes(word)
    );

    if (urgency) {
        addClaim(
            claims,
            "urgency",
            "Immediate action required",
            urgency
        );
    }

    return {
        claims
    };
}