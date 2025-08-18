import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, accountType, ...profileData } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: accountType === 'escort' ? 'ESCORT' : 'USER',
        },
      });

      // If escort, create profile
      if (accountType === 'escort') {
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            name: profileData.profileName,
            age: parseInt(profileData.age),
            city: profileData.city,
            description: profileData.description,
            // Handle profile photo upload separately
          },
        });
        return { user, profile };
      }

      return { user };
    });

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        userId: result.user.id,
        role: result.user.role
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 