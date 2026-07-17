import { useState, useMemo } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Coffee } from 'lucide-react';

const scriptURL = 'https://script.google.com/macros/s/AKfycbyOb3DOx9KxP3JElMFyAN1VNd3a83grbuTfU_ZDW7y2qxYTFEMqlJbzixj6ZOSvW6lA/exec';

const drinks = [
  { name: '淺蒸·日式煎茶', price: 45 }, { name: '淺焙·手摘烏龍', price: 55 }, { name: '深焙·珍藏黑烏龍', price: 70 },
  { name: '淺焙·大禹嶺茶王', price: 120 }, { name: '白毫·東方美人紅', price: 120 }, { name: '檸檬·手摘烏龍', price: 65 },
  { name: '厚奶·珍藏黑烏龍', price: 85 }, { name: '龍眼蜜檸檬飲', price: 70 }, { name: '龍眼花蜜烏龍', price: 70 },
  { name: '龍眼花蜜那堤', price: 80 }, { name: '原味紅茶', price: 30 }, { name: '茉莉花綠', price: 30 },
  { name: '毛仔青茶', price: 30 }, { name: '厚工烏龍', price: 30 }, { name: '烏龍青茶', price: 35 },
  { name: '四窨茉莉', price: 40 }, { name: '台灣小葉蜜香紅', price: 50 }, { name: '原味奶茶', price: 50 },
  { name: '冰淇淋原味紅', price: 60 }, { name: '原茶那堤', price: 55 }, { name: '黑糖烏龍那堤', price: 80 },
  { name: '牧場後鮮奶', price: 188 }, { name: '話梅茉莉綠', price: 35 }, { name: '檸檬茉莉綠', price: 50 },
  { name: '甘蔗毛仔青', price: 70 }, { name: '橙橙茉莉綠', price: 70 }, { name: '桑葚檸檬綠', price: 60 },
  { name: '芒果毛仔青', price: 65 }, { name: '雙檸愛玉', price: 60 }, { name: '桑葚檸檬飲', price: 60 },
  { name: '穀香玄米茶', price: 40 }, { name: '穀香玄米那堤', price: 65 }, { name: '穀香玄米粿鮮奶', price: 65 },
  { name: '胭紅芭樂凍梅飲', price: 65 }, { name: '胭紅芭樂凍多多', price: 80 }, { name: '胭紅芭樂凍鮮奶', price: 70 },
  { name: '多多茉莉綠', price: 55 }, { name: '多多橙橙綠', price: 80 }
];

const toppings = [
  { name: '熬糖大珍珠', price: 10 }, { name: '綠茶凍', price: 10 },
  { name: '椰果', price: 15 }, { name: '檸檬愛玉', price: 15 }, { name: '黑糖粉粿', price: 15 },
  { name: '香草冰淇淋', price: 15 }, { name: '統一布丁', price: 15 }, { name: '玄米粉粿', price: 15 },
  { name: '3Q(珍椰粿)', price: 15 }, { name: '紅心芭樂凍', price: 20 },
  { name: '加厚奶', price: 10 }, { name: '加鮮奶', price: 20 }, { name: '加龍眼蜜', price: 30 }
];

const sugarOptions = ['無糖', '微糖', '半糖', '少糖', '正常'];
const iceOptions = ['去冰', '微冰', '少冰', '正常'];

export default function App() {
  const [username, setUsername] = useState('');
  const [selectedDrinkName, setSelectedDrinkName] = useState('');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [sugar, setSugar] = useState('');
  const [ice, setIce] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedDrink = useMemo(() => {
    return drinks.find(d => d.name === selectedDrinkName) || null;
  }, [selectedDrinkName]);

  const totalPrice = useMemo(() => {
    let total = selectedDrink ? selectedDrink.price : 0;
    selectedToppings.forEach(toppingName => {
      const topping = toppings.find(t => t.name === toppingName);
      if (topping) total += topping.price;
    });
    return total;
  }, [selectedDrink, selectedToppings]);

  const handleToppingToggle = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const submitOrder = async () => {
    if (!username.trim()) return alert('請輸入您的姓名');
    if (!selectedDrink) return alert('請選擇飲品');
    if (!sugar) return alert('請選擇甜度');
    if (!ice) return alert('請選擇冰塊');

    setIsLoading(true);

    const formData = new FormData();
    // 為了不讓舊有 Google Script 因找不到欄位出錯，保留欄位並送出空值
    formData.append('store', ''); 
    formData.append('name', username.trim());
    formData.append('drink', selectedDrink.name);
    formData.append('sugar', sugar);
    formData.append('ice', ice);
    
    const toppingStr = selectedToppings.length > 0 ? selectedToppings.join(', ') : '無';
    formData.append('toppings', toppingStr);
    formData.append('price', totalPrice.toString());
    formData.append('note', '');

    try {
      await fetch(scriptURL, { 
        method: 'POST', 
        body: formData,
        mode: 'no-cors' // Google Apps Script 常常需要 no-cors 才能從前端成功發送
      });
      
      setIsSuccess(true);
      
    } catch (error) {
      alert('發生錯誤，請稍後再試');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-gray-800 pb-28 font-sans">
      <div className="max-w-lg mx-auto sm:mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#006400] animate-spin mb-4" />
            <p className="font-bold text-[#006400]">訂單送出中...</p>
          </div>
        )}

        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-[#006400]/95 z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-300 p-6">
            <CheckCircle2 className="w-16 h-16 mb-4 text-green-300" />
            <h2 className="text-2xl font-bold mb-6">訂購成功！</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setUsername('');
                  setSelectedDrinkName('');
                  setSugar('');
                  setIce('');
                  setSelectedToppings([]);
                }}
                className="py-3 px-6 bg-white text-[#006400] rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
              >
                再點下一筆
              </button>
              <a 
                href="https://docs.google.com/spreadsheets/d/1oLxgRICAIOLiP_qZ11xLSxh1igguWxrXKbaG3og8BDk/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-transparent border-2 border-white text-white rounded-xl font-bold text-center hover:bg-white/10 transition-colors"
              >
                轉跳確認清單
              </a>
            </div>
          </div>
        )}

        <div className="text-center mb-5 mt-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#006400] tracking-tight flex items-center justify-center gap-2">
            <Coffee className="w-6 h-6 shrink-0" />
            7/21(二)季會 工作人員點飲料
          </h1>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg flex items-center justify-center gap-2 mb-6 shadow-sm text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p>
            <span className="font-bold text-amber-900">注意：</span>截止為 <span className="font-bold text-amber-900">7/20(一) 早上 11:00</span>，逾時不候！
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">您的姓名 <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="請輸入真實姓名"
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-colors"
            />
          </div>

          {/* Drink Select */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">選擇飲品 <span className="text-red-500">*</span></label>
            <select 
              value={selectedDrinkName}
              onChange={(e) => setSelectedDrinkName(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#006400] focus:ring-1 focus:ring-[#006400] transition-colors bg-white"
            >
              <option value="" disabled>請選擇飲品...</option>
              {drinks.map(d => (
                <option key={d.name} value={d.name}>{d.name} (${d.price})</option>
              ))}
            </select>
          </div>

          {/* Toppings */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">加料區 (可複選)</label>
            <div className="grid grid-cols-2 gap-3">
              {toppings.map(t => (
                <label 
                  key={t.name}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                    selectedToppings.includes(t.name) 
                      ? 'border-[#006400] bg-[#006400]/5' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedToppings.includes(t.name)}
                    onChange={() => handleToppingToggle(t.name)}
                    className="w-4 h-4 text-[#006400] rounded focus:ring-[#006400]"
                  />
                  <span className="ml-2 text-sm flex-1">{t.name}</span>
                  <span className="text-xs text-gray-500 font-medium">+${t.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sugar */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">甜度 <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {sugarOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSugar(opt)}
                  className={`py-2 px-1 border rounded-lg text-sm text-center transition-all ${
                    sugar === opt 
                      ? 'bg-[#006400] text-white border-[#006400] font-bold shadow-md' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Ice */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">冰塊 <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {iceOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIce(opt)}
                  className={`py-2 px-1 border rounded-lg text-sm text-center transition-all ${
                    ice === opt 
                      ? 'bg-[#006400] text-white border-[#006400] font-bold shadow-md' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-lg mx-auto w-full flex justify-between items-center">
          <div className="text-lg text-gray-600">
            總計：<span className="text-2xl font-bold text-[#006400]">${totalPrice}</span>
          </div>
          <button 
            onClick={submitOrder}
            disabled={isLoading}
            className="bg-[#006400] hover:bg-[#005000] text-white border-none py-3 px-8 rounded-full text-base font-bold cursor-pointer transition-colors shadow-lg shadow-green-900/20 disabled:opacity-70"
          >
            確認送出
          </button>
        </div>
      </div>
    </div>
  );
}
