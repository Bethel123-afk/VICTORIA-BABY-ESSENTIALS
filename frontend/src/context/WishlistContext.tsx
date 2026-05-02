import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useToast } from './ToastContext';
import { IProduct } from '../types';

interface WishlistContextType {
  wishlistItems: IProduct[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const userInfo = authContext?.userInfo;
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);
  const { addToast } = useToast();

  // Sync with Backend or LocalStorage on mount/auth change
  useEffect(() => {
    const fetchWishlist = async () => {
      if (userInfo) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get('/api/users/wishlist', config);
          setWishlistItems(data);
          localStorage.setItem('wishlistItems', JSON.stringify(data));
        } catch (error) {
          console.error('Failed to fetch wishlist from backend', error);
        }
      } else {
        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
          try {
            setWishlistItems(JSON.parse(storedWishlist));
          } catch (e) {
            console.error('Failed to parse wishlist info', e);
          }
        }
      }
    };

    fetchWishlist();
  }, [userInfo]);

  const syncBackend = async (items: IProduct[]) => {
    if (userInfo) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.post('/api/users/wishlist', { wishlistItems: items.map(i => i._id) }, config);
      } catch (error) {
        console.error('Failed to sync wishlist to backend', error);
      }
    }
  };

  const addToWishlist = (product: IProduct) => {
    const existItem = wishlistItems.find((x) => x._id === product._id);
    let newItems: IProduct[];

    if (existItem) {
      newItems = wishlistItems.filter((x) => x._id !== product._id);
      addToast(`${product.name} extracted from Registry`, 'info');
    } else {
      newItems = [...wishlistItems, product];
      addToast(`${product.name} archived in Registry`, 'success');
    }

    setWishlistItems(newItems);
    localStorage.setItem('wishlistItems', JSON.stringify(newItems));
    syncBackend(newItems);
  };

  const removeFromWishlist = (id: string) => {
    const newItems = wishlistItems.filter((x) => x._id !== id);
    setWishlistItems(newItems);
    localStorage.setItem('wishlistItems', JSON.stringify(newItems));
    syncBackend(newItems);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlistItems');
    syncBackend([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export default WishlistContext;
