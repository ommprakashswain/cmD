import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API Route for Gemini Command Generation
  app.post("/api/command", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Generate the PowerShell command based on user input
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI assistant translating natural language commands into safe Windows PowerShell commands.
The user prompt is: "${text}"

Rules:
1. ONLY return the PowerShell command.
2. DO NOT return any markdown formatting, backticks, or explanations.
3. If the request is unsafe, destructive, or unclear, return: echo "Command not recognized or unsafe."
4. Format the output to be executed directly in powershell.exe.
5. Consider common Windows administrator tasks (opening software, networking, system settings, control panel, bluetooth, brightness, volume, etc).

Output the powershell command now:`,
      });

      let command = response.text || 'echo "Could not generate command"';
      command = command.replace(/^`+|`+$/g, '').trim();
      command = command.replace(/^powershell\s+/i, '').trim();

      res.json({ command });
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      res.status(500).json({ error: "Failed to generate command" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
