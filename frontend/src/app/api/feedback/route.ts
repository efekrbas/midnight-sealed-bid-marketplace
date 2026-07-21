import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, rating, text } = data;

    const feedbackEntry = `\n## Feedback Entry - ${new Date().toISOString()}\n- **Type:** ${type}\n- **Rating:** ${rating} Stars\n- **Details:** ${text}\n`;

    // Write to the root project folder (two levels up from frontend)
    // Wait, __dirname in Next.js might be inside .next/server. Using path.resolve is better.
    const rootPath = path.resolve(process.cwd(), '..');
    const feedbackFilePath = path.join(rootPath, 'FEEDBACK.md');

    await fs.appendFile(feedbackFilePath, feedbackEntry, 'utf8');

    return NextResponse.json({ success: true, message: "Feedback saved!" });
  } catch (error: unknown) {
    console.error('Feedback write error:', error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
