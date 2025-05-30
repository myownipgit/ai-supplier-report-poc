#!/bin/bash

# AI Supplier Report Generator PoC - Setup Script
# This script sets up the development environment for the PoC

echo "🚀 Setting up AI Supplier Report Generator PoC..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Create project directories if they don't exist
echo "📁 Creating project directories..."
mkdir -p frontend/src
mkdir -p frontend/public
mkdir -p backend
mkdir -p scripts
mkdir -p docs
mkdir -p data

# Backend setup
echo "🔧 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "📦 Initializing backend package.json..."
    npm init -y
    npm install express sqlite3 cors
    npm install --save-dev nodemon
fi

echo "📦 Installing backend dependencies..."
npm install

cd ..

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "📦 Creating React app..."
    npx create-react-app . --template typescript
    npm install recharts
    npm install --save-dev @types/react @types/node
fi

cd ..

# Copy suppliers.db if it exists
if [ -f "suppliers.db" ]; then
    echo "📊 Copying database file..."
    cp suppliers.db backend/
    cp suppliers.db data/
else
    echo "⚠️  suppliers.db not found. Please ensure the database file is available."
fi

# Create .env files
echo "⚙️  Creating environment configuration..."

# Backend .env
cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
DATABASE_PATH=./suppliers.db
EOF

# Frontend .env
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
EOF

# Create .gitignore
echo "📄 Creating .gitignore..."
cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/build
/dist
*.log

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Create startup scripts
echo "🚀 Creating startup scripts..."

# Backend start script
cat > backend/start.sh << EOF
#!/bin/bash
echo "🔧 Starting Supplier Data Service..."
npm start
EOF

chmod +x backend/start.sh

# Frontend start script
cat > frontend/start.sh << EOF
#!/bin/bash
echo "🎨 Starting React Frontend..."
npm start
EOF

chmod +x frontend/start.sh

# Full application start script
cat > start-all.sh << EOF
#!/bin/bash
echo "🚀 Starting AI Supplier Report Generator PoC..."
echo "=============================================="

# Start backend in background
echo "🔧 Starting backend service..."
cd backend && npm start &
BACKEND_PID=\\$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend application..."
cd ../frontend && npm start &
FRONTEND_PID=\\$!

echo "✅ Application started!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user input to stop
trap 'kill \\$BACKEND_PID \\$FRONTEND_PID; exit' INT
wait
EOF

chmod +x start-all.sh

echo ""
echo "✅ Setup completed successfully!"
echo "================================"
echo ""
echo "📁 Project structure created:"
echo "   ├── frontend/     (React.js application)"
echo "   ├── backend/      (Node.js API service)"
echo "   ├── scripts/      (Utility scripts)"
echo "   ├── docs/         (Documentation)"
echo "   └── data/         (Database files)"
echo ""
echo "🚀 Next steps:"
echo "   1. Place suppliers.db in the project root"
echo "   2. Run './start-all.sh' to start both services"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "=================================================="