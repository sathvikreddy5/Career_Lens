import prisma from "../config/prisma.js";

export const getSafetyHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const postings = await prisma.opportunityPosting.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    res.json({
      postings,
    });
  } catch (error) {
    console.error("GET SAFETY HISTORY ERROR:", error);

    res.status(500).json({
      message: "Unable to load verification history.",
    });
  }
};

export const getSafetyHistoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const posting = await prisma.opportunityPosting.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!posting) {
      return res.status(404).json({
        message: "Verification record not found.",
      });
    }

    res.json({
      posting,
    });
  } catch (error) {
    console.error("GET SAFETY HISTORY ITEM ERROR:", error);

    res.status(500).json({
      message: "Unable to load verification record.",
    });
  }
};
