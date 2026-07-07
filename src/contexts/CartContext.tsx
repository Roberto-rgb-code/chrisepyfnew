'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface ImageControls {
  scale: number;
  rotation: number;
  flipX: number;
  flipY: number;
  position: { x: number; y: number };
}

export interface CartItem {
  id: string;
  modelName: string;
  colorURL: string;
  maskURL: string;
  customImage: string;
  price: number;
  quantity: number;
  imageControls: ImageControls;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const mergedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadCart = () => {
      if (user) {
        const userKey = `cart_${user.uid}`;
        const guestCart = localStorage.getItem('cart_guest');
        const userCart = localStorage.getItem(userKey);

        if (guestCart && !mergedRef.current) {
          try {
            const guestItems: CartItem[] = JSON.parse(guestCart);
            const userItems: CartItem[] = userCart ? JSON.parse(userCart) : [];
            const merged = [...userItems, ...guestItems];
            localStorage.setItem(userKey, JSON.stringify(merged));
            localStorage.removeItem('cart_guest');
            setCart(merged);
            mergedRef.current = true;
            return;
          } catch {
            localStorage.removeItem('cart_guest');
          }
        }

        if (userCart) {
          try {
            setCart(JSON.parse(userCart));
          } catch {
            localStorage.removeItem(userKey);
            setCart([]);
          }
        } else {
          setCart([]);
        }
      } else {
        mergedRef.current = false;
        const guestCart = localStorage.getItem('cart_guest');
        if (guestCart) {
          try {
            setCart(JSON.parse(guestCart));
          } catch {
            localStorage.removeItem('cart_guest');
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    };

    loadCart();
  }, [user?.uid]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      localStorage.removeItem(cartKey);
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}
