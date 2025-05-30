# Installation Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/myownipgit/ai-supplier-report-poc.git
   cd ai-supplier-report-poc
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Add the database file**
   - Place `suppliers.db` in the project root directory
   - The setup script will copy it to the appropriate locations

4. **Start the application**
   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Manual Installation

If you prefer to set up manually:

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite database file (suppliers.db)

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:
1. Stop the conflicting services
2. Or modify the ports in the .env files

### Database Connection Issues
1. Ensure suppliers.db is in the backend directory
2. Check file permissions
3. Verify SQLite is accessible

### Frontend Build Issues
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check Node.js version compatibility

## Development Mode

For development with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./suppliers.db
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## Testing the Application

Once installed, test the application with these prompts:

1. **"Hi I'm the Head of Manufacturing, create a consolidation report"**
2. **"CFO needs supplier risk assessment with financial impact"**
3. **"Executive summary of supplier performance for board meeting"**
4. **"Procurement manager wants detailed spend analytics"**

## API Endpoints

The backend provides these endpoints:

- `GET /api/supplier-stats` - Basic supplier statistics
- `GET /api/top-vendors` - Top vendors by spend
- `GET /api/spend-by-category` - Spend breakdown by category
- `GET /api/spend-trends` - Monthly spend trends
- `POST /api/generate-report` - Generate role-specific reports

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend/.env
2. Build the frontend: `cd frontend && npm run build`
3. Configure proper database security
4. Add authentication and authorization
5. Enable HTTPS and proper CORS settings
6. Set up monitoring and logging