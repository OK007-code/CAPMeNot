import cvReadyPromise from "@techstark/opencv-js";

let cvPromise = null;

function getCV() {
  if (!cvPromise) {
    cvPromise = Promise.resolve(cvReadyPromise).catch((error) => {
      // Allow a retry on the next call if initialization failed
      cvPromise = null;
      throw error;
    });
  }
  return cvPromise;
}

function imageToImageData(imageElement) {
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  if (!width || !height) {
    throw new Error("decodeQR: image has no dimensions (is it loaded?)");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("decodeQR: could not create 2D canvas context");
  }

  ctx.drawImage(imageElement, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export async function decodeQR(imageElement) {
  if (!imageElement) {
    throw new Error("decodeQR: imageElement is required");
  }

  const cv = await getCV();
  const imageData = imageToImageData(imageElement);

  let src = null;
  let gray = null;
  let detector = null;
  let points = null;
  let straight = null;

  try {
    src = cv.matFromImageData(imageData);

    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    detector = new cv.QRCodeDetector();
    points = new cv.Mat();
    straight = new cv.Mat();

    const decoded = detector.detectAndDecode(gray, points, straight);

    if (typeof decoded === "string" && decoded.trim().length > 0) {
      return decoded;
    }

    return null;
  } finally {
    if (straight) straight.delete();
    if (points) points.delete();
    if (detector) detector.delete();
    if (gray) gray.delete();
    if (src) src.delete();
  }
}

export default decodeQR;