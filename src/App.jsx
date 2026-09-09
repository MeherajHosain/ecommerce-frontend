import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // টেস্ট করার জন্য ফ্রন্টএন্ডে কিছু ডামী প্রোডাক্ট ডেটা (পরবর্তীতে এটি ব্যাকএন্ড থেকে আসবে)
    // পুরানো প্রোডাক্টের অ্যারেটি বদলে এটি বসিয়ে দিন (শুধু ইমেজের লিংক পরিবর্তন করা হয়েছে)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({ totalItems: 0, totalPrice: 0 });

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      // আমাদের ব্যাকএন্ড প্রোডাক্ট এপিআই লিংক
      const response = await axios.get('http://localhost:5000/api/products');
      
      // ব্যাকএন্ডের পাঠানো প্রোডাক্ট লিস্ট রিঅ্যাক্ট স্টেটে সেভ করা
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">পণ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন... ⏳</div>
      </div>
    );
  }

  // কার্টে প্রোডাক্ট যোগ করার হ্যান্ডলার ফাংশন
  const handleAddToCart = async (product) => {
    try {
      // ব্যাকএন্ড কার্ট এপিআই-তে ডেটা পাঠানো
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: "user123", // আপাতত আমরা ডামি ইউজার আইডি ব্যবহার করছি
        productId: product.id || product._id,
        title: product.title,
        price: product.price,
        quantity: 1 // প্রতি ক্লিকে ১টি করে আইটেম যোগ হবে
      });

      // ব্যাকএন্ড থেকে আসা লেটেস্ট কার্ট ডেটা ফ্রন্টএন্ড স্টেটে সেভ করা
      setCart(response.data.cart);
      
      // কার্টের টোটাল আইটেম ও প্রাইস লাইভ আপডেট করার হিসাব
      const totalItems = response.data.cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = response.data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setCartSummary({ totalItems, totalPrice });
      
      alert(`${product.title} সফলভাবে কার্টে যোগ হয়েছে! 🛒`);
    } catch (error) {
      console.error("কার্টে যোগ করতে সমস্যা হয়েছে:", error);
      alert("কার্টে যোগ করা যায়নি, সার্ভার চেক করুন।");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ১. শীর্ষ ন্যাভবার (Navbar) */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
            <span>Meheraj Shop</span> 🛍️
          </div>
          <div className="flex items-center gap-6 font-semibold text-slate-600">
            <span className="hover:text-indigo-600 cursor-pointer transition">Home</span>
            <span className="hover:text-indigo-600 cursor-pointer transition">Orders</span>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-indigo-100 transition">
              <span>🛒 Cart</span>
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartSummary.totalItems}
              </span>
            </div>

          </div>
        </div>
      </nav>

      {/* ২. হিরো ব্যানার (Hero Section) */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-8 md:p-12 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="max-w-md relative z-10">
            <span className="bg-indigo-500/30 text-indigo-200 text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full">Mega Sale is Live</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3 mb-4 leading-tight">সেরা পণ্য, সেরা দামে!</h2>
            <p className="text-indigo-100 font-medium mb-6">প্রিমিয়াম কোয়ালিটির গ্যাজেটস এবং অ্যাক্সেসরিজ কিনুন আমাদের বিশ্বস্ত প্ল্যাটফর্ম থেকে।</p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 rounded-l-full transform translate-x-12 hidden md:block"></div>
        </div>
      </header>

      {/* ৩. প্রোডাক্ট গ্রিড সেকশন (Products Grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          Trending Products 🔥
        </h3>
        
        {/* রেসপন্সিভ ৩-কলাম গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                            {/* প্রোডাক্ট ইমেজ এর বদলে সুন্দর নো-ইন্টারনেট লোকাল কার্ড */}
                            {/* প্রোডাক্ট ইমেজ সেকশন */}
              <div className="h-64 overflow-hidden bg-slate-100 relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-700 px-2.5 py-1 rounded-lg shadow-xs">
                  {product.category}
                </span>
              </div>

              
              {/* প্রোডাক্ট ডিটেইলস */}
              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition">
                  {product.title}
                </h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xl font-black text-slate-900">৳{product.price}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition duration-300 active:scale-95 text-sm"
                  >
                    Add to Cart 🛒
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}

export default App;
