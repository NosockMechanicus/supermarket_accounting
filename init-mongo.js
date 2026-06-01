// Initialize MongoDB collections and indexes
db = db.getSiblingDB('supermarket_accounting_system');

// Drop existing collections for fresh start
db.products.drop();
db.users.drop();
db.inventory.drop();
db.orders.drop();
db.suppliers.drop();
db.supply_contracts.drop();

// Create collections with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['sku', 'name', 'price'],
      properties: {
        _id: { bsonType: 'objectId' },
        sku: { bsonType: 'string', description: 'Product SKU - must be unique' },
        name: { bsonType: 'string', description: 'Product name' },
        category: { bsonType: 'string', description: 'Product category' },
        price: { bsonType: 'double', description: 'Product price', minimum: 0 },
        unit: { bsonType: 'string', description: 'Unit of measurement (шт, кг, л)' }
      }
    }
  }
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'full_name', 'role'],
      properties: {
        _id: { bsonType: 'objectId' },
        username: { bsonType: 'string', description: 'Username - must be unique' },
        full_name: { bsonType: 'string', description: 'Full name of user' },
        role: { enum: ['admin', 'manager', 'cashier', 'warehouse'], description: 'User role' },
        access_level: { bsonType: 'int', description: 'Access level (1-3)' },
        work_status: { enum: ['active', 'inactive'], description: 'Work status' }
      }
    }
  }
});

db.createCollection('inventory', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['sku', 'quantity'],
      properties: {
        _id: { bsonType: 'objectId' },
        sku: { bsonType: 'string', description: 'Product SKU' },
        quantity: { bsonType: 'int', description: 'Quantity in stock', minimum: 0 },
        location: { bsonType: 'string', description: 'Storage location' },
        last_updated: { bsonType: 'date', description: 'Last update timestamp' }
      }
    }
  }
});

db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['order_id', 'items', 'total_amount'],
      properties: {
        _id: { bsonType: 'objectId' },
        order_id: { bsonType: 'string', description: 'Unique order ID' },
        timestamp: { bsonType: 'date', description: 'Order creation timestamp' },
        items: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              sku: { bsonType: 'string' },
              quantity: { bsonType: 'int' }
            }
          }
        },
        total_amount: { bsonType: 'double', description: 'Total order amount', minimum: 0 },
        payment_method: { enum: ['cash', 'card', 'online'], description: 'Payment method' }
      }
    }
  }
});

db.createCollection('suppliers', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['supplier_id', 'name'],
      properties: {
        _id: { bsonType: 'string', description: 'Supplier ID (SUPP_01, SUPP_02)' },
        name: { bsonType: 'string', description: 'Supplier name' },
        contact_person: { bsonType: 'string', description: 'Contact person' },
        categories: { bsonType: 'array', description: 'Product categories supplied' }
      }
    }
  }
});

db.createCollection('supply_contracts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['contract_id', 'supplier_id', 'items'],
      properties: {
        _id: { bsonType: 'objectId' },
        contract_id: { bsonType: 'string', description: 'Unique contract ID' },
        supplier_id: { bsonType: 'string', description: 'Supplier ID' },
        order_date: { bsonType: 'date', description: 'Order date' },
        items: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              sku: { bsonType: 'string' },
              quantity: { bsonType: 'int' }
            }
          }
        },
        status: { enum: ['pending', 'completed', 'cancelled'], description: 'Contract status' }
      }
    }
  }
});

// Create indexes for better performance
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });

db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.inventory.createIndex({ sku: 1 }, { unique: true });
db.inventory.createIndex({ location: 1 });

db.orders.createIndex({ order_id: 1 }, { unique: true });
db.orders.createIndex({ timestamp: -1 });

db.suppliers.createIndex({ _id: 1 }, { unique: true });

db.supply_contracts.createIndex({ contract_id: 1 }, { unique: true });
db.supply_contracts.createIndex({ supplier_id: 1 });

// Insert sample data
db.products.insertMany([
  { sku: 'PROD_001', name: 'Холодильник Samsung', category: 'Холодильники', price: 12999.99, unit: 'шт' },
  { sku: 'PROD_002', name: 'Пральна машина LG', category: 'Прання', price: 8999.99, unit: 'шт' },
  { sku: 'PROD_003', name: 'Мікрохвильова піч Bosch', category: 'Кухня', price: 3499.99, unit: 'шт' },
  { sku: 'PROD_004', name: 'Посудомийна машина Electrolux', category: 'Кухня', price: 5999.99, unit: 'шт' },
  { sku: 'PROD_005', name: 'Кондиціонер Daikin', category: 'Кліматизація', price: 7499.99, unit: 'шт' }
]);

db.users.insertMany([
  { username: 'admin_user', full_name: 'Адміністратор Системи', role: 'admin', access_level: 3, work_status: 'active' },
  { username: 'manager_01', full_name: 'Менеджер Петренко', role: 'manager', access_level: 2, work_status: 'active' },
  { username: 'cashier_01', full_name: 'Касир Васильєв', role: 'cashier', access_level: 1, work_status: 'active' },
  { username: 'warehouse_01', full_name: 'Комірник Сидоренко', role: 'warehouse', access_level: 1, work_status: 'active' }
]);

db.inventory.insertMany([
  { sku: 'PROD_001', quantity: 15, location: 'Стелаж А1', last_updated: new Date() },
  { sku: 'PROD_002', quantity: 8, location: 'Стелаж А2', last_updated: new Date() },
  { sku: 'PROD_003', quantity: 25, location: 'Стелаж Б1', last_updated: new Date() },
  { sku: 'PROD_004', quantity: 5, location: 'Стелаж Б2', last_updated: new Date() },
  { sku: 'PROD_005', quantity: 12, location: 'Стелаж В1', last_updated: new Date() }
]);

db.suppliers.insertMany([
  { _id: 'SUPP_001', name: 'Samsung Ukraine', contact_person: 'Іван Петренко', categories: ['Холодильники', 'Кліматизація'] },
  { _id: 'SUPP_002', name: 'LG Electronics', contact_person: 'Марія Сідоренко', categories: ['Прання', 'Кухня'] },
  { _id: 'SUPP_003', name: 'Bosch Service Center', contact_person: 'Олег Коваленко', categories: ['Кухня'] },
  { _id: 'SUPP_004', name: 'Daikin Comfort', contact_person: 'Ніна Васильєва', categories: ['Кліматизація'] }
]);

print('✓ Database initialized successfully');
print('✓ Collections created with validation');
print('✓ Indexes created for performance');
print('✓ Sample data inserted');
