const Groq = require('groq-sdk');
const path = require('path');
const { downloadBuffer } = require('./storageService');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const TEXT_EXTS  = new Set(['.txt', '.md', '.csv']);

function extOf(url) {
  return path.extname(url.split('?')[0]).toLowerCase();
}

class AIService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateSummary(fileUrl, mimeType) {
    const noKey = !process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_...';
    const ext = extOf(fileUrl);

    // ── Image: Groq vision model ─────────────────────────────────────
    if (IMAGE_EXTS.has(ext)) {
      if (noKey) return '[Vision AI] Image report received — configure GROQ_API_KEY.';
      const buf = await downloadBuffer(fileUrl);
      const base64 = buf.toString('base64');
      const mime = mimeType || (ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : `image/${ext.slice(1)}`);

      const response = await this.client.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are a medical assistant. Extract all medical information from this report image, then write a patient-friendly summary under 150 words covering diagnosis, key findings, test results, and recommended actions. Start with "SUMMARY:" followed by the summary.',
            },
            { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
          ],
        }],
        max_tokens: 500,
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const match = content.match(/SUMMARY:\s*([\s\S]+)/i);
      return match ? match[1].trim() : content.trim();
    }

    // ── Text/PDF: download and summarise ────────────────────────────
    let text = '';
    if (TEXT_EXTS.has(ext)) {
      const buf = await downloadBuffer(fileUrl);
      text = buf.toString('utf8');
    }

    if (!text.trim()) return 'No readable content found in this report.';
    if (noKey) return `[Summary Preview] ${text.slice(0, 200)}…`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a medical assistant. Summarize the following medical report in simple, patient-friendly language. Focus on diagnosis, key findings, and recommended actions. Keep it under 150 words.',
        },
        { role: 'user', content: text },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary.';
  }
}

module.exports = new AIService();
