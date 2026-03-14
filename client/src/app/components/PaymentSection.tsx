import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, CreditCard, Download, Eye, Loader2, Lock, MoreHorizontal, ShieldCheck, Smartphone, User, Wallet, X } from "lucide-react";
import type { BackendPayment } from "../services/workflowApi";
import googlePayIcon from "../../assets/payment-gateway/google-pay.png";
import phonePeIcon from "../../assets/payment-gateway/phonepe.png";
import paytmIcon from "../../assets/payment-gateway/paytm.png";
import freechargeIcon from "../../assets/payment-gateway/freecharge.png";
import mastercardIcon from "../../assets/payment-gateway/mastercard.png";
import visaIcon from "../../assets/payment-gateway/visa.png";
import rupayIcon from "../../assets/payment-gateway/rupay.png";
import upiQrIcon from "../../assets/payment-gateway/upi-qr.png";

type PaymentMethod = "upi" | "card" | "testpay";

interface PaymentSectionProps {
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  cardData: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  setCardData: (data: { cardNumber: string; cardName: string; expiryDate: string; cvv: string }) => void;
  upiId: string;
  setUpiId: (value: string) => void;
  amount: number;
  isProcessingPayment: boolean;
  paymentRecord: BackendPayment | null;
  paymentError: string;
  onProcessPayment: () => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
}

function QrPreview() {
  return (
    <img
      src={upiQrIcon}
      alt="UPI QR Code"
      className="h-36 w-36 rounded-xl bg-white p-2 shadow-sm object-contain"
      loading="lazy"
    />
  );
}

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
};

const formatExpiryDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

export function PaymentSection({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cardData,
  setCardData,
  upiId,
  setUpiId,
  amount,
  isProcessingPayment,
  paymentRecord,
  paymentError,
  onProcessPayment,
  onBack,
  onContinue,
}: PaymentSectionProps) {
  const [qrRevealed, setQrRevealed] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(15 * 60);
  const [authStep, setAuthStep] = useState<"idle" | "challenge" | "verifying">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const paymentState = paymentRecord ? "success" : isProcessingPayment ? "processing" : "idle";

  useEffect(() => {
    if (paymentRecord || sessionSeconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSessionSeconds((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [paymentRecord, sessionSeconds]);

  const paymentMethods = useMemo(
    () => [
      {
        id: "upi" as const,
        label: "UPI",
        description: "GPay, PhonePe, Paytm",
        icons: [
          { src: googlePayIcon, alt: "Google Pay", className: "h-5 w-5" },
          { src: phonePeIcon, alt: "PhonePe", className: "h-5 w-5" },
          { src: paytmIcon, alt: "Paytm", className: "h-5 w-5" },
        ],
      },
      {
        id: "card" as const,
        label: "Cards",
        description: "Visa, Mastercard, RuPay",
        icons: [
          { src: visaIcon, alt: "Visa", className: "h-4 w-8" },
          { src: mastercardIcon, alt: "Mastercard", className: "h-4 w-8" },
          { src: rupayIcon, alt: "RuPay", className: "h-4 w-8" },
        ],
      },
      {
        id: "testpay" as const,
        label: "Test Pay",
        description: "Sandbox transaction",
        icons: [
          { text: "S", className: "text-emerald-600" },
          { text: "A", className: "text-emerald-600" },
          { text: "F", className: "text-emerald-600" },
        ],
      },
    ],
    []
  );

  const methodLabel = selectedPaymentMethod === "upi" ? "UPI" : selectedPaymentMethod === "card" ? "Card" : "Test Pay";
  const sessionTime = `${String(Math.floor(sessionSeconds / 60)).padStart(2, "0")}:${String(sessionSeconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (paymentRecord) {
      setReceiptOpen(true);
      setAuthStep("idle");
      setOtpCode("");
    }
  }, [paymentRecord]);

  const startPaymentFlow = async () => {
    if (selectedPaymentMethod === "testpay") {
      await onProcessPayment();
      return;
    }
    setAuthStep("challenge");
  };

  const verifyAndSubmitPayment = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      return;
    }

    setAuthStep("verifying");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    await onProcessPayment();
    setAuthStep("idle");
  };

  const downloadReceipt = () => {
    if (!paymentRecord) {
      return;
    }

    const text = [
      "PARIVESH PAYMENT RECEIPT",
      "------------------------",
      `Transaction ID: ${paymentRecord.transaction_reference}`,
      `Amount: INR ${amount.toLocaleString("en-IN")}`,
      `Method: ${methodLabel}`,
      `Status: ${paymentRecord.status}`,
      `Date: ${new Date(paymentRecord.created_at).toLocaleString("en-IN")}`,
      "",
      "This is a system generated acknowledgement.",
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payment-receipt-${paymentRecord.transaction_reference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onBack} aria-hidden />

      <div className="relative z-[71] w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_40px_120px_-35px_rgba(15,23,42,0.75)]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b63f3] text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Parivesh Gateway</div>
              <div className="text-sm font-semibold text-slate-900">Secure checkout</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Session {sessionTime}</div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              aria-label="Close payment window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative max-h-[calc(100vh-130px)] overflow-y-auto">
        <div className="absolute right-0 top-0 bg-emerald-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg">
          Secure Checkout
        </div>

        <div className="flex flex-col lg:flex-row">
          <aside className="relative overflow-hidden bg-gradient-to-br from-[#0b63f3] via-[#0a57d6] to-[#0a46aa] px-6 py-7 text-white lg:w-[340px]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-base font-semibold backdrop-blur-sm">P</div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-white/70">Parivesh</div>
                <div className="text-sm font-medium">Proponent Checkout</div>
              </div>
            </div>

            <div className="mb-4 rounded-2xl bg-white p-4 text-slate-900 shadow-lg">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Amount Payable</div>
              <div className="mt-2 text-3xl font-semibold">₹{amount.toLocaleString("en-IN")}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Application fee</span>
                <span className="font-medium text-slate-700">Government filing</span>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/60">Mode</div>
                    <div className="text-sm">Draft application payment</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-white/70" />
              </div>
            </div>

            <div className="mt-auto rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/65">Supported brands</div>
              <div className="grid grid-cols-3 gap-3">
                {[googlePayIcon, phonePeIcon, paytmIcon, visaIcon, mastercardIcon, rupayIcon].map((icon, index) => (
                  <div key={index} className="flex h-12 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-sm">
                    <img src={icon} alt="Payment brand" className="max-h-7 max-w-full object-contain" />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-white/75">Secured for government workflow testing and payment record capture.</div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col bg-white lg:flex-row">
            <div className="border-b border-slate-200 bg-slate-50 p-4 lg:w-64 lg:border-b-0 lg:border-r">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recommended</div>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    disabled={isProcessingPayment}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedPaymentMethod === method.id
                        ? "border-blue-200 bg-white shadow-sm"
                        : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
                    } ${isProcessingPayment ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{method.label}</div>
                        <div className="text-xs text-slate-500">{method.description}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {method.icons.map((icon, index) =>
                          "src" in icon ? (
                            <img key={index} src={icon.src} alt={icon.alt} className={`object-contain ${icon.className}`} />
                          ) : (
                            <span key={index} className={`text-xs font-bold ${icon.className}`}>
                              {icon.text}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Payment assurance
                </div>
                <p>The gateway UI is updated, but payment recording still goes through the existing application backend.</p>
              </div>
            </div>

            <div className="flex-1 p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Payment options</div>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">Complete your {methodLabel.toLowerCase()} payment</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReceiptOpen(true)}
                    disabled={!paymentRecord}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Receipt
                  </button>
                  <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {paymentError ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{paymentError}</div> : null}

              {authStep !== "idle" && !paymentRecord ? (
                <div className="mb-6 rounded-3xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
                  {authStep === "challenge" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-sm font-semibold">3DS verification required</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">Verify your payment with OTP</h4>
                      <p className="text-sm text-slate-600">Enter the 6-digit OTP sent to your registered mobile number to authorize this transaction.</p>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">One-time password</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base tracking-[0.35em] outline-none transition focus:border-indigo-500"
                        />
                        <p className="text-xs text-slate-500">Use 123456 as demo OTP for this flow.</p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setAuthStep("idle")}
                          className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={verifyAndSubmitPayment}
                          disabled={!/^\d{6}$/.test(otpCode)}
                          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Verify OTP and Pay
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-indigo-200 bg-white px-4 py-8 text-center">
                      <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Authorizing transaction</h4>
                      <p className="mt-2 text-sm text-slate-600">Please wait while we validate OTP and process payment.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {authStep === "idle" ? (
                <>
              {selectedPaymentMethod === "card" ? (
                paymentState === "success" ? (
                  <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 px-4 py-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900">Payment recorded successfully</h4>
                      <p className="mt-2 text-sm text-slate-600">Your card details were accepted and the application payment has been saved.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Transaction ID</div>
                          <div className="mt-1 font-mono text-slate-900">{paymentRecord?.transaction_reference}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Amount paid</div>
                          <div className="mt-1 font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Card number</div>
                          <div className="mt-1 text-slate-900">•••• •••• •••• {cardData.cardNumber.replace(/\s/g, "").slice(-4) || "0000"}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Cardholder</div>
                          <div className="mt-1 text-slate-900">{cardData.cardName || "Not captured"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : paymentState === "processing" ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-10 text-center">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
                    <h4 className="text-lg font-semibold text-slate-900">Processing card payment</h4>
                    <p className="mt-2 max-w-sm text-sm text-slate-600">We are saving your transaction against the draft application. Do not refresh the page.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <h4 className="text-sm font-medium text-slate-700">Add a new card</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(event) => setCardData({ ...cardData, cardNumber: formatCardNumber(event.target.value) })}
                          placeholder="4111 1111 1111 1111"
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Card</div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(event) => setCardData({ ...cardData, expiryDate: formatExpiryDate(event.target.value) })}
                          placeholder="MM / YY"
                          className="rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500"
                        />
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(event) => setCardData({ ...cardData, cvv: event.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="CVV"
                          className="rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500"
                        />
                      </div>

                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(event) => setCardData({ ...cardData, cardName: event.target.value })}
                        placeholder="Cardholder name"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500"
                      />

                      <label className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                        <input type="checkbox" checked readOnly className="mt-0.5" />
                        <span>Save this card preference for the current application flow only.</span>
                      </label>

                      <button
                        type="button"
                        onClick={startPaymentFlow}
                        disabled={!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardName}
                        className="w-full rounded-2xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Continue to pay ₹{amount.toLocaleString("en-IN")}
                      </button>
                    </div>
                  </div>
                )
              ) : null}

              {selectedPaymentMethod === "upi" ? (
                paymentState === "success" ? (
                  <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 px-4 py-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900">UPI payment recorded</h4>
                      <p className="mt-2 text-sm text-slate-600">The application fee has been linked to your draft using the new gateway flow.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Transaction ID</div>
                          <div className="mt-1 font-mono text-slate-900">{paymentRecord?.transaction_reference}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">UPI ID</div>
                          <div className="mt-1 text-slate-900">{upiId || "Scanned QR flow"}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Amount paid</div>
                          <div className="mt-1 font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Gateway</div>
                          <div className="mt-1 text-slate-900">UPI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : paymentState === "processing" ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-10 text-center">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
                    <h4 className="text-lg font-semibold text-slate-900">Verifying UPI payment</h4>
                    <p className="mt-2 max-w-sm text-sm text-slate-600">We are recording the payment and generating a transaction reference for this application.</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-700">UPI Payment</h4>
                      <div className="text-xs text-slate-500">Scan or enter UPI ID</div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Scan QR code</div>
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className={`transition duration-500 ${qrRevealed ? "opacity-100 blur-0" : "opacity-40 blur-sm"}`}>
                              <QrPreview />
                            </div>
                            {!qrRevealed ? (
                              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/35 backdrop-blur-[2px]">
                                <button
                                  type="button"
                                  onClick={() => setQrRevealed(true)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-blue-700"
                                >
                                  <Eye className="h-4 w-4" />
                                  View QR Code
                                </button>
                              </div>
                            ) : null}
                          </div>

                          <div className={`mt-4 space-y-2 text-center transition ${qrRevealed ? "opacity-100" : "opacity-70"}`}>
                            <div className="text-xs text-slate-500">Amount</div>
                            <div className="text-xl font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</div>
                            <p className="text-xs text-slate-500">Scan using Google Pay, PhonePe, Paytm, BHIM or any supported UPI app.</p>
                            {qrRevealed ? (
                              <div className="flex justify-center gap-2 pt-1">
                                {[googlePayIcon, phonePeIcon, paytmIcon, freechargeIcon].map((icon, index) => (
                                  <div key={index} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white p-1">
                                    <img src={icon} alt="UPI app" className="max-h-5 max-w-5 object-contain" />
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 p-5">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Enter UPI ID</div>
                        <div className="space-y-4">
                          <div>
                            <div className="mb-2 text-xs text-slate-500">UPI ID / linked phone</div>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(event) => setUpiId(event.target.value)}
                              placeholder="example@okhdfcbank"
                              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500"
                            />
                          </div>

                          <p className="text-xs leading-relaxed text-slate-500">If you prefer, leave the field blank and use the QR route above. The backend will generate the transaction reference automatically.</p>

                          <button
                            type="button"
                            onClick={startPaymentFlow}
                            className="w-full rounded-2xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                          >
                            Verify and pay ₹{amount.toLocaleString("en-IN")}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                      <Smartphone className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                      <p>For security, the QR code stays blurred until revealed. Payment recording still occurs through the application backend after you confirm.</p>
                    </div>
                  </div>
                )
              ) : null}

              {selectedPaymentMethod === "testpay" ? (
                paymentState === "success" ? (
                  <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 px-4 py-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900">Sandbox payment recorded</h4>
                      <p className="mt-2 text-sm text-slate-600">A test payment row was saved successfully for this application.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Transaction ID</div>
                          <div className="mt-1 font-mono text-slate-900">{paymentRecord?.transaction_reference}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Amount paid</div>
                          <div className="mt-1 font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : paymentState === "processing" ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-10 text-center">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
                    <h4 className="text-lg font-semibold text-slate-900">Recording sandbox payment</h4>
                    <p className="mt-2 max-w-sm text-sm text-slate-600">This does not hit a live gateway. It only creates the payment entry required for the submission flow.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <h4 className="text-sm font-medium text-slate-700">Demo payment mode</h4>
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">Amount to be recorded</span>
                        <span className="text-3xl font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        Use this path when you need to test the final submission flow without entering real UPI or card data.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={startPaymentFlow}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                    >
                      <CreditCard className="h-4 w-4" />
                      Simulate payment
                    </button>
                  </div>
                )
              ) : null}
                </>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={!paymentRecord}
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue to review
                </button>
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>

      {receiptOpen && paymentRecord ? (
        <div className="fixed inset-0 z-[85] flex justify-end bg-slate-900/40" onClick={() => setReceiptOpen(false)}>
          <div className="h-full w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment receipt</div>
                <h4 className="mt-1 text-xl font-semibold text-slate-900">Transaction summary</h4>
              </div>
              <button
                type="button"
                onClick={() => setReceiptOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Payment successful</span>
              </div>
              <p className="mt-2 text-xs text-emerald-700">Your transaction is recorded and linked to this draft application.</p>
            </div>

            <div className="mt-5 space-y-3 rounded-3xl border border-slate-200 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-900">{paymentRecord.transaction_reference}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">{new Date(paymentRecord.created_at).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Method</span>
                <span className="text-slate-900">{methodLabel}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-700">{paymentRecord.status}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                <span className="text-slate-500">Amount</span>
                <span className="text-lg font-semibold text-slate-900">INR {amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={downloadReceipt}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                Download receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  setReceiptOpen(false);
                  onContinue();
                }}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Continue to review
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
