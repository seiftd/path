import { NextRequest, NextResponse } from 'next/server';
import { analyzeIdea } from '@/lib/ai';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaText, language } = await request.json();

    if (!ideaText) {
      return NextResponse.json({ error: 'Idea text is required' }, { status: 400 });
    }

    const analysis = await analyzeIdea(ideaText, language || 'en');

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing idea:', error);
    return NextResponse.json(
      { error: 'Failed to analyze idea' },
      { status: 500 }
    );
  }
}
