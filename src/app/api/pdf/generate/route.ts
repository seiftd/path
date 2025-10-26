import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generatePDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pdfData = await request.json();

    if (!pdfData) {
      return NextResponse.json({ error: 'PDF data is required' }, { status: 400 });
    }

    const pdfBlob = await generatePDF(pdfData);
    const buffer = await pdfBlob.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="business-blueprint.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
