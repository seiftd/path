import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user ideas from database
    const [ideas] = await pool.execute(
      `SELECT 
        i.id, 
        i.text, 
        i.category, 
        i.idea_type, 
        i.created_at
      FROM ideas i
      INNER JOIN users u ON i.user_id = u.id
      WHERE u.clerk_user_id = ?
      ORDER BY i.created_at DESC
      LIMIT 10`,
      [userId]
    );

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

