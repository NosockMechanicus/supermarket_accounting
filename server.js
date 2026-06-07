const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supermarket_accounting_system';
 
app.use(cors());
app.use(express.json());
 
// ===========================
// MIGRATIONS
// ===========================
 
async function runMigrations() {
  try {
    const db = mongoose.connection.db;
    const migrationsCollection = db.collection('_migrations');
 
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.startsWith('migration_') && f.endsWith('.js'))
      .sort();
 
    await migrationsCollection.createIndex({ name: 1 }, { unique: true }).catch(() => {});
    console.log(`\n📊 Running ${migrationFiles.length} migration(s)...\n`);
 
    for (const file of migrationFiles) {
      const migrationName = file.replace('.js', '');
      const existing = await migrationsCollection.findOne({ name: migrationName }).catch(() => null);
 
      if (existing) {
        console.log(`  ⊘ ${migrationName} (already applied)`);
        continue;
      }
 
      try {
        const migration = require(path.join(migrationsDir, file));
        await migration.up(db);
        await migrationsCollection.insertOne({ name: migrationName, applied_at: new Date() });
        console.log(`  ✓ ${migrationName} (applied)`);
      } catch (error) {
        console.error(`  ✗ ${migrationName} (failed)`, error.message);
      }
    }
 
    console.log('\n✓ Migrations completed\n');
  } catch (error) {
    console.error('Migration error:', error);
  }
}
 
// ===========================
// ROUTES
// ===========================
 
// Products
app.get('/api/products', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
app.post('/api/products', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { sku, name, price, unit, category, has_expiry, expiry_date } = req.body;
    const doc = { sku, name, price, unit, category, has_expiry: !!has_expiry };
    if (has_expiry && expiry_date) doc.expiry_date = new Date(expiry_date);
    await db.collection('products').insertOne(doc);
    res.status(201).json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:sku', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { sku } = req.params;
    const { name, price, unit, category } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'Назва та ціна обовʼязкові' });
    const result = await db.collection('products').updateOne(
      { sku },
      { $set: { name, price: parseFloat(price), unit, category } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Товар не знайдено' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const inventory = await db.collection('inventory').find({}).toArray();
    res.json(inventory);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
app.patch('/api/inventory/:sku', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { sku } = req.params;
    const { adjustment } = req.body;
    const item = await db.collection('inventory').findOne({ sku });
    if (!item) return res.status(404).json({ error: 'SKU не знайдено' });
    const new_quantity = item.quantity + adjustment;
    if (new_quantity < 0) return res.status(400).json({ error: 'Недостатньо товару на складі' });
    await db.collection('inventory').updateOne(
      { sku },
      { $set: { quantity: new_quantity, last_updated: new Date() } }
    );
    res.json({ ok: true, new_quantity });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders').find({}).toArray();
    console.log(`[orders] found ${orders.length} documents`);
 
    const normalized = orders.map(o => ({
      ...o,
      order_id: o.order_id || o.order_number || o._id.toString(),
      total_amount: typeof o.total_amount === 'number' ? o.total_amount
                  : typeof o.total === 'number' ? o.total : 0,
      payment_method: o.payment_method
                    || (o.payment && typeof o.payment === 'object' ? o.payment.method : null)
                    || (typeof o.payment === 'string' ? o.payment : 'cash'),
      timestamp: o.timestamp || o.created_at || o._id.getTimestamp(),
    }));
 
    // Sort in JS to avoid issues with missing timestamp field
    normalized.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
 
    res.json(normalized);
  } catch (e) {
    console.error('[orders] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});
 
app.post('/api/orders', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { items, total_amount, payment_method } = req.body;
    const order_id = 'ORD_' + Date.now();
    await db.collection('orders').insertOne({
      order_id,
      timestamp: new Date(),
      items,
      total_amount,
      payment_method
    });
    res.status(201).json({ ok: true, order_id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const suppliers = await db.collection('suppliers').find({}).toArray();
    // Normalize _id field as supplier_id for frontend
    const result = suppliers.map(s => ({ ...s, supplier_id: s._id }));
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Supply contracts
app.post('/api/supply-contracts', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { supplier_id, items } = req.body;
    const contract_id = 'CONT_' + Date.now();
    await db.collection('supply_contracts').insertOne({
      contract_id,
      supplier_id,
      order_date: new Date(),
      items,
      status: 'pending'
    });
    res.status(201).json({ ok: true, contract_id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Users
app.get('/api/users', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { ObjectId } = require('mongodb');
    const { full_name, role, access_level, work_status } = req.body;
    if (!full_name || !role) return res.status(400).json({ error: "ПІБ та роль обов'язкові" });
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { full_name, role, access_level: parseInt(access_level), work_status } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Працівника не знайдено' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { ObjectId } = require('mongodb');
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'Не знайдено' });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
app.post('/api/users/register', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { username, full_name, role, access_level } = req.body;
    const result = await db.collection('users').insertOne({
      username, full_name, role,
      access_level: parseInt(access_level),
      work_status: 'active'
    });
    res.status(201).json({ ok: true, user_id: result.insertedId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Reports
app.get('/api/admin/expired-report', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 10);
    const items = await db.collection('inventory').find({
      expiry_date: { $exists: true, $lte: cutoff }
    }).toArray();
    const result = items.map(i => ({
      sku: i.sku,
      expiry_date: i.expiry_date?.toISOString().split('T')[0],
      days_left: Math.floor((new Date(i.expiry_date) - new Date()) / 86400000)
    }));
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// Restock report
app.get('/api/admin/restock-report', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const threshold = parseInt(req.query.threshold) || 20;

    const inventory = await db.collection('inventory').find({ quantity: { $lt: threshold } }).toArray();
    if (inventory.length === 0) return res.json([]);

    const skus = inventory.map(i => i.sku);
    const products = await db.collection('products').find({ sku: { $in: skus } }).toArray();
    const suppliers = await db.collection('suppliers').find({}).toArray();

    const productMap = {};
    products.forEach(p => { productMap[p.sku] = p; });

    const result = inventory.map(item => {
      const product = productMap[item.sku] || {};
      const supplierId = product.supplier_id || null;
      const supplier = supplierId ? suppliers.find(s => s._id === supplierId) : null;

      // if no direct supplier_id, try to match by category
      let matchedSupplier = supplier;
      if (!matchedSupplier && product.category) {
        matchedSupplier = suppliers.find(s =>
          Array.isArray(s.categories) && s.categories.includes(product.category)
        );
      }

      const suggested = Math.max(threshold * 2 - item.quantity, threshold);

      return {
        sku: item.sku,
        name: product.name || item.sku,
        category: product.category || '—',
        quantity: item.quantity,
        location: item.location || '—',
        supplier_id: matchedSupplier?._id || null,
        supplier_name: matchedSupplier?.name || 'Постачальник невідомий',
        supplier_contact: matchedSupplier?.contact_person || '—',
        suggested_qty: suggested,
      };
    }).sort((a, b) => a.quantity - b.quantity);

    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===========================
// MONGODB + START SERVER
// ===========================
 
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('✓ Connected to MongoDB...');
  await runMigrations();
 
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('✗ Could not connect to MongoDB...', err.message);
  process.exit(1);
});