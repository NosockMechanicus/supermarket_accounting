const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supermarket_accounting_system';

// Middleware
app.use(cors());
app.use(express.json());

// ===========================
// 1. MONGODB CONNECTION
// ===========================

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✓ Connected to MongoDB...'))
.catch(err => {
  console.error('✗ Could not connect to MongoDB...', err);
  setTimeout(() => mongoose.connect(MONGODB_URI), 5000);
});

// ===========================
// 2. DATABASE SCHEMAS
// ===========================

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true, min: 0 },
  unit: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'cashier', 'warehouse'], required: true },
  access_level: { type: Number, default: 1 },
  work_status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
  location: String,
  last_updated: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  items: [{
    sku: String,
    quantity: Number
  }],
  total_amount: { type: Number, required: true, min: 0 },
  payment_method: { type: String, enum: ['cash', 'card', 'online'] }
});

const supplierSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  contact_person: String,
  categories: [String]
});

const supplyContractSchema = new mongoose.Schema({
  contract_id: { type: String, required: true, unique: true },
  supplier_id: { type: String, required: true },
  order_date: { type: Date, default: Date.now },
  items: [{
    sku: String,
    quantity: Number
  }],
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
});

// ===========================
// 3. MODELS
// ===========================

const Product = mongoose.model('Product', productSchema, 'products');
const User = mongoose.model('User', userSchema, 'users');
const Inventory = mongoose.model('Inventory', inventorySchema, 'inventory');
const Order = mongoose.model('Order', orderSchema, 'orders');
const Supplier = mongoose.model('Supplier', supplierSchema, 'suppliers');
const SupplyContract = mongoose.model('SupplyContract', supplyContractSchema, 'supply_contracts');

// ===========================
// 4. HEALTH CHECK
// ===========================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ===========================
// 5. USER ENDPOINTS
// ===========================

// POST: Register worker
app.post('/api/users/register', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      full_name: req.body.full_name,
      role: req.body.role || 'cashier',
      access_level: req.body.access_level || 1
    });
    const savedUser = await newUser.save();
    res.status(201).json({ 
      user_id: savedUser._id, 
      status: "created" 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get user info
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      full_name: user.full_name,
      role: user.role,
      work_status: user.work_status
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// ===========================
// 6. PRODUCT ENDPOINTS
// ===========================

// GET: All products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}, 'sku name price -_id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add new product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product({
      sku: req.body.sku,
      name: req.body.name,
      price: req.body.price,
      unit: req.body.unit,
      category: req.body.category || "Загальне"
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({
      sku: savedProduct.sku,
      name: savedProduct.name
    });
  } catch (err) {
    res.status(400).json({ error: "Error adding product" });
  }
});

// ===========================
// 7. INVENTORY ENDPOINTS
// ===========================

// GET: View inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const stock = await Inventory.find({}, 'sku quantity location -_id');
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving inventory" });
  }
});

// PATCH: Update inventory quantity
app.patch('/api/inventory/:sku', async (req, res) => {
  try {
    const { adjustment } = req.body;
    
    const updatedStock = await Inventory.findOneAndUpdate(
      { sku: req.params.sku },
      { 
        $inc: { quantity: adjustment },
        $set: { last_updated: Date.now() }
      },
      { new: true }
    );

    if (!updatedStock) return res.status(404).json({ error: 'Item not found in inventory' });
    
    res.json({
      sku: updatedStock.sku,
      new_quantity: updatedStock.quantity,
      status: "updated"
    });
  } catch (err) {
    res.status(400).json({ error: "Error updating inventory" });
  }
});

// ===========================
// 8. ORDER ENDPOINTS
// ===========================

// POST: Create order (sale)
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order({
      order_id: `ORD-${Date.now()}`,
      items: req.body.items,
      total_amount: req.body.total_amount,
      payment_method: req.body.payment_method || 'cash'
    });
    
    const savedOrder = await order.save();
    res.status(201).json({
      order_id: savedOrder.order_id,
      status: "прийнято"
    });
  } catch (err) {
    res.status(400).json({ error: "Error creating order" });
  }
});

// GET: View sales history
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving orders" });
  }
});

// ===========================
// 9. SUPPLIER ENDPOINTS
// ===========================

// GET: Supplier list
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find({}, '_id name');
    const formatted = suppliers.map(s => ({
      supplier_id: s._id,
      name: s.name
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving suppliers" });
  }
});

// POST: Create supply contract
app.post('/api/supply-contracts', async (req, res) => {
  try {
    const contract = new SupplyContract({
      contract_id: `CON-${Date.now()}`,
      supplier_id: req.body.supplier_id,
      items: req.body.items.map(item => ({
        sku: item.sku,
        quantity: item.qty
      }))
    });
    
    const savedContract = await contract.save();
    res.status(201).json({
      contract_id: savedContract.contract_id,
      status: "створено"
    });
  } catch (err) {
    res.status(400).json({ error: "Error creating contract" });
  }
});

// ===========================
// 10. REPORTS ENDPOINTS
// ===========================

// GET: Expiry report
app.get('/api/admin/expired-report', async (req, res) => {
  try {
    const stock = await Inventory.find();
    const today = new Date();

    const report = stock.map(item => {
      const expiryDate = new Date("2026-05-20");
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        sku: item.sku,
        expiry_date: expiryDate.toISOString().split('T')[0],
        days_left: diffDays
      };
    });
    
    const urgentReport = report.filter(item => item.days_left <= 10);
    res.json(urgentReport);
  } catch (err) {
    res.status(500).json({ error: "Error generating report" });
  }
});

// ===========================
// 11. START SERVER
// ===========================

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  🏪 Supermarket Accounting System`);
  console.log(`${'='.repeat(50)}`);
  console.log(`  ✓ Server running on http://localhost:${PORT}`);
  console.log(`  ✓ API Base URL: http://localhost:${PORT}/api`);
  console.log(`  ✓ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`${'='.repeat(50)}\n`);
});
