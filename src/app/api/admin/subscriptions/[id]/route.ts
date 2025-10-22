import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await query(
      'DELETE FROM subscriptions WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (body.plan) {
      updates.push('plan = ?');
      values.push(body.plan);
    }
    if (body.status) {
      updates.push('status = ?');
      values.push(body.status);
    }
    if (body.ideas_limit !== undefined) {
      updates.push('ideas_limit = ?');
      values.push(body.ideas_limit);
    }
    if (body.pdfs_limit !== undefined) {
      updates.push('pdfs_limit = ?');
      values.push(body.pdfs_limit);
    }
    if (body.end_date) {
      updates.push('end_date = ?');
      values.push(body.end_date);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await query(
      `UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

