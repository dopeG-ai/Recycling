const axios = require('axios');

async function testServers() {
    console.log('Testing backend server...');
    try {
        const backendResponse = await axios.get('http://localhost:5000/api/test');
        console.log('Backend server response:', backendResponse.data);
    } catch (error) {
        console.error('Backend server error:', error.message);
    }

    console.log('\nTesting frontend server...');
    try {
        const frontendResponse = await axios.get('http://localhost:3000');
        console.log('Frontend server is running');
    } catch (error) {
        console.error('Frontend server error:', error.message);
    }
}

testServers();
