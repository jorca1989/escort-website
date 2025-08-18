import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
      include: {
        media: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            questions: true,
          },
        },
      },
    });

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      age,
      city,
      height,
      weight,
      price,
      description,
      isVerified,
      isOnline,
    } = body;

    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        name,
        age,
        city,
        height,
        weight,
        price,
        description,
        isVerified,
        isOnline,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.profile.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 