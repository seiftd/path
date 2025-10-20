import { NextRequest, NextResponse } from 'next/server';
import { analyzeIdea } from '@/lib/ai';
import { auth } from '@clerk/nextjs/server';

export const preferredRegion = ['pdx1', 'cle1', 'lhr1'];
export const dynamic = 'force-dynamic';

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
  } catch (error: any) {
    console.error('Error analyzing idea:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Failed to analyze idea';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
