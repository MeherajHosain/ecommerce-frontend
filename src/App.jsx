import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({ totalItems: 0, totalPrice: 0 });
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderInvoice, setOrderInvoice] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // পেজ লোড হওয়ার সময় ব্যাকএন্ড থেকে প্রোডাক্ট নিয়ে আসা
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // কার্টে প্রোডাক্ট যোগ করার ফাংশন
  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: "user123",
        productId: product.id || product._id,
        title: product.title,
        price: product.price,
        quantity: 1
      });

      const currentCart = response.data.cart || [];
      setCart(currentCart);
      
      const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setCartSummary({ totalItems, totalPrice });
      alert(`${product.title} সফলভাবে কার্টে যোগ হয়েছে! 🛒`);
    } catch (error) {
      console.error("কার্টে যোগ করতে সমস্যা হয়েছে:", error);
      alert("কার্টে যোগ করা যায়নি, সার্ভার চেক করুন।");
    }
  };

  // অর্ডার প্লেস করার ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !phone) {
      alert("অনুগ্রহ করে আপনার ঠিকানা এবং ফোন নাম্বারটি লিখুন! ⚠️");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/orders/place', {
        userId: "user123",
        cartItems: cart,
        totalPrice: cartSummary.totalPrice,
        shippingAddress,
        phone
      });

      setOrderInvoice(response.data.order);
      setCart([]);
      setCartSummary({ totalItems: 0, totalPrice: 0 });
      setShippingAddress('');
      setPhone('');
      alert("আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে! 🛍️");
    } catch (error) {
      console.error("অর্ডার প্লেস করতে সমস্যা হয়েছে:", error);
      alert("অর্ডার প্লেস করা যায়নি, আবার চেষ্টা করুন।");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">পণ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন... ⏳</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ১. শীর্ষ ন্যাভবার */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div onClick={() => { setShowCheckout(false); setOrderInvoice(null); }} className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2 cursor-pointer">
            <span>Meheraj Shop</span> 🛍️
          </div>
          <div className="flex items-center gap-6 font-semibold text-slate-600">
            <span onClick={() => { setShowCheckout(false); setOrderInvoice(null); }} className="hover:text-indigo-600 cursor-pointer transition">Home</span>
            <div 
              onClick={() => { if(cartSummary.totalItems > 0) setShowCheckout(true); }}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-indigo-100 transition"
            >
              <span>🛒 Cart</span>
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartSummary.totalItems}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ইনভয়েস স্ক্রিন */}
      {orderInvoice ? (
        <div className="max-w-2xl mx-auto px-4 my-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 text-center">
            <div className="text-6xl mb-4 text-emerald-500">🎉</div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">অর্ডার সফল হয়েছে!</h2>
            <p className="text-slate-500 mb-6 font-semibold text-indigo-600">অর্ডার আইডি: {orderInvoice.orderId}</p>
            
            <div className="border-t border-b border-slate-100 py-4 text-left my-6 space-y-2 font-medium">
              <p><strong>তারিখ:</strong> {orderInvoice.orderDate}</p>
              <p><strong>ডেলিভারি ঠিকানা:</strong> {orderInvoice.shippingAddress}</p>
              <p><strong>মোবাইল নাম্বার:</strong> {orderInvoice.phone}</p>
              <p><strong>পেমেন্ট মেথড:</strong> {orderInvoice.paymentStatus}</p>
              <p className="pt-2 text-lg font-bold border-t border-slate-50 flex justify-between">
                <span>সর্বমোট মূল্য (ডেলিভারি চার্জসহ):</span>
                <span className="text-indigo-600">৳{orderInvoice.grandTotal}</span>
              </p>
            </div>
            
            <button 
              onClick={() => setOrderInvoice(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition duration-300"
            >
              আরও কেনাকাটা করুন 🚀
            </button>
          </div>
        </div>
      ) : showCheckout ? (
        /* ২. চেকআউট ফর্ম এবং কার্ট সামারি */
        <div className="max-w-4xl mx-auto px-4 my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* চেকআউট ফর্ম */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">📦 ডেলিভারি ইনফরমেশন</h3>
            <form onSubmit={handlePlaceOrder} className="space-y-4 font-semibold">
              <div>
                <label className="block text-sm text-slate-600 mb-2">ডেলিভারি ঠিকানা</label>
                <textarea 
                  rows="3"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="আপনার পূর্ণাঙ্গ ঠিকানা লিখুন"
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">মোবাইল নাম্বার</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 mt-6"
              >
                Place Order (৳{cartSummary.totalPrice + 60}) 🛍️
              </button>
            </form>
          </div>

          {/* কার্ট সামারি */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-4">🛒 অর্ডার সামারি</h3>
            <div className="divide-y divide-slate-50 font-medium text-slate-600">
              <div className="py-3 flex justify-between">
                <span>মোট পণ্য পিস:</span>
                <span className="font-bold text-slate-800">{cartSummary.totalItems} টি</span>
              </div>
              <div className="py-3 flex justify-between">
                <span>পণ্যের মূল্য:</span>
                <span className="font-bold text-slate-800">৳{cartSummary.totalPrice}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-slate-800">৳60</span>
              </div>
              <div className="py-3 flex justify-between text-lg font-black text-slate-900 pt-4">
                <span>সর্বমোট:</span>
                <span className="text-indigo-600">৳{cartSummary.totalPrice + 60}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ৩. সাধারণ শপ হোমপেজ */
        <>
          <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-8 md:p-12 rounded-3xl shadow-xl shadow-indigo-100">
              <div className="max-w-md">
                <span className="bg-indigo-500/30 text-indigo-200 text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full">Mega Sale is Live</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3 mb-4">সেরা পণ্য, সেরা দামে!</h2>
                <p className="text-indigo-100 font-medium">প্রিমিয়াম কোয়ালিটির গ্যাজেটস এবং অ্যাক্সেসরিজ কিনুন আমাদের বিশ্বস্ত প্ল্যাটফর্ম থেকে।</p>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-6">Trending Products 🔥</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id || product._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="h-64 overflow-hidden bg-slate-100 relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-xs font-bold text-slate-700 px-2.5 py-1 rounded-lg">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition">{product.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xl font-black text-slate-900">৳{product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl transition duration-300 active:scale-95 text-sm"
                      >
                        Add to Cart 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}

    </div>
  );
}

export default App;
