import { createWorker } from "tesseract.js";

export const extractTextFromImage = async (imageBuffer) => {
  let worker;

  try {
    worker = await createWorker("eng");

    const result = await worker.recognize(imageBuffer);

    return result.data.text?.trim() || "";
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};
