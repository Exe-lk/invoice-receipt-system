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
    const { proposalNo, invoiceNo, invoiceDate, dueDate, currency, subtotal, total, items } = body;

    if (!invoiceNo) {
      return NextResponse.json(
        { error: 'Invoice number is required' },
        { status: 400 }
      );
    }

    // Check if invoice number already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNo },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        proposalNo,
        invoiceNo,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        currency,
        subtotal,
        total,
        status: 'generated',
        items: {
          create: items.map((item: any) => ({
            type: item.type,
            description: item.description,
            status: item.status,
            taxes: item.taxes,
            date: new Date(item.date),
            amount: item.amount,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the invoice' },
      { status: 500 }
    );
  }
}
