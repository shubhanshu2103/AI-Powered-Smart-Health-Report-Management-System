const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const TEXT_EXTS  = new Set(['.txt', '.md', '.csv']);

class AIService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  _isImage(filePath) {
    return IMAGE_EXTS.has(path.extname(filePath).toLowerCase());
  }

  async extractText(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return '';
    if (this._isImage(filePath)) return '';          // images go through vision directly
    if (TEXT_EXTS.has(path.extname(filePath).toLowerCase())) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return '';
  }

  async generateSummary(extractedText, filePath) {
    const noKey = !process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_...';

    // ── Image path: Groq vision model ──────────────────────────────────
    if (filePath && this._isImage(filePath)) {
      if (noKey) return '[Vision AI] Image report received — configure GROQ_API_KEY to enable summarization.';

      const imageBuffer = fs.readFileSync(filePath);
      const base64 = imageBuffer.toString('base64');
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

      const response = await this.client.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are a medical assistant. This is a medical report image. First extract all visible text and medical information from the image, then provide a concise patient-friendly summary (under 150 words) covering: diagnosis, key findings, test results, and recommended actions. Format: start with "SUMMARY:" followed by the summary.',
              },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const summaryMatch = content.match(/SUMMARY:\s*([\s\S]+)/i);
      return summaryMatch ? summaryMatch[1].trim() : content.trim();
    }

    // ── Text path: standard chat model ─────────────────────────────────
    if (!extractedText?.trim()) return 'No content available for summarization.';
    if (noKey) return `[Summary Preview] ${extractedText.slice(0, 200)}…`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a medical assistant. Summarize the following medical report in simple, patient-friendly language. Focus on diagnosis, key findings, and recommended actions. Keep it under 150 words.',
        },
        { role: 'user', content: extractedText },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary.';
  }
}

module.exports = new AIService();
