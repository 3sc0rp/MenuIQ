const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function createTestUser() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Check if test user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', ['test@example.com']);
    
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: password123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create test user
    const result = await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['test@example.com', hashedPassword, 'Test User', 'user']
    );

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('👤 Name: Test User');
    console.log('🆔 User ID:', result.lastID);

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
}

createTestUser(); 