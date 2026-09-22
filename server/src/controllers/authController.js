import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";

// =====================================================
// REGISTER
// =====================================================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------
    // Check existing user
    // -----------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const passwordHash = await bcrypt.hash(password, 10);

    // -----------------------------
    // Create user
    // -----------------------------

    const user = await prisma.user.create({
      data: {
        name: name.trim(),

        email: normalizedEmail,

        passwordHash,
      },
    });

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      message: "Account created successfully.",

      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // -----------------------------
    // Compare password
    // -----------------------------

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // -----------------------------
    // Create JWT
    // -----------------------------

    const token = jwt.sign(
      {
        userId: user.id,

        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      message: "Login successful.",

      token,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while signing in.",
    });
  }
};
