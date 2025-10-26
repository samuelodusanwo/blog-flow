const fs = require('fs');
const crypto = require('crypto');

function setupProject() {
    // Generate JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    
    // Create .env file content
    const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=30d
`;
    
    // Write to .env file
    fs.writeFileSync('.env', envContent);
    
    // Create .gitignore if it doesn't exist
    const gitignoreContent = `# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/
`;
    
    if (!fs.existsSync('.gitignore')) {
        fs.writeFileSync('.gitignore', gitignoreContent);
    }
    
    console.log('✅ Project setup complete!');
    console.log('📁 .env file created with JWT secret');
    console.log('📁 .gitignore file created');
    console.log('🚀 Run "npm run dev" to start the server');
}

setupProject();