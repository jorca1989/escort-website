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
    
    // Basic info
    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string);
    const city = formData.get('city') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;
    
    // Physical details
    const gender = formData.get('gender') as string;
    const preference = formData.get('preference') as string;
    const weight = formData.get('weight') as string;
    const height = formData.get('height') as string;
    const ethnicity = formData.get('ethnicity') as string;
    const eyeColor = formData.get('eyeColor') as string;
    const hair = formData.get('hair') as string;
    const shoeSize = formData.get('shoeSize') as string;
    const silicone = formData.get('silicone') as string;
    const tattoos = formData.get('tattoos') as string;
    const piercings = formData.get('piercings') as string;
    const smoker = formData.get('smoker') as string;
    const languages = formData.get('languages') as string;
    
    // Services and additional details
    const services = JSON.parse(formData.get('services') as string || '[]');
    const minDuration = formData.get('minDuration') as string;
    const advanceNotice = formData.get('advanceNotice') as string;
    const acceptsCard = formData.get('acceptsCard') as string;
    const regularDiscount = formData.get('regularDiscount') as string;
    
    // Pricing (optional)
    const pricing = JSON.parse(formData.get('pricing') as string || '{}');
    const showPricing = formData.get('showPricing') === 'true';
    
    // Photos
    const photos = formData.getAll('photos') as File[];

    // Validate required fields
    if (!name || !age || !city || !phone || !description) {
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

    // Create or update profile
    let profile = user.profile;
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          name,
          age,
          city,
          description,
          phone,
          gender: gender || null,
          preference: preference || null,
          weight: weight || null,
          height: height || null,
          ethnicity: ethnicity || null,
          eyeColor: eyeColor || null,
          hair: hair || null,
          shoeSize: shoeSize || null,
          silicone: silicone || null,
          tattoos: tattoos || null,
          piercings: piercings || null,
          smoker: smoker || null,
          languages: languages || null,
          bio: description,
          location: city,
        }
      });
    } else {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name,
          age,
          city,
          description,
          phone,
          gender: gender || null,
          preference: preference || null,
          weight: weight || null,
          height: height || null,
          ethnicity: ethnicity || null,
          eyeColor: eyeColor || null,
          hair: hair || null,
          shoeSize: shoeSize || null,
          silicone: silicone || null,
          tattoos: tattoos || null,
          piercings: piercings || null,
          smoker: smoker || null,
          languages: languages || null,
          bio: description,
          location: city,
        }
      });
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        title: `${name} - ${city}`,
        description,
        city,
        location: city,
        age,
        phone,
        services: services.join(', '),
        status: 'ACTIVE',
        isPremium: false,
        userId: user.id
      }
    });

    // Handle photo uploads (simplified - in production you'd upload to cloud storage)
    if (photos.length > 0) {
      const mediaPromises = photos.slice(0, 10).map(async (photo, index) => {
        // In a real app, you'd upload to S3, Cloudinary, etc.
        // For now, we'll just store the filename
        const filename = `profile-${profile.id}-${index}-${Date.now()}.jpg`;
        
        return prisma.media.create({
          data: {
            url: `/uploads/${filename}`,
            type: 'PHOTO',
            profileId: profile.id
          }
        });
      });

      await Promise.all(mediaPromises);
    }

    // Store pricing information if provided
    if (showPricing && pricing) {
      // You might want to create a separate pricing table or store as JSON
      // For now, we'll store it in the listing description
      const pricingInfo = `\n\nPreços:\nLocal: 1h €${pricing.local?.oneHour || 'N/A'}, 2h €${pricing.local?.twoHours || 'N/A'}, Pernoite €${pricing.local?.overnight || 'N/A'}\nDeslocação: 1h €${pricing.travel?.oneHour || 'N/A'}, 2h €${pricing.travel?.twoHours || 'N/A'}, Pernoite €${pricing.travel?.overnight || 'N/A'}`;
      
      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          description: listing.description + pricingInfo
        }
      });
    }

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        status: listing.status
      },
      profile: {
        id: profile.id,
        name: profile.name
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