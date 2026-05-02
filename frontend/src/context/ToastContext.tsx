import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 11);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container" style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                pointerEvents: 'none'
            }}>
                {toasts.map((toast) => (
                    <div 
                        key={toast.id} 
                        className={`toast-item reveal-anim ${toast.type}`}
                        style={{
                            minWidth: '320px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            padding: '20px 25px',
                            borderRadius: '8px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            borderLeft: `5px solid ${toast.type === 'success' ? 'var(--secondary)' : toast.type === 'error' ? 'var(--heart)' : 'var(--primary)'}`,
                            pointerEvents: 'auto',
                            transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`} 
                           style={{ color: toast.type === 'success' ? 'var(--secondary)' : toast.type === 'error' ? 'var(--heart)' : 'var(--primary)', fontSize: '1.2rem' }}></i>
                        <div style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>System Protocol</span>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: 'var(--primary)' }}>{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
