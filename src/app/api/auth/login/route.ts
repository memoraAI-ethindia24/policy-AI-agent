import { NextResponse } from 'next/server';
import * as stytch from 'stytch';

const client = new stytch.Client({
  project_id: process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID!,
  secret: process.env.STYTCH_SECRET_KEY!,
});

export async function POST(request: Request) {
    try {
        const { email, txHash } = await request.json();
        console.log("🔄 Sending magic link to:", email, "for transaction:", txHash);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        
        const params = {
            email,
            login_magic_link_url: `${baseUrl}/pages/authenticate?txHash=${txHash}`,
            signup_magic_link_url: `${baseUrl}/pages/authenticate?txHash=${txHash}`,
            login_expiration_minutes: 60,
            signup_expiration_minutes: 60
        };

        const response = await client.magicLinks.email.loginOrCreate(params);
        console.log("✅ Magic link created");
        
        return NextResponse.json({ 
            success: true,
            message: "Magic link sent successfully"
        });
        
    } catch (error) {
        console.error('Login failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to send magic link' 
        });
    }
} 