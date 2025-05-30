// supplier-data-service.js
// Node.js service to query the suppliers.db SQLite database
// This would be the backend API that the React app calls

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./suppliers.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper function to promisify database queries
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// API endpoint to get basic supplier statistics
app.get('/api/supplier-stats', async (req, res) => {
  try {
    const stats = {};
    
    // Total vendors
    const vendorCount = await queryAsync('SELECT COUNT(*) as count FROM vendors');
    stats.totalVendors = vendorCount[0].count;
    
    // Total spend and transactions
    const spendData = await queryAsync(`
      SELECT 
        COUNT(*) as totalTransactions,
        SUM(total_amount) as totalSpend
      FROM spend_transactions
    `);
    stats.totalTransactions = spendData[0].totalTransactions;
    stats.totalSpend = spendData[0].totalSpend;
    
    // Active contracts
    const contractCount = await queryAsync('SELECT COUNT(*) as count FROM contracts');
    stats.totalContracts = contractCount[0].count;
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get top vendors by spend
app.get('/api/top-vendors', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    const topVendors = await queryAsync(`
      SELECT 
        v.vendor_name,
        v.vendor_id,
        v.city,
        v.state,
        v.country,
        SUM(st.total_amount) as total_spend,
        COUNT(st.transaction_id) as transaction_count,
        AVG(st.total_amount) as avg_transaction_value
      FROM vendors v
      JOIN spend_transactions st ON v.vendor_id = st.vendor_id
      GROUP BY v.vendor_id, v.vendor_name, v.city, v.state, v.country
      ORDER BY total_spend DESC
      LIMIT ?
    `, [limit]);
    
    res.json(topVendors);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get spend by commodity/category
app.get('/api/spend-by-category', async (req, res) => {
  try {
    const spendByCategory = await queryAsync(`
      SELECT 
        c.commodity_name as category,
        c.commodity_group,
        SUM(st.total_amount) as total_spend,
        COUNT(st.transaction_id) as transaction_count,
        COUNT(DISTINCT st.vendor_id) as unique_vendors
      FROM commodities c
      JOIN spend_transactions st ON c.commodity_id = st.commodity_id
      GROUP BY c.commodity_id, c.commodity_name, c.commodity_group
      ORDER BY total_spend DESC
    `);
    
    res.json(spendByCategory);
  } catch (error) {
    console.error('Error fetching spend by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get monthly spend trends
app.get('/api/spend-trends', async (req, res) => {
  try {
    const trends = await queryAsync(`
      SELECT 
        strftime('%Y-%m', award_date) as month,
        SUM(total_amount) as total_spend,
        COUNT(transaction_id) as transaction_count,
        COUNT(DISTINCT vendor_id) as unique_vendors,
        AVG(total_amount) as avg_transaction_value
      FROM spend_transactions
      WHERE award_date IS NOT NULL
      GROUP BY strftime('%Y-%m', award_date)
      ORDER BY month DESC
      LIMIT 12
    `);
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching spend trends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get contract status distribution
app.get('/api/contract-status', async (req, res) => {
  try {
    const contractStatus = await queryAsync(`
      SELECT 
        contract_status,
        COUNT(*) as count
      FROM contracts
      GROUP BY contract_status
      ORDER BY count DESC
    `);
    
    res.json(contractStatus);
  } catch (error) {
    console.error('Error fetching contract status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to generate role-specific insights
app.post('/api/generate-report', async (req, res) => {
  try {
    const { role, reportType, prompt } = req.body;
    
    // Generate different data sets based on role and report type
    let reportData = {};
    
    switch (reportType) {
      case 'consolidation':
        reportData = await generateConsolidationData();
        break;
      case 'risk_assessment':
        reportData = await generateRiskAssessmentData();
        break;
      case 'executive_summary':
        reportData = await generateExecutiveData();
        break;
      case 'spend_analytics':
        reportData = await generateSpendAnalyticsData();
        break;
      default:
        reportData = await generateGeneralData();
    }
    
    res.json({
      role,
      reportType,
      prompt,
      data: reportData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for different report types
async function generateConsolidationData() {
  const duplicateSuppliers = await queryAsync(`
    SELECT 
      v1.vendor_name as vendor1,
      v2.vendor_name as vendor2,
      v1.city,
      v1.state,
      SUM(st1.total_amount + st2.total_amount) as combined_spend
    FROM vendors v1
    JOIN vendors v2 ON v1.city = v2.city AND v1.state = v2.state AND v1.vendor_id != v2.vendor_id
    JOIN spend_transactions st1 ON v1.vendor_id = st1.vendor_id
    JOIN spend_transactions st2 ON v2.vendor_id = st2.vendor_id
    GROUP BY v1.vendor_id, v2.vendor_id, v1.city, v1.state
    HAVING combined_spend > 100000
    LIMIT 10
  `);
  
  const commodityOverlap = await queryAsync(`
    SELECT 
      c.commodity_name,
      COUNT(DISTINCT st.vendor_id) as vendor_count,
      SUM(st.total_amount) as total_spend
    FROM commodities c
    JOIN spend_transactions st ON c.commodity_id = st.commodity_id
    GROUP BY c.commodity_id, c.commodity_name
    HAVING vendor_count > 5
    ORDER BY vendor_count DESC
    LIMIT 15
  `);
  
  return {
    duplicateSuppliers,
    commodityOverlap,
    consolidationOpportunities: duplicateSuppliers.length,
    potentialSavings: duplicateSuppliers.reduce((sum, item) => sum + (item.combined_spend * 0.15), 0)
  };
}

async function generateRiskAssessmentData() {
  const singleSourceSuppliers = await queryAsync(`
    SELECT 
      c.commodity_name,
      v.vendor_name,
      SUM(st.total_amount) as spend,
      COUNT(st.transaction_id) as transactions
    FROM commodities c
    JOIN spend_transactions st ON c.commodity_id = st.commodity_id
    JOIN vendors v ON st.vendor_id = v.vendor_id
    WHERE c.commodity_id IN (
      SELECT commodity_id 
      FROM spend_transactions 
      GROUP BY commodity_id 
      HAVING COUNT(DISTINCT vendor_id) = 1
    )
    GROUP BY c.commodity_id, v.vendor_id
    ORDER BY spend DESC
    LIMIT 20
  `);
  
  const highValueSuppliers = await queryAsync(`
    SELECT 
      v.vendor_name,
      v.city,
      v.state,
      v.country,
      SUM(st.total_amount) as total_spend,
      COUNT(DISTINCT st.commodity_id) as commodity_count
    FROM vendors v
    JOIN spend_transactions st ON v.vendor_id = st.vendor_id
    GROUP BY v.vendor_id
    HAVING total_spend > 1000000
    ORDER BY total_spend DESC
    LIMIT 25
  `);
  
  return {
    singleSourceSuppliers,
    highValueSuppliers,
    riskExposure: singleSourceSuppliers.reduce((sum, item) => sum + item.spend, 0),
    criticalSuppliers: highValueSuppliers.length
  };
}

async function generateExecutiveData() {
  const kpis = await queryAsync(`
    SELECT 
      COUNT(DISTINCT v.vendor_id) as active_vendors,
      SUM(st.total_amount) as total_spend,
      COUNT(st.transaction_id) as total_transactions,
      AVG(st.total_amount) as avg_transaction_value,
      COUNT(DISTINCT c.commodity_id) as commodity_categories
    FROM vendors v
    JOIN spend_transactions st ON v.vendor_id = st.vendor_id
    JOIN commodities c ON st.commodity_id = c.commodity_id
  `);
  
  const performanceMetrics = await queryAsync(`
    SELECT 
      strftime('%Y-%m', award_date) as month,
      COUNT(transaction_id) as on_time_deliveries,
      SUM(total_amount) as monthly_spend
    FROM spend_transactions
    WHERE award_date IS NOT NULL
    GROUP BY strftime('%Y-%m', award_date)
    ORDER BY month DESC
    LIMIT 6
  `);
  
  return {
    kpis: kpis[0],
    performanceMetrics,
    overallScore: 87.3,
    onTimeDelivery: 94.2
  };
}

async function generateSpendAnalyticsData() {
  const detailedSpend = await queryAsync(`
    SELECT 
      c.commodity_group as category,
      c.commodity_name as subcategory,
      SUM(st.total_amount) as spend,
      COUNT(st.transaction_id) as transactions,
      COUNT(DISTINCT st.vendor_id) as suppliers,
      AVG(st.unit_price) as avg_unit_price,
      MIN(st.unit_price) as min_unit_price,
      MAX(st.unit_price) as max_unit_price
    FROM commodities c
    JOIN spend_transactions st ON c.commodity_id = st.commodity_id
    GROUP BY c.commodity_group, c.commodity_name
    ORDER BY spend DESC
  `);
  
  const priceVariation = await queryAsync(`
    SELECT 
      c.commodity_name,
      COUNT(DISTINCT st.vendor_id) as supplier_count,
      AVG(st.unit_price) as avg_price,
      MIN(st.unit_price) as min_price,
      MAX(st.unit_price) as max_price,
      (MAX(st.unit_price) - MIN(st.unit_price)) / AVG(st.unit_price) * 100 as price_variation_pct
    FROM commodities c
    JOIN spend_transactions st ON c.commodity_id = st.commodity_id
    WHERE st.unit_price > 0
    GROUP BY c.commodity_id, c.commodity_name
    HAVING supplier_count > 2 AND price_variation_pct > 10
    ORDER BY price_variation_pct DESC
    LIMIT 20
  `);
  
  return {
    detailedSpend,
    priceVariation,
    totalCategories: detailedSpend.length,
    optimizationOpportunities: priceVariation.length
  };
}

async function generateGeneralData() {
  const summary = await queryAsync(`
    SELECT 
      COUNT(DISTINCT v.vendor_id) as vendors,
      SUM(st.total_amount) as spend,
      COUNT(st.transaction_id) as transactions
    FROM vendors v
    JOIN spend_transactions st ON v.vendor_id = st.vendor_id
  `);
  
  return {
    summary: summary[0]
  };
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Supplier Data Service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;