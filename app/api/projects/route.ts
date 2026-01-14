import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        members: true,
        invoices: {
          include: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, type, projectType, description, clientName, companyName, country, totalAmount, members } = body;

    // Validate required fields
    if (!name || !type || !projectType || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create project with members if group project
    const project = await prisma.project.create({
      data: {
        name,
        type,
        projectType,
        description,
        clientName,
        companyName,
        country: country || 'Sri Lanka',
        totalAmount: totalAmount || 0,
        userId,
        members: projectType === 'group' && members ? {
          create: members.map((member: any) => ({
            name: member.name,
            contact: member.contact,
          })),
        } : undefined,
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the project' },
      { status: 500 }
    );
  }
}
