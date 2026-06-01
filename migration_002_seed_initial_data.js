// migrations/migration_002_seed_initial_data.js
// Migration: Insert initial seed data for development
// Date: 2024-02-14

module.exports = {
  async up(db) {
    // Check if data already exists
    const productsCount = await db.collection('products').countDocuments();
    
    if (productsCount > 0) {
      console.log('  → Seed data already exists, skipping...');
      return;
    }

    // Insert products
    await db.collection('products').insertMany([
      { sku: 'PROD_001', name: 'Холодильник Samsung', category: 'Холодильники', price: 12999.99, unit: 'шт' },
      { sku: 'PROD_002', name: 'Пральна машина LG', category: 'Прання', price: 8999.99, unit: 'шт' },
      { sku: 'PROD_003', name: 'Мікрохвильова піч Bosch', category: 'Кухня', price: 3499.99, unit: 'шт' },
      { sku: 'PROD_004', name: 'Посудомийна машина Electrolux', category: 'Кухня', price: 5999.99, unit: 'шт' },
      { sku: 'PROD_005', name: 'Кондиціонер Daikin', category: 'Кліматизація', price: 7499.99, unit: 'шт' }
    ]);
    console.log('  → Inserted 5 products');

    // Insert users
    await db.collection('users').insertMany([
      { username: 'admin_user', full_name: 'Адміністратор Системи', role: 'admin', access_level: 3, work_status: 'active' },
      { username: 'manager_01', full_name: 'Менеджер Петренко', role: 'manager', access_level: 2, work_status: 'active' },
      { username: 'cashier_01', full_name: 'Касир Васильєв', role: 'cashier', access_level: 1, work_status: 'active' },
      { username: 'warehouse_01', full_name: 'Комірник Сидоренко', role: 'warehouse', access_level: 1, work_status: 'active' }
    ]);
    console.log('  → Inserted 4 users');

    // Insert inventory
    const now = new Date();
    await db.collection('inventory').insertMany([
      { sku: 'PROD_001', quantity: 15, location: 'Стелаж А1', last_updated: now },
      { sku: 'PROD_002', quantity: 8, location: 'Стелаж А2', last_updated: now },
      { sku: 'PROD_003', quantity: 25, location: 'Стелаж Б1', last_updated: now },
      { sku: 'PROD_004', quantity: 5, location: 'Стелаж Б2', last_updated: now },
      { sku: 'PROD_005', quantity: 12, location: 'Стелаж В1', last_updated: now }
    ]);
    console.log('  → Inserted 5 inventory items');

    // Insert suppliers
    await db.collection('suppliers').insertMany([
      { _id: 'SUPP_001', name: 'Samsung Ukraine', contact_person: 'Іван Петренко', categories: ['Холодильники', 'Кліматизація'] },
      { _id: 'SUPP_002', name: 'LG Electronics', contact_person: 'Марія Сідоренко', categories: ['Прання', 'Кухня'] },
      { _id: 'SUPP_003', name: 'Bosch Service Center', contact_person: 'Олег Коваленко', categories: ['Кухня'] },
      { _id: 'SUPP_004', name: 'Daikin Comfort', contact_person: 'Ніна Васильєва', categories: ['Кліматизація'] }
    ]);
    console.log('  → Inserted 4 suppliers');
  },

  async down(db) {
    // Rollback: Delete seed data
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('inventory').deleteMany({});
    await db.collection('suppliers').deleteMany({});
    console.log('  → Deleted seed data');
  }
};
