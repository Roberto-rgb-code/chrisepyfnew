'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { PhoneModel } from '@/data/phoneData';
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

  // Cargar carrito del localStorage (específico por usuario)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          localStorage.removeItem(cartKey);
        }
      } else {
        setCart([]); // Limpiar carrito si no hay datos para este usuario
      }
    }
  }, [user]);

  // Guardar carrito en localStorage (específico por usuario)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item: CartItem) => {
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prevCart, item];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
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
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    // Limpiar también del localStorage
    if (typeof window !== 'undefined') {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      localStorage.removeItem(cartKey);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

