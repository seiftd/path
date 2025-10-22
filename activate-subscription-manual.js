// Manual script to activate subscription for a user who paid
const mysql = require('mysql2/promise');

async function activateSubscription(email) {
  // Database configuration
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foundyourpath',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log(`🔍 Looking for user with email: ${email}`);

    // Get user by email
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name FROM users WHERE email = ?',
      [email]
    );

    if (!users || users.length === 0) {
      console.error(`❌ User not found for email: ${email}`);
      console.log('💡 Make sure the user has logged in at least once so their account is created.');
      return;
    }

    const user = users[0];
    console.log(`✅ Found user:`, user);

    // Check if subscription already exists
    const [existingSubs] = await connection.execute(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ?',
      [user.id, 'active']
    );

    if (existingSubs && existingSubs.length > 0) {
      console.log('⚠️  User already has an active subscription:', existingSubs[0]);
      console.log('   To extend it, run: UPDATE subscriptions SET end_date = DATE_ADD(end_date, INTERVAL 1 MONTH) WHERE id = ?');
      return;
    }

    // Create Pro subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscriptionId = `sub_${Date.now()}`;

    await connection.execute(
      `INSERT INTO subscriptions 
       (id, user_id, plan, status, start_date, end_date, ideas_limit, pdfs_limit, ideas_used, pdfs_used, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        subscriptionId,
        user.id,
        'pro',
        'active',
        startDate,
        endDate,
        50,  // 50 ideas for Pro
        20,  // 20 PDFs for Pro
        0,
        0
      ]
    );

    console.log('✅ Pro subscription activated successfully!');
    console.log('📋 Subscription Details:');
    console.log('   - ID:', subscriptionId);
    console.log('   - User:', user.email);
    console.log('   - Plan: Pro Monthly');
    console.log('   - Start Date:', startDate.toISOString());
    console.log('   - End Date:', endDate.toISOString());
    console.log('   - Ideas Limit: 50/month');
    console.log('   - PDFs Limit: 20/month');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node activate-subscription-manual.js <user-email>');
  console.log('Example: node activate-subscription-manual.js user@example.com');
  process.exit(1);
}

// Run the function
activateSubscription(email);

