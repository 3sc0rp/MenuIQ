const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing MenuIQ API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    console.log('');

    // Test login endpoint
    console.log('2. Testing login endpoint...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Test dashboard with token
      console.log('\n3. Testing dashboard endpoint...');
      const dashboardResponse = await fetch('http://localhost:3001/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('✅ Dashboard:', dashboardData);
      } else {
        console.log('❌ Dashboard failed:', await dashboardResponse.text());
      }
    } else {
      console.log('❌ Login failed:', await loginResponse.text());
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI(); 