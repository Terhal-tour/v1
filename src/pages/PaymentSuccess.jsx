// src/pages/PaymentSuccess.jsx
const PaymentSuccess = () => {
  return (
    <div className="flex justify-center items-center h-screen text-center">
      <div className="p-6 bg-green-100 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful! ✅</h2>
        <p className="text-green-800">Your payment has been processed successfully.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
