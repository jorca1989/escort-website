import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Only return active listings to the public
    if (listing.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Listing not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if listing exists and user owns it
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id }
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (existingListing.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this listing' },
        { status: 403 }
      );
    }

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        city: body.city,
        age: body.age,
        phone: body.phone,
        services: body.services,
      }
    });

    // Update profile if provided
    if (body.user?.profile) {
      await prisma.profile.update({
        where: { userId: decoded.userId },
        data: {
          name: body.user.profile.name,
          description: body.user.profile.description,
          // Add other profile fields as needed
        }
      });
    }

    return NextResponse.json({
      success: true,
      listing: updatedListing
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 