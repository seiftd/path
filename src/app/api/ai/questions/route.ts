import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/ai';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaText, category, language } = await request.json();

    if (!ideaText || !category) {
      return NextResponse.json({ error: 'Idea text and category are required' }, { status: 400 });
    }

    const questions = await generateQuestions(ideaText, category, language || 'en');

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
