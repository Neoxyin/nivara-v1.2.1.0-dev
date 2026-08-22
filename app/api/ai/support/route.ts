import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are Nivara AI Support Navigator, a warm, supportive, non-judgmental AI assistant designed to help university students navigate campus resources, wellbeing tools, counselling options, and academic pacing strategies.

CRITICAL CONSTRAINTS & BOUNDARIES:
1. NEVER diagnose students or offer medical/psychological treatment advice. If a student mentions severe distress, crisis, or mental health emergencies, immediately provide supportive crisis escalation options and direct them to campus counsellors or emergency resources.
2. NEVER determine, calculate, or promise financial eligibility, aid amounts, or financial awards.
3. NEVER make academic grading, standing, probation, or graduation decisions.
4. NEVER act as a disciplinary authority or take punitive action.
5. Always maintain a warm, calm, empathetic, and respectful tone. Help students break tasks into manageable steps and connect them with human support (counsellors, well-being guides, or peer support).
6. Structure your responses clearly with practical suggestions and actionable links or resource recommendations where relevant.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array provided.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if API key is not configured yet, ensuring graceful UX
      return NextResponse.json({
        reply: "Hello! I am your Nivara Support Navigator. While my live connection is currently establishing, I can remind you that you can always explore our campus well-being resources or schedule a confidential session with a counsellor in just a few clicks.",
        suggestions: ['Browse Well-being Resources', 'View Counsellors', 'Check Pacing Tips']
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format history or current prompt for generateContent
    const formattedPrompt = messages.map((m: { role: string; content: string }) => 
      `${m.role === 'user' ? 'Student' : 'Support Navigator'}: ${m.content}`
    ).join('\n') + '\nSupport Navigator:';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
        maxOutputTokens: 600,
      }
    });

    const reply = response.text || "I'm here to support you. Let me know how I can help you navigate campus resources today.";

    return NextResponse.json({
      reply,
      suggestions: [
        'How do I book a counsellor?',
        'Academic pacing tips',
        'Stress management guides',
        'Explore support resources'
      ]
    });

  } catch (error: any) {
    console.error('AI Support API Error:', error);
    return NextResponse.json(
      { 
        reply: "I encountered a brief moment of heavy traffic while connecting to the support navigator. Please take a deep breath, and feel free to reach out directly to our campus counsellors or explore our resource library.",
        error: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
