const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runTests() {
    const baseDir = __dirname;
    console.log('\n=== Running Test Suite ===');
    
    try {
        // Step 1: Check environment
        console.log('\n1. Checking environment...');
        require('./check_environment.js');
        
        // Step 2: Set up database
        console.log('\n2. Setting up database...');
        execSync('mysql -u root -p"PaperCut42@" < db_setup.sql', { 
            cwd: baseDir,
            stdio: 'inherit' 
        });
        
        // Step 3: Create test user
        console.log('\n3. Creating test user...');
        execSync('mysql -u root -p"PaperCut42@" recycling_db < ./tests/create_test_user.sql', { 
            cwd: baseDir,
            stdio: 'inherit'
        });
        
        // Step 4: Run login test
        console.log('\n4. Testing login...');
        require('./tests/test_login.js');
        
        // Step 5: Run payment setup test
        console.log('\n5. Testing payment setup...');
        require('./tests/test_payment_setup.js');
        
        console.log('\n=== All Tests Complete ===');
        
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

runTests();
