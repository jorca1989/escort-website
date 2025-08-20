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
    const neighborhood = formData.get('neighborhood') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;
    const whatsappEnabled = formData.get('whatsappEnabled') === 'true';
    const telegramEnabled = formData.get('telegramEnabled') === 'true';
    
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
    
    // NEW: Additional physical attributes
    const bodyType = formData.get('bodyType') as string;
    const hairColor = formData.get('hairColor') as string;
    const breastSize = formData.get('breastSize') as string;
    const breastType = formData.get('breastType') as string;
    const personalityTags = JSON.parse(formData.get('personalityTags') as string || '[]');
    
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

    // Handle media files properly
    const galleryMedia = formData.getAll('galleryMedia') as File[];
    const comparisonMedia = formData.getAll('comparisonMedia') as File[];
    
    console.log('Files received:', {
      photos: photos.length,
      galleryMedia: galleryMedia.length,
      comparisonMedia: comparisonMedia.length
    });

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
          neighborhood: neighborhood || null,
          description,
          phone,
          whatsappEnabled,
          telegramEnabled,
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
          bodyType: bodyType || null,
          hairColor: hairColor || null,
          breastSize: breastSize || null,
          breastType: breastType || null,
          personalityTags,
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
          neighborhood: neighborhood || null,
          description,
          phone,
          whatsappEnabled,
          telegramEnabled,
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
          bodyType: bodyType || null,
          hairColor: hairColor || null,
          breastSize: breastSize || null,
          breastType: breastType || null,
          personalityTags,
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
    const allMedia = [
      ...photos.map(file => ({ file, type: 'GALLERY' })),
      ...galleryMedia.map(file => ({ file, type: 'GALLERY' })),
      ...comparisonMedia.map(file => ({ file, type: 'COMPARISON' }))
    ];

    console.log('Total media files to process:', allMedia.length);

    if (allMedia.length > 0) {
      const mediaPromises = allMedia.slice(0, 10).map(async (mediaItem, index) => {
        try {
          const { file, type } = mediaItem;
          
          console.log(`Processing file ${index}:`, {
            name: file.name,
            type: file.type,
            size: file.size,
            mediaType: type
          });
          
          // Determine media type based on file type
          const isVideo = file.type.startsWith('video/');
          const mediaType = isVideo ? 'VIDEO' : 'IMAGE';
          
          // In a real app, you'd upload to S3, Cloudinary, etc.
          // For now, we'll just store the filename and create media records
          const extension = isVideo ? '.mp4' : '.jpg';
          const filename = `profile-${profile.id}-${type}-${index}-${Date.now()}${extension}`;
          
          console.log(`Creating media record for: ${filename}`);
          
          // Create media record for the profile
          const mediaRecord = await prisma.media.create({
            data: {
              url: `/uploads/${filename}`,
              type: mediaType,
              profileId: profile.id,
              listingId: null // This is for profile gallery
            }
          });
          
          console.log(`Successfully created media record:`, mediaRecord.id);
          return mediaRecord;
        } catch (error) {
          console.error(`Error creating media record for file ${index}:`, error);
          // Continue with other files even if one fails
          return null;
        }
      });

      // Wait for all media records to be created
      const mediaResults = await Promise.all(mediaPromises);
      const successfulMedia = mediaResults.filter(r => r !== null);
      console.log(`Successfully created ${successfulMedia.length} out of ${allMedia.length} media records`);
    }

    // Store pricing information if provided
    if (showPricing && pricing) {
      let pricingInfo = `\n\nPreços:\n`;
      
      // Add minimum duration pricing if selected
      if (pricing.local?.fifteenMin) {
        pricingInfo += `Local 15min: €${pricing.local.fifteenMin}\n`;
      }
      if (pricing.local?.thirtyMin) {
        pricingInfo += `Local 30min: €${pricing.local.thirtyMin}\n`;
      }
      if (pricing.travel?.fifteenMin) {
        pricingInfo += `Deslocação 15min: €${pricing.travel.fifteenMin}\n`;
      }
      if (pricing.travel?.thirtyMin) {
        pricingInfo += `Deslocação 30min: €${pricing.travel.thirtyMin}\n`;
      }
      
      // Add regular pricing
      pricingInfo += `Local: 1h €${pricing.local?.oneHour || 'N/A'}, 2h €${pricing.local?.twoHours || 'N/A'}, Pernoite €${pricing.local?.overnight || 'N/A'}\n`;
      pricingInfo += `Deslocação: 1h €${pricing.travel?.oneHour || 'N/A'}, 2h €${pricing.travel?.twoHours || 'N/A'}, Pernoite €${pricing.travel?.overnight || 'N/A'}`;
      
      await prisma.listing.update({ where: { id: listing.id }, data: { description: listing.description + pricingInfo } });
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
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 