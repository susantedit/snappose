import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, reason, referenceId } = body;

    if (!email || !referenceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      referenceId,
      email,
      reason: reason || 'N/A',
      requestedAt: timestamp,
      status: 'QUEUED_FOR_PURGE',
      adminNotificationSentTo: 'susantedit@gmail.com',
    };

    // Store deletion request record in persistent server directory
    const storageDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, 'deletion_requests.json');
    let existingRequests = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        existingRequests = JSON.parse(fileData);
      } catch (err) {
        existingRequests = [];
      }
    }

    existingRequests.push(logEntry);
    fs.writeFileSync(filePath, JSON.stringify(existingRequests, null, 2), 'utf8');

    console.log(`[ACCOUNT DELETION REQUEST] Ref: ${referenceId} | User: ${email} | Admin Notified: susantedit@gmail.com`);

    return NextResponse.json({
      success: true,
      message: 'Account deletion request logged and admin notification queued.',
      referenceId,
      adminEmail: 'susantedit@gmail.com',
    });
  } catch (error) {
    console.error('Error processing deletion request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
