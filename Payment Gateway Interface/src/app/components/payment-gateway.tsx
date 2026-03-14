import { useState } from 'react';
import { X, MoreHorizontal, ChevronRight, User, Timer, CreditCard, CheckCircle2, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import googlePayIcon from 'figma:asset/d26d61732412841f408268cbf2230d948b43580b.png';
import phonePeIcon from 'figma:asset/9c29b25024357a087dccfaa8b6e3cc9a532ef0b9.png';
import paytmIcon from 'figma:asset/713ea1d5d4b03d3a913247da6a36fb34629f3f20.png';
import freechargeIcon from 'figma:asset/3ac671a1bd63aa62c4ebfb86bc02bb298bc2c8a6.png';
import mastercardIcon from 'figma:asset/42424d8738077743cfbace3c9004bcc023c17481.png';
import visaIcon from 'figma:asset/56dc335f53945bf4ef302a7a2a5c340834f707d2.png';
import rupayIcon from 'figma:asset/097df9328fde7a3634d9ffa8b9e3a597dd40cbf8.png';

type PaymentMethod = 'card' | 'upi' | 'testpay';
type PaymentStatus = 'idle' | 'processing' | 'success';

// Payment provider icons as SVG components
const GooglePayIcon = () => (
  <svg viewBox="0 0 40 16" className="h-4 w-auto">
    <path fill="#5F6368" d="M19.3 8v2.4h-2.4V8h-2.4V5.6h2.4V3.2h2.4v2.4h2.4V8z"/>
    <path fill="#4285F4" d="M9.6 5.6c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1v.8c0 1.2-1 2.2-2.4 2.2-1.2 0-2-.8-2.4-1.6l-2 .8c.8 1.6 2.4 2.8 4.4 2.8 2.6 0 4.6-1.6 4.6-5.2V6h-2.2v.6c-.6-.6-1.4-1-2.4-1zm.2 5.2c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z"/>
  </svg>
);

const PhonePeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <circle cx="12" cy="12" r="10" fill="#5F259F"/>
    <path fill="white" d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
  </svg>
);

const PaytmIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <rect width="24" height="24" rx="4" fill="#00BAF2"/>
    <path fill="white" d="M8 8h8v2H8zm0 3h8v2H8zm0 3h5v2H8z"/>
  </svg>
);

const BhimIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <rect width="24" height="24" rx="4" fill="#0D47A1"/>
    <path fill="#FF9800" d="M12 6l-6 6h4v6h4v-6h4z"/>
  </svg>
);

const AmazonPayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <rect width="24" height="24" rx="4" fill="#FF9900"/>
    <path fill="white" d="M18 14c-2 1.5-5 2.5-7.5 2.5-3.5 0-6.7-1.3-9-3.5-.2-.2 0-.4.2-.3 2.5 1.5 5.6 2.3 8.8 2.3 2.2 0 4.6-.5 6.8-1.4.3-.2.6.2.3.4z"/>
  </svg>
);

const VisaIcon = () => (
  <svg viewBox="0 0 48 16" className="h-4 w-auto">
    <rect width="48" height="16" rx="2" fill="#1434CB"/>
    <path fill="white" d="M18 4l-2 8h2l2-8zm6 0l-3 8h2l.5-2h3l.5 2h2l-3-8zm1 2l1 3h-2zm4-2l-1.5 8h2l1.5-8zm4 0v8h2l2-6 1 6h2l2-8h-2l-1 6-1-6h-2l-2 6V4z"/>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto">
    <circle cx="18" cy="16" r="10" fill="#EB001B"/>
    <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
    <path fill="#FF5F00" d="M24 8c-2.2 0-4.2.9-5.7 2.3 1.5 1.4 2.5 3.4 2.5 5.7s-1 4.3-2.5 5.7c1.5 1.4 3.5 2.3 5.7 2.3 2.2 0 4.2-.9 5.7-2.3-1.5-1.4-2.5-3.4-2.5-5.7s1-4.3 2.5-5.7C28.2 8.9 26.2 8 24 8z"/>
  </svg>
);

const RupayIcon = () => (
  <svg viewBox="0 0 48 16" className="h-4 w-auto">
    <rect width="48" height="16" rx="2" fill="#097939"/>
    <path fill="white" d="M8 4h3c1.5 0 2.5 1 2.5 2.5S12.5 9 11 9H9v3H8V4zm1 1v3h2c1 0 1.5-.5 1.5-1.5S12 5 11 5H9zm6-1h4v1h-3v2h3v1h-3v2h3v1h-4V4zm6 0h3c1.5 0 2.5 1 2.5 2.5S25.5 9 24 9h-2v3h-1V4zm1 1v3h2c1 0 1.5-.5 1.5-1.5S24 5 23 5h-2z"/>
  </svg>
);

export function PaymentGateway() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [upiPaymentStatus, setUpiPaymentStatus] = useState<PaymentStatus>('idle');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [cardPaymentStatus, setCardPaymentStatus] = useState<PaymentStatus>('idle');
  const [cardTransactionId, setCardTransactionId] = useState('');
  const [cvv, setCvv] = useState('');
  const [qrRevealed, setQrRevealed] = useState(false);

  const paymentMethods = [
    {
      id: 'upi' as PaymentMethod,
      label: 'UPI',
      icons: [
        <img key="gpay" src={googlePayIcon} alt="Google Pay" className="w-5 h-5 object-contain" />,
        <img key="phonepe" src={phonePeIcon} alt="PhonePe" className="w-5 h-5 object-contain" />,
        <img key="paytm" src={paytmIcon} alt="Paytm" className="w-5 h-5 object-contain" />
      ]
    },
    {
      id: 'card' as PaymentMethod,
      label: 'Cards',
      icons: [
        <img key="visa" src={visaIcon} alt="Visa" className="w-6 h-4 object-contain" />,
        <img key="mastercard" src={mastercardIcon} alt="Mastercard" className="w-6 h-4 object-contain" />,
        <img key="rupay" src={rupayIcon} alt="RuPay" className="w-6 h-4 object-contain" />
      ]
    },
    {
      id: 'testpay' as PaymentMethod,
      label: 'Test Pay',
      icons: [
        <span key="check1" className="text-green-600">✓</span>,
        <span key="check2" className="text-green-600">✓</span>,
        <span key="check3" className="text-green-600">✓</span>
      ]
    }
  ];

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '');
    const match = numbers.match(/.{1,4}/g);
    return match ? match.join(' ') : numbers;
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + ' / ' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      const txnId = `DEMO-2026-${Math.floor(Math.random() * 90000) + 10000}`;
      setTransactionId(txnId);
      setPaymentStatus('success');
    }, 2000);
  };

  const handleSimulateUpiPayment = () => {
    setUpiPaymentStatus('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      const txnId = `DEMO-2026-${Math.floor(Math.random() * 90000) + 10000}`;
      setUpiTransactionId(txnId);
      setUpiPaymentStatus('success');
    }, 2000);
  };

  const handleSimulateCardPayment = () => {
    setCardPaymentStatus('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      const txnId = `DEMO-2026-${Math.floor(Math.random() * 90000) + 10000}`;
      setCardTransactionId(txnId);
      setCardPaymentStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#3d4558] flex items-center justify-center p-4">
      {/* Background checkout steps */}
      <div className="absolute top-8 left-8 text-white/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
          <span className="text-sm">PERSONAL INFORMATION</span>
        </div>
      </div>

      {/* Top right corner badge */}
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-4 py-8 rotate-45 translate-x-8 -translate-y-4">
        TEST MODE
      </div>

      {/* Main payment modal */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex" style={{ height: '600px' }}>
        {/* Left blue sidebar */}
        <div className="w-[360px] bg-gradient-to-br from-[#0066ff] to-[#0052cc] p-6 flex flex-col relative overflow-hidden">
          {/* Demo shop header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-semibold">
              S
            </div>
            <span className="text-white">Sarah Anderson</span>
          </div>

          {/* Price summary */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-gray-600 text-sm mb-2">Price Summary</div>
            <div className="text-2xl">₹3,143.91</div>
          </div>

          {/* Phone number */}
          <div className="bg-white rounded-lg p-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Using as +91 •••••••••</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Razorpay illustration - positioned at bottom */}
          <div className="mt-auto relative">
            <div className="absolute bottom-0 left-0 right-0">
              <svg width="100%" height="180" viewBox="0 0 300 180" className="opacity-30">
                {/* Coin stack */}
                <ellipse cx="80" cy="140" rx="25" ry="8" fill="white" opacity="0.6"/>
                <ellipse cx="80" cy="135" rx="25" ry="8" fill="white" opacity="0.7"/>
                <ellipse cx="80" cy="130" rx="25" ry="8" fill="white" opacity="0.8"/>
                <ellipse cx="80" cy="125" rx="25" ry="8" fill="white"/>
                {/* Card */}
                <rect x="180" y="120" width="60" height="40" rx="4" fill="#4ade80"/>
                {/* Flying elements */}
                <path d="M 100 80 Q 120 60 140 80" stroke="white" strokeWidth="3" fill="none" opacity="0.5"/>
                <path d="M 160 70 Q 180 50 200 70" stroke="white" strokeWidth="3" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div className="text-white text-xs mt-2 relative z-10">
              Secured by <span className="font-semibold italic">Razorpay</span>
            </div>
          </div>
        </div>

        {/* Right white panel - Payment Options */}
        <div className="flex-1 flex">
          {/* Payment methods list */}
          <div className="w-56 bg-gray-50 p-4">
            <div className="text-xs text-gray-500 mb-4">Recommended</div>
            <div className="space-y-1">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between transition-colors ${
                    selectedMethod === method.id
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm text-gray-700">{method.label}</span>
                  <div className="flex gap-1">
                    {method.icons.map((icon, idx) => (
                      <span key={idx} className="text-xs">{icon}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment content area */}
          <div className="flex-1 p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-gray-800">Payment Options</h2>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Card payment form */}
            {selectedMethod === 'card' && (
              <div>
                {cardPaymentStatus === 'idle' && (
                  <>
                    <h3 className="text-sm mb-4">Add a new card</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                            setCardNumber(formatted);
                          }}
                          placeholder="4111 1111 1111 1111"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-xs">
                          VISA
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setExpiryDate(formatted);
                          }}
                          placeholder="10 / 29"
                          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="• • •"
                          maxLength={3}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="save-card"
                          className="mt-1"
                        />
                        <label htmlFor="save-card" className="text-xs text-gray-600">
                          Save this card as per RBI guidelines
                        </label>
                      </div>

                      <button
                        onClick={handleSimulateCardPayment}
                        disabled={!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardholderName.trim()}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {cardPaymentStatus === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Processing card payment...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait</p>
                  </div>
                )}

                {cardPaymentStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl mb-2">Payment Successful</h3>
                      <p className="text-gray-600 text-sm">Card payment completed successfully</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction ID</span>
                        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                          {cardTransactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Card Number</span>
                        <span className="text-sm">•••• •••• •••• {cardNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cardholder</span>
                        <span className="text-sm">{cardholderName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount Paid</span>
                        <span className="text-sm">₹3,143.91</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <p className="text-sm text-green-900">
                        <strong>Payment Confirmed</strong><br />
                        Your card payment has been successfully processed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* UPI payment */}
            {selectedMethod === 'upi' && (
              <div>
                {upiPaymentStatus === 'idle' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm">UPI Payment</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Timer className="w-3 h-3" />
                        <span>10:07</span>
                      </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      {/* Left Column - QR Code Section */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-600 mb-3 font-medium">Scan QR Code</div>
                        
                        <div className="relative">
                          {/* QR Code Container with Blur */}
                          <div className={`transition-all duration-500 ${qrRevealed ? 'blur-none opacity-100' : 'blur-sm opacity-40'}`}>
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                              <QRCodeSVG
                                value="upi://pay?pa=demo@razorpay&pn=SarahAnderson&am=3143.91&cu=INR"
                                size={140}
                                level="M"
                                includeMargin={true}
                              />
                            </div>
                          </div>

                          {/* View QR Code Button Overlay - Only show when not revealed */}
                          {!qrRevealed && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-lg">
                              <button
                                onClick={() => setQrRevealed(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View QR Code</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* QR Information - Always visible, but more prominent when QR is revealed */}
                        <div className={`mt-3 text-center space-y-2 transition-opacity duration-300 ${qrRevealed ? 'opacity-100' : 'opacity-60'}`}>
                          <div className="text-xs text-gray-600">
                            Amount: <span className="font-semibold text-base text-gray-900">₹3,143.91</span>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-relaxed max-w-[180px]">
                            Scan using any UPI app (GPay, PhonePe, Paytm, BHIM)
                          </p>
                          
                          {/* Payment Apps - Show when revealed */}
                          {qrRevealed && (
                            <div className="flex gap-1.5 justify-center pt-1 animate-in fade-in duration-300">
                              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                <img src={googlePayIcon} alt="Google Pay" className="w-4 h-4 object-contain" />
                              </div>
                              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                <img src={phonePeIcon} alt="PhonePe" className="w-5 h-5 object-contain" />
                              </div>
                              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-0.5">
                                <img src={paytmIcon} alt="Paytm" className="w-full h-full object-contain" />
                              </div>
                              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                <img src={freechargeIcon} alt="Freecharge" className="w-4 h-4 object-contain" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - UPI ID Input */}
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-600 mb-3 font-medium">Enter UPI ID</div>
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div>
                            <div className="text-xs text-gray-500 mb-2">UPI ID / Phone Number</div>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="example@okhdfcbank"
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                          </div>

                          <p className="text-xs text-gray-500 leading-relaxed">
                            Scan the QR code or enter your UPI ID to complete payment
                          </p>

                          <button
                            onClick={handleSimulateUpiPayment}
                            disabled={!upiId.trim()}
                            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto text-sm"
                          >
                            Verify and Pay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Security Note - Compact */}
                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                      <Lock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        For security, the QR code is hidden until you choose to reveal it.
                      </p>
                    </div>
                  </>
                )}

                {upiPaymentStatus === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Verifying UPI ID...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait</p>
                  </div>
                )}

                {upiPaymentStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl mb-2">Payment Successful</h3>
                      <p className="text-gray-600 text-sm">UPI payment completed successfully</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction ID</span>
                        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                          {upiTransactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">UPI ID</span>
                        <span className="text-sm">{upiId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount Paid</span>
                        <span className="text-sm">₹3,143.91</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <p className="text-sm text-green-900">
                        <strong>Payment Confirmed</strong><br />
                        Your UPI payment has been successfully processed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Pay */}
            {selectedMethod === 'testpay' && (
              <div>
                <h3 className="text-sm mb-4">Demo Payment Mode</h3>
                
                {paymentStatus === 'idle' && (
                  <div className="space-y-4">
                    {/* Payment info card */}
                    <div className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Amount to be paid</span>
                        <span className="text-2xl">₹2,000</span>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          This is a demo payment used for testing the application submission flow. 
                          No real payment will be processed.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={handleSimulatePayment}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Simulate Payment</span>
                    </button>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Processing payment...</p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl mb-2">Payment Successful</h3>
                      <p className="text-gray-600 text-sm">Your demo payment has been completed</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction ID</span>
                        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                          {transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount Paid</span>
                        <span className="text-sm">₹2,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <p className="text-sm text-green-900">
                        <strong>Application Submitted</strong><br />
                        Your payment has been completed and your application has been successfully submitted.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}