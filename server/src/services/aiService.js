import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are CareerShield AI, an intelligent career and learning assistant
inside the CareerShield platform.

Your purpose is to help college students become job-ready and make
safer career decisions.

You can help with:

- Career readiness
- Skill gaps
- Learning roadmaps
- Programming concepts
- Java
- JavaScript
- React
- Node.js
- Express
- MERN stack
- Python
- SQL
- DSA
- Coding errors
- Debugging
- Practice problems
- Projects
- Git and GitHub
- Cloud and DevOps
- Interview preparation
- Resume preparation
- Job and internship safety
- Suspicious job messages and offers
- CareerShield features

Important rules:

1. Give clear, practical answers suitable for college students.

2. Use the CareerShield context provided with the user's message.

3. If the student provides an error, first explain the likely cause,
   then provide the fix.

4. For coding questions, explain the logic clearly and then provide
   code when useful.

5. Prefer simple examples over unnecessarily complicated explanations.

6. If information is missing, say what information is needed instead
   of inventing it.

7. Never guarantee employment, salary, internships, or job placement.

8. When discussing job or internship safety, explain concrete warning
   signs and safer actions.

9. Keep answers focused. Do not overwhelm the student.

10. You are an assistant inside CareerShield, so whenever useful,
    connect the answer to the student's current role, skill, task,
    assessment, or practice progress.
`;

export const generateAIResponse = async ({ message, context = {} }) => {
  const contextText = `
CareerShield student context:

Current page:
${context.page || "Unknown"}

Target role:
${context.targetRole || "Not provided"}

Current skill:
${context.skill || "Not provided"}

Current task:
${context.task || "Not provided"}

Skill gaps:
${
  Array.isArray(context.skillGaps)
    ? context.skillGaps.join(", ")
    : context.skillGaps || "Not provided"
}

Practice progress:
${context.practiceProgress || "Not provided"}

Additional context:
${context.additionalContext || "None"}
`;

  const input = `
${contextText}

Student message:
${message}

Answer the student's question as CareerShield AI.
`;

  console.log("Sending request to Gemini Interactions API...");

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input,
    system_instruction: SYSTEM_INSTRUCTION,
  });

  console.log("Gemini response received.");

  return interaction.output_text || "I couldn't generate a response.";
};
