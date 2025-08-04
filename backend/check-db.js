const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function checkDatabase() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Check if users table exists and has correct schema
    const tableInfo = await db.all("PRAGMA table_info(users)");
    console.log('📋 Current users table schema:');
    tableInfo.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });

    // Check if name column exists
    const hasNameColumn = tableInfo.some(col => col.name === 'name');
    
    if (!hasNameColumn) {
      console.log('🔧 Adding missing name column...');
      await db.run('ALTER TABLE users ADD COLUMN name TEXT');
      console.log('✅ Name column added');
    }

    // Check if role column exists
    const hasRoleColumn = tableInfo.some(col => col.name === 'role');
    
    if (!hasRoleColumn) {
      console.log('🔧 Adding missing role column...');
      await db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
      console.log('✅ Role column added');
    }

    console.log('✅ Database schema is now correct');

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkDatabase(); 