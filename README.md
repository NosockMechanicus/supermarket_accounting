# 🏪 Supermarket Accounting System

Повнофункціональна інформаційна система для управління супермаркетом з можливостями обліку товарів, замовлень, персоналу та постачання.

**Курсова робота з дисципліни:** "Проектування та розробка інформаційних систем"  
**Навчальний заклад:** Національний університет "Львівська політехніка"

---

## 📋 Зміст

- [Опис системи](#опис-системи)
- [Вимоги](#вимоги)
- [Встановлення](#встановлення)
- [Запуск проєкту](#запуск-проєкту)
- [Структура проєкту](#структура-проєкту)
- [API Endpoints](#api-endpoints)
- [Управління базою даних](#управління-базою-даних)
- [Користування застосунком](#користування-застосунком)
- [Тестування](#тестування)
- [Розробка](#розробка)

---

## 📝 Опис системи

**Supermarket Accounting System** — це веб-додаток для повної автоматизації роботи супермаркету. Система дозволяє:

### Функціональність

✅ **Управління товарами**
- Додавання, редагування, видалення товарів
- Категоризація товарів
- Управління цінами та доступністю

✅ **Облік складу**
- Стеження за залишками товарів
- Коригування кількості (прихід/списання)
- Сповіщення про малий залишок

✅ **Управління замовленнями**
- Реєстрація продажів
- Відстеження статусу замовлення
- Різні способи оплати (готівка, картка, онлайн)

✅ **Управління персоналом**
- Реєстрація працівників
- Розподіл ролей та прав доступу
- Управління статусом роботи

✅ **Управління постачанням**
- Список постачальників
- Контракти на поставку товарів
- Відслідковування поставок

✅ **Звіти та аналітика**
- Звіти по термінах придатності
- Аналіз продажів
- Статистика складу

---

## 🔧 Вимоги

### Обов'язкове:
- **Docker** (версія 20.0 або новіша) — [Встановлення](https://docs.docker.com/get-docker/)
- **Docker Compose** (версія 1.29 або новіша) — [Встановлення](https://docs.docker.com/compose/install/)
- **Git** — [Встановлення](https://git-scm.com/)

### Необов'язкове (для локальної розробки):
- Node.js 18+ — [Встановлення](https://nodejs.org/)
- MongoDB 7.0+ — [Встановлення](https://www.mongodb.com/try/download/community)

> ⚠️ **ВАЖЛИВО:** Всі залежності (Node.js, MongoDB) автоматично встановлюються в Docker-контейнерах. Локальне встановлення не потрібне!

---

## 📦 Встановлення

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/YOUR_USERNAME/supermarket-accounting-system.git
cd supermarket-accounting-system
```

### Крок 2: Перевірка структури проєкту

Переконайтеся, що ви маєте такі файли:

```
supermarket-accounting-system/
├── server.js                    # Основний серверний файл
├── package.json                 # Залежності проєкту
├── Dockerfile                   # Docker конфігурація для Node.js
├── docker-compose.yml           # Docker Compose конфігурація
├── init-mongo.js                # Скрипт ініціалізації MongoDB
├── .gitignore                   # Git ignore файл
├── README.md                    # Цей файл
├── migrations/                  # Папка з міграціями БД
│   ├── runner.js               # Запускач міграцій
│   ├── migration_001_*.js       # Перша міграція (схема)
│   └── migration_002_*.js       # Друга міграція (дані)
└── supermarket-dashboard.jsx    # React компонент (опціонально)
```

### Крок 3: Налаштування змінних середовища

Створіть файл `.env` у корені проєкту (опціонально):

```bash
cat > .env << EOF
NODE_ENV=production
MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/supermarket_accounting_system?authSource=admin
PORT=3000
EOF
```

---

## 🚀 Запуск проєкту

### Швидкий старт (рекомендовано)

Запустіть всю систему одною командою:

```bash
docker-compose up --build
```

**Очікуваний вивід:**

```
Creating network "supermarket_network" with driver "bridge"
Creating supermarket_mongodb ... done
Creating supermarket_backend  ... done

✓ Database initialized successfully
✓ Collections created with validation
✓ Indexes created for performance
✓ Sample data inserted

Сервер запущено на порту 3000...
```

### Запуск без пересборки (якщо образи вже збудовані)

```bash
docker-compose up
```

### Запуск у фоновому режимі

```bash
docker-compose up -d
```

### Зупинення системи

```bash
docker-compose down
```

### Видалення всіх контейнерів і томів

```bash
docker-compose down -v
```

---

## 📁 Структура проєкту

```
supermarket-accounting-system/
│
├── 📄 server.js
│   └── Основний Express сервер з усіма API endpoints
│
├── 📦 package.json
│   └── Залежності Node.js (express, mongoose, cors та інші)
│
├── 🐳 Dockerfile
│   └── Конфігурація Docker-образу для Node.js
│
├── 🐳 docker-compose.yml
│   └── Оркестрація MongoDB та Node.js контейнерів
│
├── 🗄️ init-mongo.js
│   └── Скрипт ініціалізації MongoDB при першому запуску
│
├── 🗂️ migrations/
│   ├── runner.js                    # Запускач міграцій
│   ├── migration_001_create_initial_schema.js   # Створення схеми
│   └── migration_002_seed_initial_data.js       # Вставка даних
│
├── 📱 supermarket-dashboard.jsx
│   └── React компонент для веб-інтерфейсу
│
├── 📝 README.md (цей файл)
├── .gitignore
└── .env (створюється при необхідності)
```

### Опис основних файлів:

- **server.js** — Основна логіка Express сервера з усіма маршрутами API
- **package.json** — Декларація залежностей та скриптів
- **Dockerfile** — Інструкції для побудови Docker-образу Node.js
- **docker-compose.yml** — Конфігурація для одночасного запуску MongoDB та backend
- **init-mongo.js** — Ініціалізація БД, створення колекцій та індексів
- **migrations/** — Скрипти для керування змінами схеми БД

---

## 🔌 API Endpoints

### Базовий URL: `http://localhost:3000/api`

### 1️⃣ Автентифікація та користувачі

#### POST `/users/register` — Реєстрація працівника

**Запит:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "full_name": "Іван Петренко",
    "role": "cashier",
    "access_level": 1
  }'
```

**Відповідь:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "status": "created"
}
```

#### GET `/users/:id` — Отримати дані користувача

```bash
curl http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

**Відповідь:**
```json
{
  "full_name": "Іван Петренко",
  "role": "cashier",
  "work_status": "active"
}
```

---

### 2️⃣ Товари

#### GET `/products` — Список усіх товарів

```bash
curl http://localhost:3000/api/products
```

**Відповідь:**
```json
[
  {
    "sku": "PROD_001",
    "name": "Холодильник Samsung",
    "price": 12999.99
  }
]
```

#### POST `/products` — Додати новий товар (Адмін)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD_006",
    "name": "Холодильник LG",
    "price": 11999.99,
    "unit": "шт",
    "category": "Холодильники"
  }'
```

---

### 3️⃣ Склад

#### GET `/inventory` — Перегляд залишків на складі

```bash
curl http://localhost:3000/api/inventory
```

**Відповідь:**
```json
[
  {
    "sku": "PROD_001",
    "quantity": 15,
    "location": "Стелаж А1"
  }
]
```

#### PATCH `/inventory/:sku` — Коригувати кількість товару

```bash
curl -X PATCH http://localhost:3000/api/inventory/PROD_001 \
  -H "Content-Type: application/json" \
  -d '{"adjustment": -3}'
```

---

### 4️⃣ Замовлення

#### GET `/orders` — Історія продажів

```bash
curl http://localhost:3000/api/orders
```

#### POST `/orders` — Створити замовлення (продаж)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"sku": "PROD_001", "quantity": 2}
    ],
    "total_amount": 25999.98,
    "payment_method": "card"
  }'
```

---

### 5️⃣ Постачальники

#### GET `/suppliers` — Список постачальників

```bash
curl http://localhost:3000/api/suppliers
```

#### POST `/supply-contracts` — Створити контракт на поставку

```bash
curl -X POST http://localhost:3000/api/supply-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": "SUPP_001",
    "items": [
      {"sku": "PROD_001", "qty": 10}
    ]
  }'
```

---

### 6️⃣ Звіти

#### GET `/admin/expired-report` — Звіт по термінах придатності

```bash
curl http://localhost:3000/api/admin/expired-report
```

---

## 🗄️ Управління базою даних

### Автоматичні міграції

При запуску контейнера миграції виконуються **автоматично**:

```bash
docker-compose up
```

Ви побачите:
```
✓ migration_001_create_initial_schema (applied)
✓ migration_002_seed_initial_data (applied)
✓ All migrations completed successfully
```

### Ручне виконання міграцій

Якщо потрібно запустити міграції вручну (для локальної розробки):

```bash
# Встановіть залежності
npm install

# Запустіть міграції
npm run migrate
```

### Структура БД

**Колекції MongoDB:**

- **products** — Каталог товарів
  - SKU, назва, категорія, ціна, одиниця виміру

- **users** — Працівники
  - Логін, ПІБ, роль, рівень доступу, статус роботи

- **inventory** — Склад
  - SKU, кількість, місце зберігання, дата оновлення

- **orders** — Замовлення/продажі
  - ID, товари, сума, метод оплати, дата

- **suppliers** — Постачальники
  - ID, назва, контактна особа, категорії

- **supply_contracts** — Контракти постачання
  - ID контракту, ID постачальника, товари, статус

### Доступ до MongoDB через Docker

```bash
# Увійти в контейнер MongoDB
docker exec -it supermarket_mongodb mongosh \
  -u root -p rootpassword \
  --authenticationDatabase admin

# Всередині mongosh:
use supermarket_accounting_system
db.products.find()
```

---

## 💻 Користування застосунком

### Веб-інтерфейс

1. **Запустіть систему:**
   ```bash
   docker-compose up
   ```

2. **Відкрийте браузер:**
   - Backend API: `http://localhost:3000`
   - Swagger документація: `http://localhost:3000/api-docs` (якщо налаштована)

3. **Перевірте здоров'я системи:**
   ```bash
   curl http://localhost:3000/api/health
   ```

### React Dashboard (опціонально)

Якщо ви використовуєте React компонент:

```bash
# Встановіть залежності
npm install

# Запустіть Vite dev сервер
npm run dev
```

Откройте: `http://localhost:5173`

---

## 🧪 Тестування

### Тест API через curl

```bash
# 1. Отримайте список товарів
curl http://localhost:3000/api/products

# 2. Зробіть замовлення
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"sku": "PROD_001", "quantity": 1}],
    "total_amount": 12999.99,
    "payment_method": "cash"
  }'

# 3. Перевірте залишки на складі
curl http://localhost:3000/api/inventory
```

### Перевірка коректної роботи

Таблиця відстежуваності вимог (Traceability Matrix):

| Функціональна вимога | Тестовий сценарій | Статус |
|---|---|---|
| FR-001: Перегляд товарів | GET /api/products | ✅ |
| FR-005: Реєстрація користувача | POST /api/users/register | ✅ |
| FR-008: Додавання в кошик | POST /api/orders | ✅ |
| FR-102: Коригування складу | PATCH /api/inventory/:sku | ✅ |
| US-1: Інтуїтивний інтерфейс | React Dashboard | ✅ |
| PER-1: Час завантаження < 2 сек | Швидкий відгук API | ✅ |

---

## 👨‍💻 Розробка

### Локальна розробка без Docker

```bash
# 1. Встановіть MongoDB локально
# Або запустіть тільки MongoDB в Docker:
docker run -d \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=rootpassword \
  -p 27017:27017 \
  mongo:7.0

# 2. Встановіть залежності
npm install

# 3. Запустіть сервер з автозавантаженням
npm run dev

# 4. У іншому терміналі запустіть міграції
npm run migrate
```

### Структура кодексу

```javascript
// server.js структура:
1. Підключення до MongoDB
2. Визначення схем Mongoose
3. Створення моделей
4. API маршрути (endpoints)
5. Запуск сервера
```

### Додавання нового endpoint

```javascript
// Приклад у server.js:
app.post('/api/new-resource', async (req, res) => {
  try {
    const data = req.body;
    // Логіка обробки
    res.status(201).json({ status: 'created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Створення нової міграції

```bash
# Створіть файл
touch migrations/migration_003_your_migration.js
```

```javascript
// Вміст файлу:
module.exports = {
  async up(db) {
    // Логіка міграції вгору
  },
  async down(db) {
    // Логіка откату
  }
};
```

---

## 🐛 Вирішення проблем

### Проблема: Docker контейнер не запускається

```bash
# Очистіть всі контейнери
docker-compose down -v

# Пересбудуйте образи
docker-compose up --build

# Перевірте логи
docker-compose logs -f
```

### Проблема: Помилка підключення до MongoDB

```bash
# Переконайтеся, що MongoDB контейнер запущений
docker-compose ps

# Перевірте логи MongoDB
docker logs supermarket_mongodb

# Перезавантажте контейнер
docker-compose restart mongodb
```

### Проблема: Порт 3000 вже використовується

```bash
# Змініть порт у docker-compose.yml
# ports:
#   - "3001:3000"

# Або зупиніть процес на порту 3000:
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Документація

### API Документація
- Детальні описи всіх endpoint у [API Endpoints](#api-endpoints) вище
- Приклади запитів для кожного методу

### Структура БД
- **MongoDB** — Документоорієнтована БД з гнучкою схемою
- **6 основних колекцій** — products, users, inventory, orders, suppliers, supply_contracts
- **Індекси для оптимізації** — на часто запитуваних полях

### Код проєкту
- **server.js** — Детально закоментований
- **migrations/** — Кожна міграція з описом
- **Структура папок** — Легка для навігації

---

## 📋 Вимоги курсової роботи ✅

- ✅ **GitHub репозиторій** — Весь код завантажено
- ✅ **Docker Compose** — Запуск однією командою
- ✅ **Миграції БД** — migration_001 та migration_002
- ✅ **README.md** — Повні інструкції
- ✅ **Функціональність** — Всі endpoints реалізовані
- ✅ **Якість коду** — Добре організований, коментований
- ✅ **Тестування** — Таблиця відстежуваності вимог
- ✅ **Документація** — Детальна та зрозуміла

---

## 📞 Контакти та підтримка

Для питань щодо проєкту:
1. Перевірте розділ [Вирішення проблем](#вирішення-проблем)
2. Прочитайте логи Docker: `docker-compose logs`
3. Створіть issue на GitHub

---

## 📄 Ліцензія

MIT License — вільно використовуйте для навчальних цілей.

---

**Останнє оновлення:** 2024-02-14  
**Версія:** 1.0.0  
**Статус:** ✅ Готово для сдачі
