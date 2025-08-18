import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalProfiles,
      totalReviews,
      totalMedia,
      totalQuestions,
      verifiedProfiles,
      onlineProfiles,
      profilesByCity,
      averageRating,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.review.count(),
      prisma.media.count(),
      prisma.question.count(),
      prisma.profile.count({ where: { isVerified: true } }),
      prisma.profile.count({ where: { isOnline: true } }),
      prisma.profile.groupBy({
        by: ['city'],
        _count: true,
      }),
      prisma.profile.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalProfiles,
      totalReviews,
      totalMedia,
      totalQuestions,
      verifiedProfiles,
      onlineProfiles,
      profilesByCity,
      averageRating: averageRating._avg.rating || 0,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 