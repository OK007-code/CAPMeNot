import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, QrCode, RotateCcw, Upload, X } from "lucide-react";
import decodeQR from "../lib/qr/qrDecoder";

const STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
};

export default function QRScanner({ onDecoded }) {
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const objectUrlRef = useRef(null);
  const onDecodedRef = useRef(onDecoded);

  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [decodedText, setDecodedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onDecodedRef.current = onDecoded;
  }, [onDecoded]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const reset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreviewUrl("");
    setDecodedText("");
    setErrorMessage("");
    setStatus(STATUS.IDLE);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus(STATUS.FAILED);
      setErrorMessage("Please select an image file.");
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setPreviewUrl(url);
    setDecodedText("");
    setErrorMessage("");
    setStatus(STATUS.PROCESSING);

    const img = new Image();

    img.onload = async () => {
      try {
        imageRef.current = img;

        const result = await decodeQR(img);

        if (result) {
          setDecodedText(result);
          setStatus(STATUS.SUCCESS);

          if (onDecodedRef.current) {
            onDecodedRef.current(result);
          }
        } else {
          setStatus(STATUS.FAILED);
          setErrorMessage(
            "No QR code was detected. Please upload a clearer QR image."
          );
        }
      } catch (error) {
        console.error("QR decode error:", error);
        setStatus(STATUS.FAILED);
        setErrorMessage(
          "Could not read this QR code. Please try another image."
        );
      }
    };

    img.onerror = () => {
      setStatus(STATUS.FAILED);
      setErrorMessage("Could not load this image.");
    };

    img.src = url;
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "28px",
        border: "1px solid #dbe5e7",
        borderRadius: "20px",
        background: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#e5f7f5",
            color: "#008f8c",
          }}
        >
          <QrCode size={25} />
        </div>

        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#008f8c",
              marginBottom: "4px",
            }}
          >
            QR CODE SCAN
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              color: "#102033",
            }}
          >
            Scan a QR code
          </h2>
        </div>
      </div>

      {/* Upload area */}
      {!previewUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            minHeight: "220px",
            border: "2px dashed #b9d7d8",
            borderRadius: "18px",
            background: "#f8fcfc",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "#193247",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: "#e5f7f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#008f8c",
            }}
          >
            <ImagePlus size={28} />
          </div>

          <strong style={{ fontSize: "17px" }}>
            Upload QR Code Image
          </strong>

          <span style={{ color: "#6b7d89", fontSize: "14px" }}>
            Click here to choose an image from your device
          </span>

          <span
            style={{
              marginTop: "4px",
              padding: "9px 16px",
              borderRadius: "9px",
              background: "#008f8c",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Upload size={14} style={{ marginRight: "7px", verticalAlign: "middle" }} />
            Choose Image
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {/* Preview */}
      {previewUrl && (
        <div>
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: "220px",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#f5f7f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              ref={imageRef}
              src={previewUrl}
              alt="QR code preview"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "360px",
                objectFit: "contain",
              }}
            />

            {status === STATUS.PROCESSING && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.82)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Loader2
                  size={30}
                  className="spin"
                  style={{ color: "#008f8c" }}
                />
                <strong>Reading QR code...</strong>
              </div>
            )}
          </div>

          {/* Success */}
          {status === STATUS.SUCCESS && (
            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "14px",
                background: "#edf9f4",
                border: "1px solid #bce5d2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  color: "#16805b",
                  fontWeight: 700,
                  marginBottom: "9px",
                }}
              >
                <Check size={19} />
                QR code decoded successfully
              </div>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "9px",
                  background: "#fff",
                  color: "#253746",
                  fontSize: "14px",
                  wordBreak: "break-word",
                }}
              >
                {decodedText}
              </div>
            </div>
          )}

          {/* Failed */}
          {status === STATUS.FAILED && (
            <div
              style={{
                marginTop: "18px",
                padding: "15px",
                borderRadius: "14px",
                background: "#fff5f4",
                border: "1px solid #f0c7c3",
                color: "#a33b35",
              }}
            >
              <strong>QR scan failed</strong>
              <div style={{ marginTop: "5px", fontSize: "14px" }}>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "18px",
            }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #cbdadd",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <Upload size={15} style={{ marginRight: "7px", verticalAlign: "middle" }} />
              Choose Another
            </button>

            <button
              type="button"
              onClick={reset}
              style={{
                padding: "12px 16px",
                border: "1px solid #cbdadd",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <RotateCcw size={15} style={{ marginRight: "7px", verticalAlign: "middle" }} />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Hidden technical note */}
      <div
        style={{
          marginTop: "18px",
          fontSize: "12px",
          color: "#7a8a93",
          textAlign: "center",
        }}
      >
        Your image is processed locally for QR decoding.
      </div>
    </div>
  );
}