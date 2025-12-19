import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlan } from '../types';
import { CloseIcon, CreditCardIcon, PayPalIcon, GooglePayIcon, ApplePayIcon } from './icons';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy Credit Card Form Component
const CreditCardForm: React.FC<{ plan: SubscriptionPlan, onPayment: () => void, isProcessing: boolean }> = ({ plan, onPayment, isProcessing }) => (
  <form onSubmit={(e) => { e.preventDefault(); onPayment(); }} className="space-y-4 mt-6">
    <div>
      <label htmlFor="cardName" className="block text-sm font-medium text-gray-300">Name on Card</label>
      <input type="text" id="cardName" required className="mt-1 block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
    <div>
      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number</label>
      <input type="text" id="cardNumber" placeholder="•••• •••• •••• ••••" required className="mt-1 block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
    <div className="flex gap-4">
      <div className="flex-1">
        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300">Expiry Date</label>
        <input type="text" id="cardExpiry" placeholder="MM / YY" required className="mt-1 block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary" />
      </div>
      <div className="flex-1">
        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-300">CVC</label>
        <input type="text" id="cardCvc" placeholder="•••" required className="mt-1 block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary" />
      </div>
    </div>
    <p className="text-xs text-gray-500 text-center pt-2">Your payment information is securely processed.</p>
    <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-3 mt-4 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-hover text-white disabled:bg-gray-600 disabled:cursor-wait"
      >
        {isProcessing ? `Processing...` : `Pay ${plan.price}`}
      </button>
  </form>
);


export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'card' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
        alert(`Successfully subscribed to the ${selectedPlan?.name} plan!`);
        setIsProcessing(false);
        setSelectedPlan(null);
        setActivePaymentMethod(null);
        onClose();
    }, 2000);
  };
  
  const handleClose = () => {
    setSelectedPlan(null);
    setActivePaymentMethod(null);
    setIsProcessing(false);
    onClose();
  }

  const renderPlanSelection = () => (
    <>
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
        <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <CloseIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto">
        <p className="text-center text-gray-400 mb-8">Unlock all AI modules and enjoy unlimited messaging with a premium subscription.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className={`relative flex flex-col border rounded-lg p-6 text-center transition-all duration-300 ${plan.highlight ? 'border-primary scale-105 bg-gray-900' : 'border-gray-700 bg-gray-800 hover:border-primary'}`}>
              {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                  </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </p>
              <ul className="text-left space-y-2 text-gray-300 flex-grow mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.highlight ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-gray-700 hover:bg-primary text-white'}`}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderPaymentView = () => {
    if (!selectedPlan) return null;
    
    const PaymentMethodButton: React.FC<{ onClick: () => void; children: React.ReactNode, active?: boolean }> = ({ onClick, children, active }) => (
        <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${active ? 'bg-primary/20 border-primary' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
            {children}
        </button>
    );

    return (
        <>
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <button onClick={() => { setSelectedPlan(null); setActivePaymentMethod(null); }} className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>
                <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <CloseIcon className="w-6 h-6 text-gray-400" />
                </button>
            </div>
            <div className="p-8 overflow-y-auto">
                <div className="bg-gray-900 p-4 rounded-lg mb-6 text-center">
                    <p className="text-gray-400">You're subscribing to the <span className="font-bold text-primary">{selectedPlan.name}</span> plan.</p>
                    <p className="text-2xl font-bold text-white">{selectedPlan.price} <span className="text-base font-normal text-gray-400">{selectedPlan.period}</span></p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <PaymentMethodButton onClick={() => setActivePaymentMethod('card')} active={activePaymentMethod === 'card'}>
                            <CreditCardIcon className="w-5 h-5" /> Credit Card
                        </PaymentMethodButton>
                        <PaymentMethodButton onClick={handlePayment}>
                            <PayPalIcon className="w-5 h-5" /> PayPal
                        </PaymentMethodButton>
                        <PaymentMethodButton onClick={handlePayment}>
                            <GooglePayIcon className="w-5 h-5" /> Google Pay
                        </PaymentMethodButton>
                        <PaymentMethodButton onClick={handlePayment}>
                            <ApplePayIcon className="w-5 h-5" /> Apple Pay
                        </PaymentMethodButton>
                    </div>

                    {activePaymentMethod === 'card' && <CreditCardForm plan={selectedPlan} onPayment={handlePayment} isProcessing={isProcessing} />}
                </div>

            </div>
        </>
    );
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300"
           style={{ maxWidth: selectedPlan ? '480px' : '900px' }}>
        {selectedPlan ? renderPaymentView() : renderPlanSelection()}
      </div>
    </div>
  );
};