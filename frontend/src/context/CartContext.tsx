import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useToast } from './ToastContext';
import { ICartItem, IProduct } from '../types';

interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (product: IProduct, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart info', e);
      }
    }
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product: IProduct, qty: number = 1) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    let newItems: ICartItem[];
    if (existItem) {
      newItems = cartItems.map((x) =>
        x.product === existItem.product ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      newItems = [...cartItems, { 
        product: product._id, 
        name: product.name, 
        image: product.image, 
        price: product.price, 
        countInStock: product.countInStock,
        qty 
      }];
    }
    
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    
    addToast(`${product.name} integrated into Procurement Bag`, 'success');
    openDrawer();
  };

  const removeFromCart = (id: string) => {
    const newItems = cartItems.filter((x) => x.product !== id);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
