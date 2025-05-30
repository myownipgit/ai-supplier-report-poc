# AI Supplier Report Generator PoC

A proof-of-concept application that demonstrates intelligent supplier report generation using natural language prompts and real supplier database integration.

## 🚀 Overview

This PoC showcases how AI can transform supplier data into actionable business intelligence, with each stakeholder receiving reports tailored to their specific needs and decision-making authority.

### Key Features

- **🎯 Intelligent Prompt Processing**: Automatically detects roles and report types from natural language
- **📊 Real Data Insights**: Uses actual supplier database with $516M in spend data  
- **🚨 Risk Assessment**: Identifies critical single-source dependencies
- **💰 Financial Impact**: Calculates real consolidation and optimization opportunities
- **📈 Interactive Visualizations**: Dynamic charts that adapt to different report types
- **🔄 Scalable Architecture**: Modular design ready for production deployment

## 📊 Database Overview

The PoC integrates with a real supplier database containing:
- **2,718 active suppliers** managing **$516M in total spend**
- **72,853 transactions** across various commodity categories
- **Major risk identified**: SUN COAST RESOURCES INC as single-source supplier for $29.7M in fuel commodities
- **Consolidation opportunities**: Manufacturing suppliers with potential $8.7M savings

## 🛠 Project Structure

```
ai-supplier-report-poc/
├── frontend/                 # React.js application
│   └── src/AIReportGenerator.jsx # Main React component
├── backend/                  # Node.js API service
│   ├── supplier-data-service.js
│   └── package.json
├── scripts/                  # Utility scripts
│   └── database-integration-demo.js
├── docs/                     # Documentation
├── README.md                 # This file
└── PROJECT_OVERVIEW.md       # Detailed project overview
```

## 🧪 Test Prompts

The application supports these test scenarios:

1. **"Hi I'm the Head of Manufacturing, create a consolidation report"**
   - Identifies TECHLINE INC ($30.3M) and OLDCASTLE MATERIALS ($12.9M) as key consolidation targets
   - Shows potential $8.7M savings through supplier consolidation

2. **"CFO needs supplier risk assessment with financial impact"**
   - Highlights $38.5M in single-source risk exposure (7.5% of total spend)
   - Identifies SUN COAST RESOURCES as critical risk with $29.7M exposure

3. **"Executive summary of supplier performance for board meeting"**
   - Presents high-level KPIs: $516M spend across 2,718 suppliers
   - Shows top 5 suppliers represent 21.3% of total spend concentration

4. **"Procurement manager wants detailed spend analytics"**
   - Breaks down spend into Major (79.91%) vs Tail (20.09%) categories
   - Identifies price variation opportunities across commodity groups

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- React development environment
- SQLite database (suppliers.db)

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

### Demo Script
```bash
cd scripts
node database-integration-demo.js
```

## 📡 API Endpoints

The backend service provides the following endpoints:

- `GET /api/supplier-stats` - Basic supplier statistics
- `GET /api/top-vendors` - Top vendors by spend
- `GET /api/spend-by-category` - Spend breakdown by category
- `GET /api/spend-trends` - Monthly spend trends
- `POST /api/generate-report` - Generate role-specific reports

## 🎨 Frontend Features

- **Natural Language Interface**: Enter requests in plain English
- **Role-Based Reports**: Automatically detects user role and adapts content
- **Interactive Charts**: Uses Recharts for data visualization
- **Report History**: Quick access to previously generated reports
- **Responsive Design**: Works across desktop and mobile devices

## 📈 Real Data Integration

The PoC demonstrates integration with actual supplier data:

### Top Suppliers by Spend
1. TECHLINE INC - $30.3M (5,772 transactions)
2. SUN COAST RESOURCES INC - $29.7M (501 transactions)
3. TEXAS ELECTRIC COOPERATIVES - $24.5M (1,165 transactions)

### Risk Assessment Findings
- **Single-Source Risk**: $38.5M exposure (7.5% of total spend)
- **Critical Supplier**: SUN COAST RESOURCES INC ($29.7M across multiple fuel types)
- **Diversification Needed**: 15+ commodities with limited supplier options

## 🔧 Technical Architecture

### Frontend (React.js)
- Component-based architecture
- State management with React hooks
- Recharts for data visualization
- Tailwind CSS for styling

### Backend (Node.js + Express)
- RESTful API design
- SQLite database integration
- Role-based report generation
- Error handling and logging

### Database Integration
- Real-time querying of supplier data
- Complex SQL joins for insights
- Performance optimization for large datasets

## 🛡 Security Considerations

For production deployment:
- Implement authentication and authorization
- Add input validation and sanitization
- Enable CORS restrictions
- Add rate limiting
- Implement audit logging

## 🔮 Future Enhancements

1. **Enhanced AI Processing**: Integrate with LLM APIs for more sophisticated report generation
2. **Real-time Updates**: Connect to live procurement systems for current data
3. **Advanced Analytics**: Add predictive modeling for supplier performance
4. **Integration Capabilities**: Connect with ERP systems, procurement platforms, and BI tools
5. **Mobile App**: Native mobile application for executive dashboards

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Note**: This is a proof-of-concept application. For production use, additional security, scalability, and reliability measures should be implemented.
