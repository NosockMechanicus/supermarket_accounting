# ⚡ Швидкий старт - Supermarket Accounting System

Цей файл містить покроковий гайд для миттєвого запуску системи без додаткових налаштувань.

## 🚀 Один клік до запуску

### Крок 1: Завантажте проєкт
```bash
# Клонуйте репозиторій з GitHub
git clone https://github.com/YOUR_USERNAME/supermarket-accounting-system.git
cd supermarket-accounting-system
```

### Крок 2: Запустіть всю систему
```bash
# Одна команда - все запустить
docker-compose up --build
```

**Очікуйте ~30-60 секунд на першому запуску...**

Ви побачите:
```
✓ Creating network "supermarket_network" with driver "bridge"
✓ Creating supermarket_mongodb ... done
✓ Creating supermarket_backend  ... done

✓ Connected to MongoDB...
✓ Database initialized successfully
✓ Collections created with validation
✓ Indexes created for performance
✓ Sample data inserted

🏪 Supermarket Accounting System
==================================================
  ✓ Server running on http://localhost:3000
  ✓ API Base URL: http://localhost:3000/api
  ✓ Health Check: http://localhost:3000/api/health
==================================================
```

### Крок 3: Перевірте, що все працює

Відкрийте новий термінал і виконайте:

```bash
# Перевірте здоров'я системи
curl http://localhost:3000/api/health

# Повинна вийти відповідь:
# {"status":"healthy","timestamp":"...","mongodb":"connected"}
```

---

## 📝 Тестові команди (скопіюйте та вставте)

### Отримайте список товарів
```bash
curl http://localhost:3000/api/products
```

### Додайте новий товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD_NEW",
    "name": "Новий товар",
    "price": 5999.99,
    "unit": "шт",
    "category": "Нова категорія"
  }'
```

### Перегляньте склад
```bash
curl http://localhost:3000/api/inventory
```

### Змініть кількість товару на складі (-5 шт)
```bash
curl -X PATCH http://localhost:3000/api/inventory/PROD_001 \
  -H "Content-Type: application/json" \
  -d '{"adjustment": -5}'
```

### Зробіть замовлення
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"sku": "PROD_001", "quantity": 2},
      {"sku": "PROD_002", "quantity": 1}
    ],
    "total_amount": 34999.97,
    "payment_method": "card"
  }'
```

### Отримайте всі замовлення
```bash
curl http://localhost:3000/api/orders
```

### Зареєструйте нового працівника
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_worker",
    "full_name": "Іван Петренко",
    "role": "cashier",
    "access_level": 1
  }'
```

### Отримайте список постачальників
```bash
curl http://localhost:3000/api/suppliers
```

### Отримайте звіт по термінах придатності
```bash
curl http://localhost:3000/api/admin/expired-report
```

---

## 🔧 Управління контейнерами

### Зупинення системи
```bash
docker-compose down
```

### Видалення всього (очистка)
```bash
docker-compose down -v
```

### Перезапуск
```bash
docker-compose restart
```

### Переглід логів
```bash
# Всі логи
docker-compose logs -f

# Тільки MongoDB
docker-compose logs -f mongodb

# Тільки backend
docker-compose logs -f backend
```

### Вхід у контейнер MongoDB
```bash
docker exec -it supermarket_mongodb mongosh \
  -u root -p rootpassword \
  --authenticationDatabase admin

# В mongosh консолі:
use supermarket_accounting_system
db.products.find()
db.orders.find()
```

---

## 📊 Вбудовані дані для тестування

Система автоматично заповняється з цими даними:

### Товари (5 шт)
- PROD_001: Холодильник Samsung - 12999.99 грн
- PROD_002: Пральна машина LG - 8999.99 грн
- PROD_003: Мікрохвильова піч Bosch - 3499.99 грн
- PROD_004: Посудомийна машина Electrolux - 5999.99 грн
- PROD_005: Кондиціонер Daikin - 7499.99 грн

### Користувачі (4 шт)
- admin_user: Адміністратор (Level 3)
- manager_01: Менеджер (Level 2)
- cashier_01: Касир (Level 1)
- warehouse_01: Комірник (Level 1)

### Склад (5 позицій)
- PROD_001: 15 шт (Стелаж А1)
- PROD_002: 8 шт (Стелаж А2)
- PROD_003: 25 шт (Стелаж Б1)
- PROD_004: 5 шт (Стелаж Б2)
- PROD_005: 12 шт (Стелаж В1)

### Постачальники (4 шт)
- SUPP_001: Samsung Ukraine
- SUPP_002: LG Electronics
- SUPP_003: Bosch Service Center
- SUPP_004: Daikin Comfort

---

## 🌐 Веб-інтерфейс (React Dashboard)

Якщо ви хочете використовувати графічний інтерфейс:

### Встановлення залежностей
```bash
npm install
```

### Запуск Vite dev сервера
```bash
npm run dev
```

Див. [README.md](README.md#react-dashboard-опціонально) для детальних інструкцій.

---

## ⚠️ Поширені помилки

### Помилка: Port 3000 already in use
```bash
# Знайдіть процес на порту 3000
lsof -i :3000

# Завершіть процес
kill -9 <PID>

# Або змініть порт у docker-compose.yml
# ports:
#   - "3001:3000"
```

### Помилка: Docker не встановлений
```bash
# Встановіть Docker Desktop:
# Windows/Mac: https://www.docker.com/products/docker-desktop
# Linux: https://docs.docker.com/engine/install/
```

### Помилка: MongoDB не підключається
```bash
# Перезапустіть контейнер MongoDB
docker-compose restart mongodb

# Чекніть логи
docker-compose logs mongodb
```

### Помилка: Миграції не запустилися
```bash
# Очистіть томи
docker-compose down -v

# Пересбудуйте
docker-compose up --build
```

---

## 📚 Додаткова документація

- [README.md](README.md) - Повна документація
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Структура файлів
- [API Endpoints](README.md#-api-endpoints) - Список усіх endpoints

---

## ✅ Чек-лист перед сдачею

- [ ] Git репозиторій створено і завантажено
- [ ] `docker-compose up --build` запускається успішно
- [ ] Health check відповідає: `http://localhost:3000/api/health`
- [ ] API endpoints працюють (протестовано curl)
- [ ] MongoDB дані завантажені (seed data)
- [ ] README.md заповнений і зрозумілий
- [ ] Миграції запускаються автоматично
- [ ] Немає локальних залежностей (все у Docker)
- [ ] Код добре організований і коментований
- [ ] Проєкт готовий до сдачі! 🎉

---

## 🎓 Курсова робота - Вимоги

✅ **Всі вимоги виконані:**
- GitHub репозиторій з кодом
- Docker Compose для запуску
- Миграції бази даних
- Повна документація (README.md)
- Функціональна система з API
- Якісний код та організація
- Тестування та приклади

---

**Остання оновлення:** 2024-02-14  
**Версія:** 1.0.0  
**Статус:** 🎉 Готово до сдачі!
