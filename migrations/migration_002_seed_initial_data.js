// migrations/migration_002_seed_initial_data.js
// Migration: Insert initial seed data for development

module.exports = {
  async up(db) {
    // Check if data already exists
    const productsCount = await db.collection('products').countDocuments();

    if (productsCount > 0) {
      console.log('  → Seed data already exists, skipping...');
      return;
    }

    // Insert products (техніка + продукти харчування)
    await db.collection('products').insertMany([
      // Техніка
      { sku: 'PROD_001', name: 'Холодильник Samsung', category: 'Холодильники', price: 12999.99, unit: 'шт', has_expiry: false },
      { sku: 'PROD_002', name: 'Пральна машина LG', category: 'Прання', price: 8999.99, unit: 'шт', has_expiry: false },
      { sku: 'PROD_003', name: 'Мікрохвильова піч Bosch', category: 'Кухня', price: 3499.99, unit: 'шт', has_expiry: false },
      { sku: 'PROD_004', name: 'Посудомийна машина Electrolux', category: 'Кухня', price: 5999.99, unit: 'шт', has_expiry: false },
      { sku: 'PROD_005', name: 'Кондиціонер Daikin', category: 'Кліматизація', price: 7499.99, unit: 'шт', has_expiry: false },
      // Продукти харчування
      { sku: 'PROD-MILK-001', name: 'Молоко Галичина 2.5%', category: 'Молочні продукти', price: 38.5, unit: 'шт', barcode: '4820001230012', supplier_id: 'SUPP_005', has_expiry: true },
      { sku: 'PROD-MILK-002', name: 'Йогурт Грецький', category: 'Молочні продукти', price: 25.0, unit: 'шт', barcode: '482000123456', supplier_id: 'SUPP_005', has_expiry: true },
      { sku: 'PROD-BREAD-052', name: 'Батон Сихівський', category: 'Хлібобулочні вироби', price: 18.2, unit: 'шт', barcode: '4820001230055', supplier_id: 'SUPP_006', has_expiry: true },
      { sku: 'PROD-VEG-010', name: 'Томати Черрі', category: 'Овочі та фрукти', price: 85.0, unit: 'кг', barcode: '4820001230099', supplier_id: 'SUPP_007', has_expiry: true },
      { sku: 'PROD-DRINK-777', name: 'Вода Моршинська н/г', category: 'Напої', price: 22.0, unit: 'шт', barcode: '4820001230777', supplier_id: 'SUPP_008', has_expiry: false },
      { sku: 'PROD-MEAT-202', name: 'Філе куряче', category: "М'ясні вироби", price: 165.5, unit: 'кг', barcode: '4820001230202', supplier_id: 'SUPP_007', has_expiry: true },
    ]);
    console.log('  → Inserted 11 products');

    // Insert users
    await db.collection('users').insertMany([
      { username: 'admin_user', full_name: 'Адміністратор Системи', role: 'admin', access_level: 3, work_status: 'active' },
      { username: 'manager_01', full_name: 'Менеджер Петренко', role: 'manager', access_level: 2, work_status: 'active' },
      { username: 'cashier_01', full_name: 'Касир Васильєв', role: 'cashier', access_level: 1, work_status: 'active' },
      { username: 'cashier_02', full_name: 'Касир Коваль', role: 'cashier', access_level: 1, work_status: 'active' },
      { username: 'warehouse_01', full_name: 'Комірник Сидоренко', role: 'warehouse', access_level: 1, work_status: 'active' },
      { username: 'warehouse_02', full_name: 'Комірник Бондаренко', role: 'warehouse', access_level: 1, work_status: 'inactive' },
    ]);
    console.log('  → Inserted 6 users');

    // Insert inventory
    const now = new Date();
    const d = (days) => { const dt = new Date(now); dt.setDate(dt.getDate() + days); return dt; };

    await db.collection('inventory').insertMany([
      // Техніка — без терміну придатності
      { sku: 'PROD_001', quantity: 15, location: 'Стелаж А1', last_updated: now },
      { sku: 'PROD_002', quantity: 8, location: 'Стелаж А2', last_updated: now },
      { sku: 'PROD_003', quantity: 25, location: 'Стелаж Б1', last_updated: now },
      { sku: 'PROD_004', quantity: 5, location: 'Стелаж Б2', last_updated: now },
      { sku: 'PROD_005', quantity: 12, location: 'Стелаж В1', last_updated: now },
      // Продукти — з терміном придатності
      { sku: 'PROD-MILK-001', quantity: 40, location: 'Холодильник Г1', last_updated: now, expiry_date: d(5) },
      { sku: 'PROD-MILK-002', quantity: 30, location: 'Холодильник Г1', last_updated: now, expiry_date: d(7) },
      { sku: 'PROD-BREAD-052', quantity: 60, location: 'Стелаж Д1', last_updated: now, expiry_date: d(2) },
      { sku: 'PROD-VEG-010', quantity: 20, location: 'Стелаж Д2', last_updated: now, expiry_date: d(4) },
      { sku: 'PROD-DRINK-777', quantity: 100, location: 'Стелаж Е1', last_updated: now },
      { sku: 'PROD-MEAT-202', quantity: 15, location: 'Холодильник Г2', last_updated: now, expiry_date: d(3) },
    ]);
    console.log('  → Inserted 11 inventory items');

    // Insert suppliers
    await db.collection('suppliers').insertMany([
      { _id: 'SUPP_001', name: 'Samsung Ukraine', contact_person: 'Іван Петренко', categories: ['Холодильники', 'Кліматизація'] },
      { _id: 'SUPP_002', name: 'LG Electronics', contact_person: 'Марія Сідоренко', categories: ['Прання', 'Кухня'] },
      { _id: 'SUPP_003', name: 'Bosch Service Center', contact_person: 'Олег Коваленко', categories: ['Кухня'] },
      { _id: 'SUPP_004', name: 'Daikin Comfort', contact_person: 'Ніна Васильєва', categories: ['Кліматизація'] },
      { _id: 'SUPP_005', name: 'Галичина Молоко', contact_person: 'Тарас Бойко', categories: ['Молочні продукти'] },
      { _id: 'SUPP_006', name: 'Київхліб', contact_person: 'Олена Мороз', categories: ['Хлібобулочні вироби'] },
      { _id: 'SUPP_007', name: 'Фреш Маркет', contact_person: 'Андрій Лисенко', categories: ["Овочі та фрукти", "М'ясні вироби"] },
      { _id: 'SUPP_008', name: 'Моршинська', contact_person: 'Вікторія Павленко', categories: ['Напої'] },
    ]);
    console.log('  → Inserted 8 suppliers');

    // Insert orders
    await db.collection('orders').insertMany([
      { order_id: 'ORD-2026-001', timestamp: new Date('2026-05-13T10:15:00'), items: [{ sku: 'PROD_001', quantity: 1 }, { sku: 'PROD_003', quantity: 1 }], total_amount: 16499.98, payment_method: 'card' },
      { order_id: 'ORD-2026-002', timestamp: new Date('2026-05-13T11:30:00'), items: [{ sku: 'PROD_002', quantity: 1 }], total_amount: 8999.99, payment_method: 'cash' },
      { order_id: 'ORD-2026-003', timestamp: new Date('2026-05-14T09:00:00'), items: [{ sku: 'PROD_005', quantity: 1 }, { sku: 'PROD_004', quantity: 1 }], total_amount: 13499.98, payment_method: 'online' },
      { order_id: 'ORD-2026-004', timestamp: new Date('2026-05-14T14:45:00'), items: [{ sku: 'PROD_003', quantity: 2 }], total_amount: 6999.98, payment_method: 'card' },
      { order_id: 'ORD-2026-005', timestamp: new Date('2026-05-15T16:20:00'), items: [{ sku: 'PROD_001', quantity: 1 }, { sku: 'PROD_002', quantity: 1 }, { sku: 'PROD_005', quantity: 1 }], total_amount: 29499.97, payment_method: 'card' },
      { order_id: 'ORD-2026-006', timestamp: new Date('2026-05-16T08:30:00'), items: [{ sku: 'PROD-MILK-001', quantity: 3 }, { sku: 'PROD-BREAD-052', quantity: 2 }], total_amount: 151.9, payment_method: 'cash' },
      { order_id: 'ORD-2026-007', timestamp: new Date('2026-05-16T12:00:00'), items: [{ sku: 'PROD-VEG-010', quantity: 1 }, { sku: 'PROD-MEAT-202', quantity: 0.5 }], total_amount: 167.75, payment_method: 'card' },
      { order_id: 'ORD-2026-008', timestamp: new Date('2026-05-17T09:45:00'), items: [{ sku: 'PROD-DRINK-777', quantity: 5 }, { sku: 'PROD-MILK-002', quantity: 2 }], total_amount: 160.0, payment_method: 'cash' },
    ]);
    console.log('  → Inserted 8 orders');
  },

  async down(db) {
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('inventory').deleteMany({});
    await db.collection('suppliers').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('  → Deleted seed data');
  }
};