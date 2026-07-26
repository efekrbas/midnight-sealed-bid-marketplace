import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, rating, text } = data;

    if (!text || !rating) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const feedbackEntry = `\n## Feedback Entry - ${timestamp}\n- **Type:** ${type}\n- **Rating:** ${rating} Stars\n- **Details:** ${text}\n`;

    // Attempt writing to local filesystem (works in local dev)
    try {
      const rootPath = path.resolve(process.cwd(), '..');
      const feedbackFilePath = path.join(rootPath, 'FEEDBACK.md');
      await fs.appendFile(feedbackFilePath, feedbackEntry, 'utf8');
    } catch (fsErr) {
      // Vercel serverless functions have a read-only filesystem (except /tmp)
      console.log('Serverless read-only environment detected. Falling back to /tmp:', fsErr);
      try {
        const tmpPath = path.join('/tmp', 'FEEDBACK.md');
        await fs.appendFile(tmpPath, feedbackEntry, 'utf8');
      } catch (tmpErr) {
        console.log('Feedback recorded in serverless logs:', timestamp, type, rating, text);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Feedback recorded successfully!",
      data: { type, rating, text, timestamp }
    });
  } catch (error: unknown) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ success: false, error: "Failed to process feedback" }, { status: 500 });
  }
}
