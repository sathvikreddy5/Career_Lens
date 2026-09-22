import { generateAIResponse } from "../services/aiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }

    console.log("AI request received:", {
      userId: req.user?.userId,
      message: message.trim(),
      context,
    });

    const response = await generateAIResponse({
      message: message.trim(),
      context: context || {},
    });

    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("=================================");
    console.error("AI CHAT ERROR");
    console.error("=================================");

    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Name:", error?.name);
    console.error("Details:", error?.details);
    console.error("Response:", error?.response);

    console.error("Full error:", error);

    return res.status(500).json({
      message: "Unable to get a response from CareerShield AI.",
      error: error?.message || "Unknown AI error",
    });
  }
};
