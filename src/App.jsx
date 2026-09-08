import React, { useState } from 'react';

function App() {
  // টেস্ট করার জন্য ফ্রন্টএন্ডে কিছু ডামী প্রোডাক্ট ডেটা (পরবর্তীতে এটি ব্যাকএন্ড থেকে আসবে)
    // পুরানো প্রোডাক্টের অ্যারেটি বদলে এটি বসিয়ে দিন (শুধু ইমেজের লিংক পরিবর্তন করা হয়েছে)
    const [products] = useState([
    {
      id: "prod1",
      title: "Premium Wireless Headphone",
      description: "High-quality sound with bass boost and 40h battery life.",
      price: 2500,
      imageUrl: "/headphone.jpg", // public ফোল্ডারে থাকা আপনার ছবির নাম
      category: "Electronics"
    },
    {
      id: "prod2",
      title: "Smart Watch Series 9",
      description: "AMOLED Display with heart rate monitoring and 7 days battery.",
      price: 3500,
      imageUrl: "/watch.jpg", // public ফোল্ডারে থাকা আপনার ছবির নাম
      category: "Gadgets"
    },
    {
      id: "prod3",
      title: "Minimalist Leather Wallet",
      description: "Pure leather slim wallet with RFID blocking security.",
      price: 1200,
      imageUrl: "/wallet.jpg", // public ফোল্ডারে থাকা আপনার ছবির নাম
      category: "Accessories"
    }
  ]);


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
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">3</span>
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
                  <button className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition duration-300 active:scale-95 text-sm">
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
