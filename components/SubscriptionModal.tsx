import React, { useState, useEffect, useCallback } from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlan } from '../types';
import { CloseIcon, CreditCardIcon, GooglePayIcon, SuccessIcon, ErrorIcon } from './icons';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy Credit Card Form Component
const CreditCardForm: React.FC<{ plan: SubscriptionPlan, onPayment: () => void, isProcessing: boolean }> = ({ plan, onPayment, isProcessing }) => (
  <form onSubmit={(e) => { e.preventDefault(); onPayment(); }} className="space-y-4 mt-6 animate-fade-in">
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
        className="w-full py-3 mt-4 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-hover text-white disabled:bg-gray-600 disabled:cursor-wait flex justify-center items-center"
      >
        {isProcessing ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
            </>
        ) : (
            `Pay ${plan.price}`
        )}
      </button>
  </form>
);

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'card' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [canUseGooglePay, setCanUseGooglePay] = useState(false);
  const [nativePaymentMessage, setNativePaymentMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!selectedPlan || !window.PaymentRequest) {
      setCanUseGooglePay(false);
      return;
    }

    const checkPaymentMethod = async (method: string) => {
      try {
        const supportedInstruments = [{ supportedMethods: method }];
        const details = { total: { label: 'Total', amount: { currency: 'USD', value: '0.01' } } };
        const request = new PaymentRequest(supportedInstruments, details);
        return await request.canMakePayment();
      } catch (e) { return false; }
    };

    const checkGooglePayAvailability = async () => {
        const googlePayAvailable = await checkPaymentMethod('https://google.com/pay');
        setCanUseGooglePay(googlePayAvailable);
    };

    checkGooglePayAvailability();
  }, [selectedPlan]);


  if (!isOpen) return null;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };
  
  const handleSimulatedPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      if (Math.random() > 0.1) { setPaymentStatus('success'); } 
      else { setPaymentStatus('error'); }
    }, 2500);
  };

  const handleGooglePay = useCallback(async () => {
    if (!selectedPlan || !window.PaymentRequest) return;
    
    setPaymentStatus('processing');
    setNativePaymentMessage('Follow the instructions on your device to complete the payment...');

    const paymentMethodIdentifier = 'https://google.com/pay';
    const supportedInstruments = [{ supportedMethods: paymentMethodIdentifier, data: { environment: "TEST", apiVersion: 2, apiVersionMinor: 0, merchantInfo: { merchantName: "ChatXAI" }, allowedPaymentMethods: [{ type: "CARD", parameters: { allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], allowedCardNetworks: ["MASTERCARD", "VISA"] }, tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "example", gatewayMerchantId: "exampleGatewayMerchantId" } } }] } }];
    const priceValue = selectedPlan.price.replace('$', '');
    const details = { id: `order-${Date.now()}`, total: { label: `${selectedPlan.name} Plan`, amount: { currency: 'USD', value: priceValue } } };
    
    try {
      const request = new PaymentRequest(supportedInstruments, details);
      const paymentResponse = await request.show();
      await paymentResponse.complete('success');
      setPaymentStatus('success');
    } catch (error) {
      console.error('Google Pay failed:', error);
      setPaymentStatus('error');
    } finally {
      setNativePaymentMessage(null);
    }
  }, [selectedPlan]);

  const handleClose = () => {
    setSelectedPlan(null);
    setActivePaymentMethod(null);
    setPaymentStatus('idle');
    onClose();
  }

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setActivePaymentMethod(null);
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
              {plan.highlight && ( <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full"> MOST POPULAR </div> )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="mb-4"> <span className="text-4xl font-bold">{plan.price}</span> <span className="text-gray-400">{plan.period}</span> </p>
              <ul className="text-left space-y-2 text-gray-300 flex-grow mb-6">
                {plan.features.map((feature, index) => ( <li key={index} className="flex items-start"> <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <span>{feature}</span> </li> ))}
              </ul>
              <button onClick={() => handleSelectPlan(plan)} className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.highlight ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-gray-700 hover:bg-primary text-white'}`} > Subscribe </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderPaymentView = () => {
    if (!selectedPlan) return null;
    
    if (paymentStatus === 'processing' && nativePaymentMessage) {
      return (
          <>
              <div className="flex items-center justify-center p-6 border-b border-gray-700">
                  <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
              </div>
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <svg className="animate-spin h-12 w-12 text-primary mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-300">{nativePaymentMessage}</p>
              </div>
          </>
      );
    }

    if (paymentStatus === 'success' || paymentStatus === 'error') {
      const isSuccess = paymentStatus === 'success';
      return (
          <>
              <div className="flex items-center justify-center p-6 border-b border-gray-700"> <h2 className="text-2xl font-bold text-white">{isSuccess ? 'Payment Successful' : 'Payment Failed'}</h2> </div>
              <div className="p-8 text-center flex flex-col items-center justify-center">
                  {isSuccess ? <SuccessIcon className="w-16 h-16 text-green-400 mb-4" /> : <ErrorIcon className="w-16 h-16 text-red-500 mb-4" />}
                  <h3 className="text-xl font-semibold mb-2">{isSuccess ? 'Welcome to Premium!' : 'Something went wrong.'}</h3>
                  <p className="text-gray-400 mb-6"> {isSuccess ? `You have successfully subscribed to the ${selectedPlan.name} plan. All premium features are now unlocked.` : 'We were unable to process your payment. Please check your details and try again.'} </p>
                  <button onClick={isSuccess ? handleClose : () => setPaymentStatus('idle')} className="w-full py-3 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-hover text-white"> {isSuccess ? 'Start Exploring' : 'Try Again'} </button>
              </div>
          </>
      )
    }

    const PaymentMethodButton: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean; disabled?: boolean; className?: string }> = ({ onClick, children, active, disabled, className }) => (
        <button onClick={onClick} disabled={disabled} className={`w-full flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${active ? 'bg-primary/20 border-primary' : 'bg-gray-700 border-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'} ${className}`}> {children} </button>
    );

    return (
        <>
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <button onClick={handleBackToPlans} className="text-sm text-gray-300 hover:text-white flex items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg> Back </button>
                <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors"> <CloseIcon className="w-6 h-6 text-gray-400" /> </button>
            </div>
            <div className="p-8 overflow-y-auto">
                <div className="bg-gray-900 p-4 rounded-lg mb-6 text-center">
                    <p className="text-gray-400">You're subscribing to the <span className="font-bold text-primary">{selectedPlan.name}</span> plan.</p>
                    <p className="text-2xl font-bold text-white">{selectedPlan.price} <span className="text-base font-normal text-gray-400">{selectedPlan.period}</span></p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Select Payment Method</h3>
                    <div className="space-y-3">
                        <PaymentMethodButton onClick={() => setActivePaymentMethod(activePaymentMethod === 'card' ? null : 'card')} active={activePaymentMethod === 'card'}> <CreditCardIcon className="w-5 h-5" /> Pay with Credit Card </PaymentMethodButton>
                        
                        {canUseGooglePay && (
                            <>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span className="flex-grow border-t border-gray-700"></span>
                                    <span className="px-2">OR</span>
                                    <span className="flex-grow border-t border-gray-700"></span>
                                </div>
                                <PaymentMethodButton onClick={handleGooglePay} disabled={!canUseGooglePay} className="bg-black text-white hover:bg-gray-900 border-none p-2"> <GooglePayIcon /> Pay </PaymentMethodButton>
                            </>
                        )}
                    </div>
                    {activePaymentMethod === 'card' && <CreditCardForm plan={selectedPlan} onPayment={handleSimulatedPayment} isProcessing={paymentStatus === 'processing'} />}
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