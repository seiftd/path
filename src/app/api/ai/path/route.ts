import { NextRequest, NextResponse } from 'next/server';
import { generatePathContent } from '@/lib/ai';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const preferredRegion = ['pdx1', 'cle1', 'lhr1'];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaData, answers, language } = await request.json();

    if (!ideaData) {
      return NextResponse.json({ error: 'Idea data is required' }, { status: 400 });
    }

    const pathContent = await generatePathContent(ideaData, language || 'en');

    return NextResponse.json(pathContent);
  } catch (error: any) {
    console.error('Error generating path content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate path content' },
      { status: 500 }
    );
  }
}
