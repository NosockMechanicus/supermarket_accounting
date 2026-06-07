// migrations/migration_001_create_initial_schema.js
// Migration: Create initial collections and indexes
// Date: 2024-02-14

module.exports = {
  async up(db) {
    // Create products collection
    try {
      await db.createCollection('products', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['sku', 'name', 'price'],
            properties: {
              _id: { bsonType: 'objectId' },
              sku: { bsonType: 'string' },
              name: { bsonType: 'string' },
              category: { bsonType: 'string' },
              price: { bsonType: ['double', 'int', 'decimal'], minimum: 0 },
              unit: { bsonType: 'string' },
              barcode: { bsonType: 'string' },
              supplier_id: { bsonType: 'string' },
              has_expiry: { bsonType: 'bool' }
            }
          }
        }
      });
      console.log('  → Created products collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create users collection
    try {
      await db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['username', 'full_name', 'role'],
            properties: {
              _id: { bsonType: 'objectId' },
              username: { bsonType: 'string' },
              full_name: { bsonType: 'string' },
              role: { enum: ['admin', 'manager', 'cashier', 'warehouse'] },
              access_level: { bsonType: 'int' },
              work_status: { enum: ['active', 'inactive'] }
            }
          }
        }
      });
      console.log('  → Created users collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create inventory collection
    try {
      await db.createCollection('inventory', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['sku', 'quantity'],
            properties: {
              _id: { bsonType: 'objectId' },
              sku: { bsonType: 'string' },
              quantity: { bsonType: ['int', 'double'], minimum: 0 },
              location: { bsonType: 'string' },
              last_updated: { bsonType: 'date' },
              expiry_date: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('  → Created inventory collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create orders collection
    try {
      await db.createCollection('orders', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['order_id', 'items', 'total_amount'],
            properties: {
              _id: { bsonType: 'objectId' },
              order_id: { bsonType: 'string' },
              timestamp: { bsonType: 'date' },
              items: { bsonType: 'array' },
              total_amount: { bsonType: ['double', 'int', 'decimal'], minimum: 0 },
              payment_method: { enum: ['cash', 'card', 'online'] }
            }
          }
        }
      });
      console.log('  → Created orders collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create suppliers collection
    try {
      await db.createCollection('suppliers', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name'],
            properties: {
              _id: { bsonType: 'string' },
              name: { bsonType: 'string' },
              contact_person: { bsonType: 'string' },
              categories: { bsonType: 'array' }
            }
          }
        }
      });
      console.log('  → Created suppliers collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create supply_contracts collection
    try {
      await db.createCollection('supply_contracts', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['contract_id', 'supplier_id', 'items'],
            properties: {
              _id: { bsonType: 'objectId' },
              contract_id: { bsonType: 'string' },
              supplier_id: { bsonType: 'string' },
              order_date: { bsonType: 'date' },
              items: { bsonType: 'array' },
              status: { enum: ['pending', 'completed', 'cancelled'] }
            }
          }
        }
      });
      console.log('  → Created supply_contracts collection');
    } catch (e) {
      if (!e.message.includes('already exists')) throw e;
    }

    // Create indexes
    try {
      await db.collection('products').createIndex({ sku: 1 }, { unique: true });
      await db.collection('products').createIndex({ name: 1 });
      await db.collection('products').createIndex({ category: 1 });
      console.log('  → Created indexes for products');
    } catch (e) {}

    try {
      await db.collection('users').createIndex({ username: 1 }, { unique: true });
      await db.collection('users').createIndex({ role: 1 });
      console.log('  → Created indexes for users');
    } catch (e) {}

    try {
      await db.collection('inventory').createIndex({ sku: 1 }, { unique: true });
      await db.collection('inventory').createIndex({ location: 1 });
      await db.collection('inventory').createIndex({ expiry_date: 1 });
      console.log('  → Created indexes for inventory');
    } catch (e) {}

    try {
      await db.collection('orders').createIndex({ order_id: 1 }, { unique: true });
      await db.collection('orders').createIndex({ timestamp: -1 });
      console.log('  → Created indexes for orders');
    } catch (e) {}

    try {
      await db.collection('suppliers').createIndex({ _id: 1 }, { unique: true });
      console.log('  → Created indexes for suppliers');
    } catch (e) {}

    try {
      await db.collection('supply_contracts').createIndex({ contract_id: 1 }, { unique: true });
      await db.collection('supply_contracts').createIndex({ supplier_id: 1 });
      console.log('  → Created indexes for supply_contracts');
    } catch (e) {}
  },

  async down(db) {
    try {
      await db.collection('products').drop();
      await db.collection('users').drop();
      await db.collection('inventory').drop();
      await db.collection('orders').drop();
      await db.collection('suppliers').drop();
      await db.collection('supply_contracts').drop();
      console.log('  → Rolled back all collections');
    } catch (e) {
      if (!e.message.includes('ns not found')) throw e;
    }
  }
};