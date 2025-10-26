const mysql = require('mysql2/promise');

// Test different connection configurations
const configs = [
  {
    name: 'Localhost Configuration',
    config: {
      host: 'localhost',
      user: 'u984847094_foundyourpath',
      password: 'Seif0674&',
      database: 'u984847094_foundyourpath',
      port: 3306
    }
  },
  {
    name: 'Hostinger Remote Configuration',
    config: {
      host: 'mysql.hostinger.com',
      user: 'u984847094_foundyourpath',
      password: 'Seif0674&',
      database: 'u984847094_foundyourpath',
      port: 3306
    }
  },
  {
    name: 'Alternative Host Configuration',
    config: {
      host: 'mysql.hostinger.com',
      user: 'u984847094_foundyourpath',
      password: 'Seif0674&',
      database: 'u984847094_foundyourpath',
      port: 3306,
      ssl: false
    }
  }
];

async function testConnections() {
  for (const { name, config } of configs) {
    console.log(`\n🔍 Testing ${name}...`);
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log('   ✅ Connection successful!');
      
      // Test a simple query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('   ✅ Query test successful!');
      
      // Show database info
      const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db');
      console.log(`   📊 Current database: ${dbInfo[0].current_db}`);
      
      await connection.end();
      console.log('   🔌 Connection closed');
      
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
    }
  }
}

console.log('🚀 Testing Hostinger Database Connections...');
testConnections().then(() => {
  console.log('\n✅ Connection testing completed');
}).catch(error => {
  console.error('❌ Testing failed:', error);
});
