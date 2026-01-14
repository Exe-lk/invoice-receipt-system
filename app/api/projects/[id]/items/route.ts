import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { items } = body;

    // Note: This endpoint is for future use if you want to save items separately
    // Currently, items are saved when generating invoice

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving items:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving items' },
      { status: 500 }
    );
  }
}
