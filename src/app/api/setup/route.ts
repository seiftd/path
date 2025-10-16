import { NextRequest, NextResponse } from 'next/server';
import { createTables, seedInitialData, testConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Create tables
    await createTables();
    
    // Seed initial data
    await seedInitialData();

    return NextResponse.json({ 
      message: 'Database setup completed successfully',
      tables: 'created',
      data: 'seeded'
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Failed to setup database', details: error.message },
      { status: 500 }
    );
  }
}
