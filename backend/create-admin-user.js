const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function createAdminUser() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Check if admin user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
    
    if (existingUser) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
      console.log('👑 Role: Admin');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const result = await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['admin@example.com', hashedPassword, 'Admin User', 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Name: Admin User');
    console.log('👑 Role: Admin');
    console.log('🆔 User ID:', result.lastID);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdminUser(); 