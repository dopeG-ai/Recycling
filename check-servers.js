const http = require('http');

function checkServer(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(true);
    });

    req.on('error', (err) => {
      resolve(false);
    });
  });
}

async function checkServers() {
  console.log('Checking server status...');
  
  const backendRunning = await checkServer(5000);
  const frontendRunning = await checkServer(3000);

  console.log('\nServer Status:');
  console.log('--------------');
  console.log(`Backend (5000): ${backendRunning ? 'Running' : 'Not running'}`);
  console.log(`Frontend (3000): ${frontendRunning ? 'Running' : 'Not running'}`);
}

checkServers();
