import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  );

export async function POST(req) {
  try {
    console.log('📥 Incoming webhook request...');

    const body = await req.json();
    console.log('📦 Webhook payload received:', JSON.stringify(body, null, 2));

    const { type, data } = body;

    if (!['user.created', 'user.updated'].includes(type)) {
      console.log(`ℹ️ Skipping unhandled event type: ${type}`);
      return NextResponse.json({ message: 'Ignored event' }, { status: 200 });
    }

    if (!data) {
      console.warn('⚠️ Missing user data in webhook payload.');
      return NextResponse.json({ error: 'Missing user data' }, { status: 400 });
    }

    const email = data.email_addresses?.[0]?.email_address ?? null;
    const provider = data.external_accounts[0].provider ?? 'email' ;
    const fullName = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim();

    if (!email) {
      console.warn('⚠️ Missing email in Clerk user data:', data);
    }

    console.log('🧾 Preparing user sync to Supabase:', {
      clerk_id: data.id,
      email,
      name: fullName,
      provider,
    });

    const { error } = await supabase.from('users').upsert({
      clerk_id: data.id,
      email,
      name: fullName,
      provider,
    });

    if (error) {
      console.error('❌ Supabase upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ User synced successfully: ${email}`);
    return NextResponse.json({ status: '✅ User synced' }, { status: 200 });
  } catch (err) {
    console.error('🔥 Unexpected webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
