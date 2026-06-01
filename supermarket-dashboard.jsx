import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3000/api";

const fetcher = async (path, method = "GET", body = null) => {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const TABS = [
  { id: "dashboard", label: "Панель", icon: "📊" },
  { id: "products", label: "Товари", icon: "🛒" },
  { id: "inventory", label: "Склад", icon: "📦" },
  { id: "orders", label: "Продажі", icon: "🧾" },
  { id: "users", label: "Персонал", icon: "👤" },
  { id: "suppliers", label: "Постачання", icon: "🚚" },
  { id: "reports", label: "Звіти", icon: "📋" },
];

const Badge = ({ children, color = "gray" }) => {
  const colors = {
    green: { bg: "#EAF3DE", text: "#3B6D11", border: "#639922" },
    red: { bg: "#FCEBEB", text: "#A32D2D", border: "#E24B4A" },
    amber: { bg: "#FAEEDA", text: "#854F0B", border: "#BA7517" },
    blue: { bg: "#E6F1FB", text: "#185FA5", border: "#378ADD" },
    gray: { bg: "#F1EFE8", text: "#5F5E5A", border: "#888780" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 500 }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", ...style }}>
    {children}
  </div>
);

const MetricCard = ({ label, value, sub, color = "#185FA5" }) => (
  <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "1rem", minWidth: 0 }}>
    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>{label}</p>
    <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color }}>{value}</p>
    {sub && <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{label}</label>}
    <input style={{ width: "100%", boxSizing: "border-box" }} {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{label}</label>}
    <select style={{ width: "100%", boxSizing: "border-box" }} {...props}>{children}</select>
  </div>
);

const Toast = ({ msg, type, onDismiss }) => {
  if (!msg) return null;
  const bg = type === "error" ? "#FCEBEB" : "#EAF3DE";
  const col = type === "error" ? "#A32D2D" : "#3B6D11";
  return (
    <div onClick={onDismiss} style={{ position: "fixed", bottom: 24, right: 24, background: bg, color: col, border: `1px solid ${col}`, borderRadius: 8, padding: "10px 16px", cursor: "pointer", zIndex: 1000, fontSize: 14, maxWidth: 320 }}>
      {msg}
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <header style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
        <span style={{ fontWeight: 500, fontSize: 16, color: "var(--color-text-primary)", marginRight: 8 }}>🏪 Маркет</span>
        <nav style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? "#185FA5" : "var(--color-background-secondary)",
              border: tab === t.id ? "none" : "0.5px solid var(--color-border-tertiary)",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: tab === t.id ? "#fff" : "var(--color-text-primary)",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              boxShadow: tab === t.id ? "0 2px 4px rgba(24, 95, 165, 0.15)" : "none"
            }}
            onMouseEnter={e => {
              if (tab !== t.id) {
                e.target.style.background = "var(--color-background-primary)";
                e.target.style.borderColor = "var(--color-border-secondary)";
              }
            }}
            onMouseLeave={e => {
              if (tab !== t.id) {
                e.target.style.background = "var(--color-background-secondary)";
                e.target.style.borderColor = "var(--color-border-tertiary)";
              }
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "dashboard" && <Dashboard notify={notify} />}
        {tab === "products" && <Products notify={notify} />}
        {tab === "inventory" && <Inventory notify={notify} />}
        {tab === "orders" && <Orders notify={notify} />}
        {tab === "users" && <Users notify={notify} />}
        {tab === "suppliers" && <Suppliers notify={notify} />}
        {tab === "reports" && <Reports notify={notify} />}
      </main>
      {toast && <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function Dashboard({ notify }) {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetcher("/products"),
      fetcher("/inventory"),
      fetcher("/orders"),
      fetcher("/suppliers"),
    ]).then(([p, i, o, s]) => {
      setProducts(p); setInventory(i); setOrders(o); setSuppliers(s);
    }).catch(e => notify("Помилка завантаження: " + e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "var(--color-text-secondary)" }}>Завантаження...</p>;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const lowStock = inventory.filter(i => i.quantity < 10);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 1.25rem" }}>Огляд системи</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <MetricCard label="Товари" value={products.length} color="#185FA5" />
        <MetricCard label="Позиції на складі" value={inventory.length} color="#0F6E56" />
        <MetricCard label="Замовлення" value={orders.length} color="#534AB7" />
        <MetricCard label="Постачальники" value={suppliers.length} color="#993C1D" />
        <MetricCard label="Виторг (загалом)" value={`₴${totalRevenue.toLocaleString()}`} color="#3B6D11" />
      </div>

      {lowStock.length > 0 && (
        <Card style={{ borderLeft: "3px solid #E24B4A", marginBottom: "1.5rem" }}>
          <p style={{ fontWeight: 500, margin: "0 0 8px", color: "#A32D2D" }}>⚠️ Малий залишок ({lowStock.length} позицій)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {lowStock.map(i => (
              <span key={i.sku} style={{ fontSize: 13, background: "#FCEBEB", color: "#A32D2D", borderRadius: 6, padding: "2px 8px" }}>
                {i.sku} — {i.quantity} шт.
              </span>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <p style={{ fontWeight: 500, margin: "0 0 12px", fontSize: 14 }}>Останні замовлення</p>
          {orders.slice(0, 5).map((o, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{o.order_id}</span>
              <span style={{ fontWeight: 500 }}>₴{(o.total_amount || 0).toLocaleString()}</span>
            </div>
          ))}
          {orders.length === 0 && <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Немає замовлень</p>}
        </Card>
        <Card>
          <p style={{ fontWeight: 500, margin: "0 0 12px", fontSize: 14 }}>Стан складу</p>
          {inventory.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
              <span>{item.sku}</span>
              <Badge color={item.quantity < 10 ? "red" : item.quantity < 50 ? "amber" : "green"}>
                {item.quantity} шт.
              </Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Products({ notify }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ sku: "", name: "", price: "", unit: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetcher("/products").then(setProducts).catch(e => notify(e.message, "error")).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    try {
      if (!form.sku || !form.name || !form.price) { notify("Заповніть обовʼязкові поля", "error"); return; }
      await fetcher("/products", "POST", { ...form, price: parseFloat(form.price) });
      notify("Товар додано ✓");
      setForm({ sku: "", name: "", price: "", unit: "", category: "" });
      setShowForm(false);
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Товари</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          {showForm ? "Скасувати" : "+ Додати товар"}
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontWeight: 500, margin: "0 0 12px" }}>Новий товар</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="SKU *" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="PROD_001" />
            <Input label="Назва *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Хліб пшеничний" />
            <Input label="Ціна (₴) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="25.50" />
            <Input label="Одиниця" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="шт / кг / л" />
            <Input label="Категорія" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Хлібобулочні" />
          </div>
          <button onClick={handleAdd} style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13 }}>
            Зберегти товар
          </button>
        </Card>
      )}

      <input
        placeholder="Пошук за назвою або SKU..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%", boxSizing: "border-box" }}
      />

      {loading ? <p style={{ color: "var(--color-text-secondary)" }}>Завантаження...</p> : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {["SKU", "Назва", "Ціна", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <td style={{ padding: "10px 12px" }}><code style={{ fontSize: 12 }}>{p.sku}</code></td>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "10px 12px" }}>₴{p.price?.toFixed(2)}</td>
                  <td style={{ padding: "10px 12px" }}><Badge color="blue">активний</Badge></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Товари не знайдено</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Inventory({ notify }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustSku, setAdjustSku] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [adjusting, setAdjusting] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetcher("/inventory").then(setStock).catch(e => notify(e.message, "error")).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdjust = async (sku) => {
    try {
      if (!adjustment || isNaN(parseInt(adjustment))) { notify("Введіть числове значення", "error"); return; }
      const result = await fetcher(`/inventory/${sku}`, "PATCH", { adjustment: parseInt(adjustment) });
      notify(`${sku}: нова кількість — ${result.new_quantity} шт. ✓`);
      setAdjusting(null);
      setAdjustment("");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Складський облік</h2>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{stock.length} позицій</span>
      </div>

      {loading ? <p style={{ color: "var(--color-text-secondary)" }}>Завантаження...</p> : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {["SKU", "Кількість", "Місце", "Оновлено", "Дія"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stock.map((item, i) => (
                <>
                  <tr key={i} style={{ borderBottom: adjusting === item.sku ? "none" : "0.5px solid var(--color-border-tertiary)" }}>
                    <td style={{ padding: "10px 12px" }}><code style={{ fontSize: 12 }}>{item.sku}</code></td>
                    <td style={{ padding: "10px 12px" }}>
                      <Badge color={item.quantity < 10 ? "red" : item.quantity < 50 ? "amber" : "green"}>
                        {item.quantity} шт.
                      </Badge>
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{item.location || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)", fontSize: 12 }}>
                      {item.last_updated ? new Date(item.last_updated).toLocaleDateString("uk-UA") : "—"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button
                        onClick={() => setAdjusting(adjusting === item.sku ? null : item.sku)}
                        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer" }}>
                        Коригувати
                      </button>
                    </td>
                  </tr>
                  {adjusting === item.sku && (
                    <tr key={`adj-${i}`} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
                      <td colSpan={5} style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Зміна (+/-)</span>
                          <input
                            type="number"
                            value={adjustment}
                            onChange={e => setAdjustment(e.target.value)}
                            placeholder="-5 або +20"
                            style={{ width: 120 }}
                          />
                          <button onClick={() => handleAdjust(item.sku)} style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Застосувати</button>
                          <button onClick={() => setAdjusting(null)} style={{ background: "transparent", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Скасувати</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {stock.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Склад порожній</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Orders({ notify }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([{ sku: "", quantity: 1 }]);
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const load = useCallback(() => {
    setLoading(true);
    fetcher("/orders").then(setOrders).catch(e => notify(e.message, "error")).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const addItem = () => setItems([...items, { sku: "", quantity: 1 }]);
  const updateItem = (i, field, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSell = async () => {
    try {
      if (!totalAmount || items.some(i => !i.sku)) { notify("Заповніть всі поля", "error"); return; }
      const result = await fetcher("/orders", "POST", {
        items,
        total_amount: parseFloat(totalAmount),
        payment_method: paymentMethod
      });
      notify(`Чек ${result.order_id} створено ✓`);
      setItems([{ sku: "", quantity: 1 }]);
      setTotalAmount("");
      setShowForm(false);
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const PAYMENT_LABELS = { cash: "Готівка", card: "Картка", online: "Онлайн" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Продажі</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          {showForm ? "Скасувати" : "🧾 Новий чек"}
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontWeight: 500, margin: "0 0 12px" }}>Оформлення продажу</p>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 2 }}>
                <Input label={i === 0 ? "SKU товару" : undefined} value={item.sku} onChange={e => updateItem(i, "sku", e.target.value)} placeholder="PROD_001" />
              </div>
              <div style={{ flex: 1 }}>
                <Input label={i === 0 ? "К-сть" : undefined} type="number" min="1" value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value))} />
              </div>
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} style={{ background: "#FCEBEB", color: "#A32D2D", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", marginBottom: 12 }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={addItem} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", marginBottom: 12 }}>+ Додати товар</button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Загальна сума (₴)" type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="150.00" />
            <Select label="Метод оплати" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="cash">Готівка</option>
              <option value="card">Картка</option>
              <option value="online">Онлайн</option>
            </Select>
          </div>
          <button onClick={handleSell} style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13 }}>
            Оформити чек
          </button>
        </Card>
      )}

      {loading ? <p>Завантаження...</p> : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {["Номер чеку", "Дата", "Сума", "Оплата", "Товарів"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <td style={{ padding: "10px 12px" }}><code style={{ fontSize: 12 }}>{o.order_id}</code></td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{new Date(o.timestamp).toLocaleString("uk-UA")}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>₴{(o.total_amount || 0).toFixed(2)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Badge color={o.payment_method === "cash" ? "amber" : o.payment_method === "card" ? "blue" : "green"}>
                      {PAYMENT_LABELS[o.payment_method] || o.payment_method}
                    </Badge>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{o.items?.length || 0}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Немає замовлень</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Users({ notify }) {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ username: "", full_name: "", role: "", access_level: 1 });
  const [showForm, setShowForm] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  const handleSearch = async () => {
    try {
      if (!userId.trim()) { notify("Введіть ID", "error"); return; }
      const data = await fetcher(`/users/${userId.trim()}`);
      setUserData(data);
    } catch (e) { notify("Працівника не знайдено", "error"); setUserData(null); }
  };

  const handleRegister = async () => {
    try {
      if (!form.username || !form.full_name || !form.role) { notify("Заповніть обовʼязкові поля", "error"); return; }
      const result = await fetcher("/users/register", "POST", { ...form, access_level: parseInt(form.access_level) });
      notify(`Працівника зареєстровано. ID: ${result.user_id} ✓`);
      setLastCreated(result);
      setForm({ username: "", full_name: "", role: "", access_level: 1 });
      setShowForm(false);
    } catch (e) { notify(e.message, "error"); }
  };

  const ROLE_COLORS = { admin: "red", manager: "blue", cashier: "green", warehouse: "amber" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Персонал</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          {showForm ? "Скасувати" : "+ Реєстрація"}
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontWeight: 500, margin: "0 0 12px" }}>Реєстрація працівника</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Логін *" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="ivanov_v" />
            <Input label="ПІБ *" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Іванов Василь" />
            <Select label="Роль *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="">Оберіть роль</option>
              <option value="admin">Адміністратор</option>
              <option value="manager">Менеджер</option>
              <option value="cashier">Касир</option>
              <option value="warehouse">Комірник</option>
            </Select>
            <Select label="Рівень доступу" value={form.access_level} onChange={e => setForm({ ...form, access_level: e.target.value })}>
              <option value={1}>1 — Базовий</option>
              <option value={2}>2 — Розширений</option>
              <option value={3}>3 — Адміністратор</option>
            </Select>
          </div>
          <button onClick={handleRegister} style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13 }}>
            Зареєструвати
          </button>
        </Card>
      )}

      {lastCreated && (
        <Card style={{ marginBottom: "1.25rem", borderLeft: "3px solid #0F6E56" }}>
          <p style={{ fontWeight: 500, margin: "0 0 6px", color: "#0F6E56", fontSize: 13 }}>✓ Нещодавно зареєстровано</p>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>ID: <code>{lastCreated.user_id}</code></p>
        </Card>
      )}

      <Card>
        <p style={{ fontWeight: 500, margin: "0 0 12px", fontSize: 14 }}>Пошук за ID</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Введіть MongoDB ID..."
            style={{ flex: 1 }}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>Знайти</button>
        </div>

        {userData && (
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, color: "#185FA5" }}>
                {userData.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>{userData.full_name}</p>
                <div style={{ marginTop: 4 }}>
                  <Badge color={ROLE_COLORS[userData.role] || "gray"}>{userData.role}</Badge>
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Badge color={userData.work_status === "active" ? "green" : "red"}>
                  {userData.work_status === "active" ? "активний" : "неактивний"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Suppliers({ notify }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [contractItems, setContractItems] = useState([{ sku: "", qty: 1 }]);

  useEffect(() => {
    fetcher("/suppliers").then(setSuppliers).catch(e => notify(e.message, "error")).finally(() => setLoading(false));
  }, []);

  const addItem = () => setContractItems([...contractItems, { sku: "", qty: 1 }]);
  const updateItem = (i, field, val) => setContractItems(contractItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const handleContract = async () => {
    try {
      if (!supplierId || contractItems.some(i => !i.sku)) { notify("Заповніть всі поля", "error"); return; }
      const result = await fetcher("/supply-contracts", "POST", { supplier_id: supplierId, items: contractItems });
      notify(`Контракт ${result.contract_id} створено ✓`);
      setShowForm(false);
      setContractItems([{ sku: "", qty: 1 }]);
      setSupplierId("");
    } catch (e) { notify(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Постачальники</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          {showForm ? "Скасувати" : "+ Контракт"}
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontWeight: 500, margin: "0 0 12px" }}>Новий контракт на поставку</p>
          <Select label="Постачальник" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
            <option value="">Оберіть постачальника</option>
            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name} ({s.supplier_id})</option>)}
          </Select>
          <p style={{ fontSize: 13, fontWeight: 500, margin: "8px 0 8px", color: "var(--color-text-secondary)" }}>Товари:</p>
          {contractItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 2 }}>
                <Input label={i === 0 ? "SKU" : undefined} value={item.sku} onChange={e => updateItem(i, "sku", e.target.value)} placeholder="PROD_001" />
              </div>
              <div style={{ flex: 1 }}>
                <Input label={i === 0 ? "К-сть" : undefined} type="number" min="1" value={item.qty} onChange={e => updateItem(i, "qty", parseInt(e.target.value))} />
              </div>
            </div>
          ))}
          <button onClick={addItem} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", marginBottom: 12, display: "block" }}>+ Позиція</button>
          <button onClick={handleContract} style={{ background: "#0F6E56", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13 }}>
            Створити контракт
          </button>
        </Card>
      )}

      {loading ? <p>Завантаження...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {suppliers.map((s, i) => (
            <Card key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#854F0B", fontWeight: 500 }}>
                  {s.name?.[0] || "?"}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{s.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}><code>{s.supplier_id}</code></p>
                </div>
              </div>
              <Badge color="amber">постачальник</Badge>
            </Card>
          ))}
          {suppliers.length === 0 && <p style={{ color: "var(--color-text-secondary)", gridColumn: "1/-1" }}>Немає постачальників</p>}
        </div>
      )}
    </div>
  );
}

function Reports({ notify }) {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetcher("/admin/expired-report");
      setReport(data);
      if (data.length === 0) notify("Прострочених товарів не знайдено ✓");
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 1.25rem" }}>Звіти</h2>

      <Card style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontWeight: 500, margin: "0 0 4px" }}>Звіт по термінах придатності</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>Товари, термін придатності яких спливає протягом 10 днів</p>
          </div>
          <button onClick={loadReport} disabled={loading} style={{ background: loading ? "#B4B2A9" : "#A32D2D", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: loading ? "default" : "pointer", fontSize: 13, whiteSpace: "nowrap" }}>
            {loading ? "Формується..." : "📋 Сформувати"}
          </button>
        </div>
      </Card>

      {report.length > 0 && (
        <Card>
          <p style={{ fontWeight: 500, margin: "0 0 12px", fontSize: 14, color: "#A32D2D" }}>
            ⚠️ Знайдено {report.length} позицій
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {["SKU", "Термін придатності", "Днів залишилось"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.map((item, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <td style={{ padding: "10px 12px" }}><code style={{ fontSize: 12 }}>{item.sku}</code></td>
                  <td style={{ padding: "10px 12px" }}>{item.expiry_date}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Badge color={item.days_left <= 0 ? "red" : item.days_left <= 3 ? "red" : "amber"}>
                      {item.days_left <= 0 ? "прострочено" : `${item.days_left} дн.`}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
