import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const city = formData.get('city') as string;
    const age = parseInt(formData.get('age') as string);
    const phone = formData.get('phone') as string;
    const price = parseFloat(formData.get('price') as string);
    const services = formData.get('services') as string;
    const photos = formData.getAll('photos') as File[];

    // Validate required fields
    if (!title || !description || !city || !age || !phone || !price) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        city,
        age,
        phone,
        price,
        services: services || '',
        status: 'ACTIVE',
        isPremium: false,
        userId: user.id
      }
    });

    // Handle photo uploads (simplified - in production you'd upload to cloud storage)
    if (photos.length > 0) {
      const mediaPromises = photos.slice(0, 5).map(async (photo, index) => {
        // In a real app, you'd upload to S3, Cloudinary, etc.
        // For now, we'll just store the filename
        const filename = `listing-${listing.id}-${index}-${Date.now()}.jpg`;
        
        return prisma.media.create({
          data: {
            url: `/uploads/${filename}`,
            type: 'IMAGE',
            listingId: listing.id
          }
        });
      });

      await Promise.all(mediaPromises);
    }

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        status: listing.status
      }
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 