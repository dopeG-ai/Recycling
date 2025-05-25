// Check environment setup
const os = require('os');
const { execSync } = require('child_process');

function checkEnvironment() {
    console.log('\n=== Environment Check ===');
    
    // Check Node.js
    console.log('\nNode.js Version:', process.version);
    
    // Check npm
    try {
        const npmVersion = execSync('npm -v').toString().trim();
        console.log('npm Version:', npmVersion);
    } catch (error) {
        console.error('❌ npm not found:', error.message);
    }
    
    // Check MySQL
    try {
        execSync('mysql --version');
        console.log('✅ MySQL is installed');
    } catch (error) {
        console.error('❌ MySQL not found:', error.message);
    }
    
    // Check environment variables
    console.log('\nEnvironment Variables:');
    console.log('PATH:', process.env.PATH);
    
    // Check directory permissions
    const currentDir = process.cwd();
    console.log('\nCurrent Directory:', currentDir);
    
    console.log('\n=== Check Complete ===');
}

checkEnvironment();
