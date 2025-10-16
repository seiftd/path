import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createUser, getUserById } from '@/lib/db';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const headerPayload = await headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { type, data } = evt;

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name } = data;
    
    await createUser({
      id,
      email: email_addresses[0]?.email_address || '',
      firstName: first_name || '',
      lastName: last_name || '',
      language: 'en'
    });

    console.log(`✅ User created: ${id}`);
  } catch (error) {
    console.error('Error handling user.created:', error);
  }
}

async function handleUserUpdated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name } = data;
    
    const connection = await import('@/lib/db').then(m => m.default);
    await connection.execute(
      'UPDATE users SET email = ?, first_name = ?, last_name = ? WHERE id = ?',
      [
        email_addresses[0]?.email_address || '',
        first_name || '',
        last_name || '',
        id
      ]
    );

    console.log(`✅ User updated: ${id}`);
  } catch (error) {
    console.error('Error handling user.updated:', error);
  }
}

async function handleUserDeleted(data: any) {
  try {
    const { id } = data;
    
    const connection = await import('@/lib/db').then(m => m.default);
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);

    console.log(`✅ User deleted: ${id}`);
  } catch (error) {
    console.error('Error handling user.deleted:', error);
  }
}
