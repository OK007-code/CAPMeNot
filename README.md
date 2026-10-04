# **🛡️ CAPMeNot**

> **Don't Just Detect Suspicion. Verify Trust.**

CAPMeNot is an AI-assisted **Digital Trust & Verification Layer** designed to analyze suspicious digital interactions and evaluate **claims, identity, authority, evidence, and requested actions**.

Instead of simply asking:

> **"Does this look like a scam?"**

CAPMeNot asks:

> **"Who is making this claim, are they authorized, what evidence supports it, and is the requested action actually authorized?"**

---

**📌 Table of Contents**

* **Problem**
* **Solution**
* **Key Features**
* **System Architecture**
* **Current Processing Pipeline**
* **Project Structure**
* **Technology Stack**
* **Running the Project**
* **Testing**
* **Team Architecture**
* **Module Contracts**
* **Core Design Principle**
* **Roadmap**
* **Vision**

---

**🎯 Problem**

Modern scams are becoming increasingly convincing.

Attackers can impersonate:

* 🏦 Banks and financial institutions
* 🏛️ Government organizations
* 🎓 College authorities
* 📞 Customer-support representatives
* 📦 Delivery agents
* 🏢 Companies and merchants

A message may contain a convincing logo, URL, phone number, QR code, or manipulated media.

Traditional scam detectors often focus on suspicious patterns. However:

> ⚠️ **A message can look legitimate while the person making the request is unauthorized.**

This creates a deeper trust problem:

**Identity ≠ Authority ≠ Authorization**

---

**💡 Solution**

CAPMeNot introduces a layered verification approach:

```text
DIGITAL INTERACTION
        ↓
      CLAIMS
        ↓
     IDENTITY
        ↓
     AUTHORITY
        ↓
      EVIDENCE
        ↓
    PROVENANCE
        ↓
  REQUESTED ACTION
        ↓
 AUTHORIZATION CHECK
        ↓
   TRUST VERDICT
```

The system is designed around explainable outcomes:

| **Verdict**        | **Meaning**                                         |
| ------------------ | --------------------------------------------------- |
| ✅ **VERIFIED**     | Available evidence supports the claim/request       |
| ⚠️ **UNVERIFIED**  | The claim/request cannot currently be established   |
| ❌ **CONTRADICTED** | Available evidence conflicts with the claim/request |

> **CAPMeNot does not rely only on a black-box risk score. It aims to explain why a claim or requested action could not be trusted.**

---

**🚀 Key Features**

**1. 🧠 Claim Extraction**

CAPMeNot extracts important claims from digital messages.

**Example Input**

```text
"I am from SBI"
"Your account will be blocked"
"Pay ₹2500 immediately"
"Send your OTP"
```

**Structured Claim**

```json
{
  "category": "identity",
  "value": "Main SBI se bol raha hoon",
  "evidence": "Main SBI se bol raha hoon",
  "status": "unverified"
}
```

**Current Claim Categories**

* Identity
* Organization
* Role
* Payment
* Intent
* Authority
* Urgency

> **The extraction layer does not decide whether the claim is true. It identifies and structures what is being claimed.**

---

**2. 🔎 Evidence Extraction**

CAPMeNot extracts supporting digital evidence such as:

* 🔗 URLs
* 📱 Phone numbers
* 💳 UPI identifiers
* 🏢 Organizations
* 💰 Payment information
* 🔍 Claim-linked evidence

**Example**

```json
{
  "type": "url",
  "value": "https://example.com",
  "source": "message"
}
```

The extracted evidence is passed to the subsequent trust and authorization layer.

---

**3. 🪪 Identity Verification**

Mentioning an organization does **not** automatically verify identity.

For example:

```text
"I am from SBI"
```

does not automatically mean:

```text
Identity = Verified
```

Instead:

```text
Organization → SBI
Identity     → Unverified
```

This prevents simple organization-name matching from being treated as proof of identity.

---

**4. 🏛️ Authority Verification**

A genuine employee does not necessarily have authority to perform every action.

CAPMeNot separates:

```text
Identity
   ↓
Role
   ↓
Authority
```

**Example**

```text
Identity          → Verified
Role              → Verified
Payment Authority → Unverified
```

This distinction is a core part of the CAPMeNot architecture.

---

**5. 🔐 Request Authorization**

CAPMeNot evaluates whether the **requested action itself is authorized**.

**Example**

```text
Employee Identity → Verified
Organization      → Verified
Role              → Verified
Payment Request   → Not Authorized
```

**Possible result:**

> 🔴 **Identity Verified — Request Not Authorized**

This allows CAPMeNot to identify risky interactions even when the claimed organization or identity appears legitimate.

---

**6. 💳 Payment & QR Verification**

CAPMeNot can process:

* Payment amounts
* UPI identifiers
* QR-derived payment information
* Payment recipients
* Payment requests

The QR layer extracts payment information while the trust layer evaluates it.

```text
Data Extraction
      ↓
Verification
      ↓
Trust / Risk Decision
```

---

**7. 🌍 Regional Trust Intelligence**

Scams are often localized.

**Regional context may include:**

* Local organizations
* Hindi/Hinglish language
* Regional government schemes
* Local payment habits
* Region-specific scam patterns

**Example**

```text
"UP scholarship verification ke liye
₹1500 processing fee jama karein."
```

**The intended intelligence flow is:**

```text
REGION
   ↓
LOCAL CLAIM
   ↓
LOCAL ORGANIZATION
   ↓
LOCAL SCAM PATTERN
   ↓
AVAILABLE EVIDENCE
   ↓
TRUST / CONTRADICTION
```

The goal is **context-aware verification**, not assuming that every regional claim is fraudulent.

---

**🎭 Deepfake + Identity Verification**

Deepfake detection is treated as a **supporting trust signal**, not the entire solution.

```text
Person appears to be an organization employee
                ↓
        Media authenticity
                ↓
        Identity verification
                ↓
          Role verification
                ↓
       Request authorization
```

**Possible Result**

```text
Identity:               VERIFIED
Media Authenticity:     UNCERTAIN
Payment Authorization:  CONTRADICTED
```

This is more useful than simply saying:

> **"Deepfake detected."**

---

**🧩 System Architecture**

```text
                            CAPMeNot
                               │
                ┌──────────────┴──────────────┐
                │                             │
           INPUT LAYER                  EVIDENCE LAYER
                │                             │
        ┌───────┴───────┐              ┌──────┴──────┐
        │               │              │             │
       Text             QR            URL          Phone
        │               │              │             │
        └───────┬───────┘              └──────┬──────┘
                │                             │
                └──────────────┬──────────────┘
                               ↓
                       CLAIM EXTRACTION
                               ↓
                       EVIDENCE EXTRACTION
                               ↓
                     TRUST & VERIFICATION
                               ↓
              ┌────────────────┼────────────────┐
              ↓                ↓                ↓
          Identity          Authority         Payment
         Verification       Verification      Verification
              │                │                │
              └────────────────┼────────────────┘
                               ↓
                      AUTHORIZATION ENGINE
                               ↓
                          RISK ENGINE
                               ↓
                     EXPLAINABLE RESULT
```

---

**🔄 Current Processing Pipeline**

The currently implemented claim/evidence pipeline is:

```text
Input
  ↓
Claim Extraction
  ↓
Structured Claims
  ↓
Evidence Extraction
  ↓
Structured Evidence
  ↓
Trust / Authorization Layer
```

**Example Input**

```text
Main SBI se bol raha hoon.
Your account will be blocked.
Pay ₹2500 immediately.
```

**Extracted Claims**

```json
{
  "claims": [
    {
      "category": "identity",
      "value": "Main SBI se bol raha hoon",
      "evidence": "Main SBI se bol raha hoon",
      "status": "unverified"
    },
    {
      "category": "organization",
      "value": "SBI",
      "evidence": "SBI",
      "status": "unverified"
    },
    {
      "category": "payment",
      "value": "₹2500",
      "evidence": "₹2500",
      "status": "unverified"
    },
    {
      "category": "intent",
      "value": "Payment requested",
      "evidence": "Pay ₹",
      "status": "unverified"
    },
    {
      "category": "urgency",
      "value": "Immediate action required",
      "evidence": "immediately",
      "status": "unverified"
    }
  ]
}
```

**Extracted Evidence**

```json
{
  "evidence": [
    {
      "type": "url",
      "value": "https://example.com",
      "source": "message"
    },
    {
      "type": "phone",
      "value": "9876543210",
      "source": "message"
    },
    {
      "type": "organization_claim",
      "value": "SBI",
      "source": "claim"
    },
    {
      "type": "payment",
      "value": "₹2500",
      "source": "claim"
    }
  ]
}
```

> **The extraction layer does not label the message as a scam. Verification and final risk reasoning belong to the subsequent trust layer.**

---

**📁 Project Structure**

```text
CAPMeNot/
│
├── client/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── data/
│       ├── hooks/
│       │
│       ├── lib/
│       │   ├── claims/
│       │   │   ├── claimExtractor.js
│       │   │   ├── claimExtractor.test.js
│       │   │   ├── evidence.js
│       │   │   └── evidence.test.js
│       │
│       │   ├── rules/
│       │   │   ├── engine.js
│       │   │   └── engine.test.js
│       │
│       │   └── scoring/
│       │       └── index.js
│       │
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

---

**🛠️ Technology Stack**

| **Layer**              | **Technology / Approach**                                |
| ---------------------- | -------------------------------------------------------- |
| **Frontend**           | React, JavaScript, Vite, CSS                             |
| **Claim Intelligence** | Claim extraction, NLP-based pattern analysis             |
| **Evidence Layer**     | URL, phone, payment and claim-linked evidence extraction |
| **Computer Vision**    | OpenCV.js, QR detection and decoding                     |
| **Trust Layer**        | Identity, authority and authorization verification       |
| **Decision Layer**     | Evidence-based trust and risk reasoning                  |

---

**⚙️ Running the Project**

**1. Clone the repository**

```bash
git clone https://github.com/OK007-code/PROJECT-TrustLens.git
```

**2. Move into the project**

```bash
cd PROJECT-TrustLens
cd client
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

> **Note:** The GitHub repository may retain its existing repository name even though the project itself is now branded as CAPMeNot.

---

**🧪 Testing**

**Claim Extraction**

Navigate to:

```bash
cd client/src/lib/claims
```

Run:

```bash
node claimExtractor.test.js
```

**Evidence Extraction**

Run:

```bash
node evidence.test.js
```

These tests verify that representative inputs are converted into structured **claims** and **evidence**.

---

**👥 Team Architecture**

CAPMeNot is divided into independent modules to keep development modular and simplify integration.

**👤 Member 1 — QR + Computer Vision**

**Responsibilities:**

* QR detection
* QR decoding
* Payment data extraction

**Primary files:**

```text
client/src/components/QRScanner.jsx
client/src/lib/qr/qrDecoder.js
```

---

**👤 Member 2 — Claim + Evidence Extraction**

**Responsibilities:**

* Identity claims
* Organization claims
* Role claims
* Payment claims
* Intent claims
* Authority claims
* Urgency claims
* Evidence extraction

**Primary files:**

```text
client/src/lib/claims/claimExtractor.js
client/src/lib/claims/evidence.js
```

> **Member 2 does not calculate the final risk score.**

---

**👤 Member 3 — Trust + Authorization**

**Responsibilities:**

* Identity verification
* Authority verification
* Payment verification
* Authorization
* Final risk reasoning

**Planned modules:**

```text
client/src/lib/trust/
├── identityVerifier.js
├── authorizationVerifier.js
├── paymentVerifier.js
└── riskEngine.js
```

---

**👤 Member 4 — UI + Explainability**

**Responsibilities:**

* Trust result visualization
* Evidence graph
* Risk explanation
* User-facing recommendations
* Integration with the existing scanner/result flow

**Potential components:**

```text
TrustResult.jsx
EvidenceGraph.jsx
RiskBreakdown.jsx
```

---

**🔗 Module Contracts**

**QR → Trust Layer**

```json
{
  "source": "qr",
  "type": "upi",
  "rawData": "...",
  "recipient": "...",
  "amount": 2500
}
```

**Claim/Evidence → Trust Layer**

```json
{
  "claims": [
    {
      "category": "identity",
      "value": "SBI representative"
    },
    {
      "category": "payment",
      "value": "₹2500"
    }
  ],
  "evidence": [
    {
      "type": "url",
      "value": "https://example.com",
      "source": "message"
    }
  ]
}
```

**Trust Layer → UI**

```json
{
  "overallRisk": "HIGH",
  "identity": {
    "status": "verified"
  },
  "organization": {
    "status": "verified"
  },
  "role": {
    "status": "unverified"
  },
  "authorization": {
    "status": "contradicted"
  },
  "payment": {
    "status": "unverified"
  },
  "reasons": [
    "Payment recipient could not be verified",
    "Request authorization is inconsistent"
  ],
  "recommendations": [
    "Do not make the payment",
    "Verify through the official organization"
  ]
}
```

---

**🔐 Core Design Principle**

> **A Claim Is Not Proof.**

A message saying:

```text
"I am from SBI"
```

is only a **claim**.

CAPMeNot attempts to determine:

```text
Who?
 ↓
Which organization?
 ↓
Which role?
 ↓
What authority?
 ↓
What evidence?
 ↓
What action?
 ↓
Is that action authorized?
```

This creates a clear separation between:

**Identity → Authority → Authorization**

and makes CAPMeNot a **digital trust verification system**, rather than only a conventional scam detector.

---

**🚧 Roadmap**

**Phase 1 — Core Trust Layer**

* [x] Claim extraction
* [x] Evidence extraction
* [x] Existing rule-based analysis
* [x] QR data extraction
* [ ] Identity verification
* [ ] Authority verification
* [ ] Authorization verification
* [ ] Unified trust verdict

**Phase 2 — Advanced Intelligence**

* [ ] Evidence Graph
* [ ] Provenance tracking
* [ ] Regional Trust Intelligence
* [ ] Deepfake + identity verification
* [ ] Personal trust baseline
* [ ] Community threat intelligence

**Phase 3 — Accessibility & Scale**

* [ ] Regional language support
* [ ] Voice-based warnings
* [ ] Guardian Mode
* [ ] Privacy-preserving threat intelligence
* [ ] Expanded payment verification

---

**🎯 Vision**

CAPMeNot aims to move digital safety from:

> **"Does this look suspicious?"**

to:

> **"Can this interaction actually be trusted?"**

By combining **claims, evidence, identity, authority, provenance, and authorization**, CAPMeNot aims to make digital interactions safer and trust decisions more explainable.

---

<div align="center">

**🛡️ CAPMeNot**

**Verify the claim. Verify the authority. Verify the action.**

</div>
