// Script to grant premium subscription to users
// Run with: node grant-premium.js

const emails = [
  'loifortunss@gmail.com',
  'nasrosardouk@gmail.com'
];

async function grantPremium() {
  console.log('🚀 Granting premium subscriptions...\n');
  
  for (const email of emails) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/grant-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          plan: 'pro',
          months: 1
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${email}: ${data.message}`);
      } else {
        console.log(`❌ ${email}: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ ${email}: ${error.message}`);
    }
  }
  
  console.log('\n✨ Done!');
}

grantPremium();

