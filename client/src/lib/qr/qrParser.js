export function parseQRData(rawData) {
    const value = String(rawData || "").trim();

    if (!value) {
        return {
            source: "qr",
            type: "other",
            rawData: "",
        };
    }

    // UPI payment QR
    if (value.toLowerCase().startsWith("upi://pay")) {
        try {
            const url = new URL(value);

            return {
                source: "qr",
                type: "upi",
                rawData: value,
                recipient: url.searchParams.get("pa") || "",
                amount: url.searchParams.get("am") || "",
                name: url.searchParams.get("pn") || "",
            };
        } catch {
            return {
                source: "qr",
                type: "upi",
                rawData: value,
            };
        }
    }

    // URL QR
    try {
        const url = new URL(value);

        if (url.protocol === "http:" || url.protocol === "https:") {
            return {
                source: "qr",
                type: "url",
                rawData: value,
                url: value,
            };
        }
    } catch {
        // Not a standard URL
    }

    // Any other QR content
    return {
        source: "qr",
        type: "other",
        rawData: value,
    };
}

export default parseQRData;