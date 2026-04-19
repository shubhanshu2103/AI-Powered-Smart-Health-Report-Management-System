const Groq = require('groq-sdk');
const fs = require('fs');

class AIService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async extractText(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  }

  async generateSummary(extractedText) {
    if (!extractedText?.trim()) return 'No content available for summarization.';

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_...') {
      return `[Summary Preview] ${extractedText.slice(0, 200)}...`;
    }

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
