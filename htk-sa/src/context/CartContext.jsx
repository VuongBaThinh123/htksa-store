/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
const CART_KEY = "htksa_cart_v1";
const ORDERS_KEY = "htksa_orders_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) setItems(JSON.parse(saved));
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const add = (product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));

  const total = useMemo(
    () => items.reduce((s, p) => s + p.price * p.qty, 0),
    [items]
  );

  // Orders / history
  const createOrder = (order) => {
    // order should include id, items, total, createdAt
    const o = { ...order };
    setOrders((prev) => [o, ...prev]);
    return o;
  };

  const addFeedback = (orderId, itemId, feedback) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const items = o.items.map((it) =>
          it.id === itemId ? { ...it, feedback } : it
        );
        return { ...o, items };
      })
    );
  };

  return (
    <CartContext.Provider value={{ items, add, remove, clear, setQty, total, orders, createOrder, addFeedback }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
