import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { IUser } from '../types';

interface FlutterwaveResponse {
  status: string;
  transaction_id: number;
  tx_ref: string;
}

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  userInfo: IUser;
  onOrderPlaced: (response: FlutterwaveResponse) => void;
  setError: (error: string) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({ 
  amount, 
  email, 
  userInfo, 
  onOrderPlaced, 
  setError 
}) => {
  const config = {
    public_key: (import.meta as any).env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: userInfo.phone || '0000000000',
      name: userInfo.name,
    },
    customizations: {
      title: 'VICTORIA BABY ESSENTIALS',
      description: 'Bespoke Neonatal Procurement Manifest',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-abstract-logo-template.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="flutterwave-container reveal-anim">
        <div style={{ 
            background: 'rgba(0,0,0,0.02)', 
            padding: '35px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            border: '1px dashed var(--gray-200)',
            marginBottom: '35px'
        }}>
            <i className="fas fa-university" style={{ color: 'var(--secondary)', fontSize: '2.5rem', marginBottom: '20px', display: 'block' }}></i>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Rave Security Node</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>You are about to authorize a ₦{amount.toLocaleString()} manifest via the Flutterwave banking infrastructure.</p>
        </div>

        <button 
            className="btn btn-primary" 
            onClick={() => {
                handleFlutterPayment({
                    callback: (response: any) => {
                        if (response.status === "successful") {
                            onOrderPlaced(response as FlutterwaveResponse);
                        } else {
                            setError('Financial authorization declined by the gateway.');
                        }
                        closePaymentModal();
                    },
                    onClose: () => {
                        setError('Authorization protocol was interrupted.');
                    },
                });
            }}
            style={{ width: '100%', padding: '22px', letterSpacing: '3px', fontWeight: 700 }}
        >
            AUTHORIZE WITH FLUTTERWAVE
        </button>
    </div>
  );
};

export default FlutterwavePayment;
