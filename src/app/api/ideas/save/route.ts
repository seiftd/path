import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      text,
      name,
      country,
      founderName,
      email,
      founders,
      category,
      idea_type,
      field,
      competitors,
      bmcAnswers
    } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Idea text is required' },
        { status: 400 }
      );
    }

    // Get user's email from Clerk
    const userResult = await query(
      'SELECT email FROM users WHERE clerk_user_id = ?',
      [userId]
    );

    if (!Array.isArray(userResult) || userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const userEmail = userResult[0].email;

    // Check if idea already exists for this user
    const existingIdea = await query(
      'SELECT id FROM ideas WHERE clerk_user_id = ? AND text = ?',
      [userId, text]
    );

    let ideaId;

    if (Array.isArray(existingIdea) && existingIdea.length > 0) {
      // Update existing idea
      ideaId = existingIdea[0].id;
      await query(
        `UPDATE ideas 
         SET name = ?, country = ?, founder_name = ?, founder_email = ?, 
             founders = ?, category = ?, idea_type = ?, field = ?, 
             competitors = ?, bmc_answers = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          name || null,
          country || null,
          founderName || null,
          email || userEmail,
          founders ? JSON.stringify(founders) : null,
          category || 'General',
          idea_type || 'General',
          field || 'General',
          competitors || null,
          bmcAnswers ? JSON.stringify(bmcAnswers) : null,
          ideaId
        ]
      );
    } else {
      // Insert new idea
      const result = await query(
        `INSERT INTO ideas 
         (clerk_user_id, text, name, country, founder_name, founder_email, 
          founders, category, idea_type, field, competitors, bmc_answers, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          text,
          name || null,
          country || null,
          founderName || null,
          email || userEmail,
          founders ? JSON.stringify(founders) : null,
          category || 'General',
          idea_type || 'General',
          field || 'General',
          competitors || null,
          bmcAnswers ? JSON.stringify(bmcAnswers) : null
        ]
      );

      if (result && typeof result === 'object' && 'insertId' in result) {
        ideaId = result.insertId;
      } else {
        throw new Error('Failed to get insert ID');
      }
    }

    return NextResponse.json({
      success: true,
      ideaId,
      message: 'Idea saved successfully'
    });

  } catch (error) {
    console.error('Error saving idea:', error);
    return NextResponse.json(
      { error: 'Failed to save idea', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

