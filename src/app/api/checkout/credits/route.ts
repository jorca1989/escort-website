import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const CREDIT_PRICES = {
  'credits_10': 'price_credits_10', // You'll need to create these in Stripe
  'credits_25': 'price_credits_25',
  'credits_50': 'price_credits_50',
};

export async function POST(req: Request) {
  try {
    const { package: creditPackage, email } = await req.json();
    
    if (!creditPackage || !email) {
      return NextResponse.json({ error: 'Missing package or email' }, { status: 400 });
    }

    const priceId = CREDIT_PRICES[creditPackage as keyof typeof CREDIT_PRICES];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid credit package' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/precos?success=credits`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/precos?canceled=credits`,
      metadata: {
        package: creditPackage,
        type: 'credits_purchase',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe credits checkout error:', error);
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
  }
} 