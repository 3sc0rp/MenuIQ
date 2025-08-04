// Test script for MenuIQ API
// Run with: node test-api.js

async function testAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing MenuIQ API...\n');

  // Test health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test login
  try {
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Login successful');
      console.log('🔑 Token received');
      
      const token = loginData.token;
      
      // Test dashboard endpoint
      console.log('\n3. Testing dashboard endpoint...');
      const dashboardResponse = await fetch(`${baseUrl}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const dashboardData = await dashboardResponse.json();
      if (dashboardData.success) {
        console.log('✅ Dashboard data:', dashboardData.stats);
      } else {
        console.log('❌ Dashboard failed:', dashboardData.error);
      }
      
      // Test menus endpoint
      console.log('\n4. Testing menus endpoint...');
      const menusResponse = await fetch(`${baseUrl}/api/menus`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const menusData = await menusResponse.json();
      if (menusData.success) {
        console.log('✅ Menus data:', menusData.menus.length, 'menus found');
      } else {
        console.log('❌ Menus failed:', menusData.error);
      }
      
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

testAPI(); 