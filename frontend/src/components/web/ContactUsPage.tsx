import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, MessageSquare, Send, CheckCircle2, Bookmark } from 'lucide-react';
import { AnimatedDiya, RangoliMandala } from './GoldenDeco';

interface ContactUsPageProps {
  onNavigate: (page: string) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    ritualType: 'Wedding Ceremony',
    guestCount: '200',
    dietaryPreference: 'Pure Sattvik (No Onion/Garlic)',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert("Please fill in your Name, Email and Phone Number for authentication.");
      return;
    }
    // Generate inquiry ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setInquiryId(`UTSAV-INQ-${randomNum}`);
    setIsSubmitted(true);
  };

  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="contact-us-page">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex justify-center mb-3">
          <AnimatedDiya className="w-10 h-10 text-orange-600 animate-pulse" />
        </div>
        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          Get in Touch // Connect
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-white mt-3 uppercase tracking-tight">
          Reach Utsav Concierge
        </h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-2 font-sans">
          Whether planning a marriage ceremony or renting auspicious materials, our dedicated staff coordinate your dreams 24/7.
        </p>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CONTACT INFRASTRUCTURE & METADATA (Col span 5) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* CORPORATE CORNER */}
            <div className="bg-white dark:bg-stone-850 p-6 rounded-2.5xl border border-stone-100 dark:border-stone-800 shadow-md space-y-4" id="corporate-hq">
              <span className="text-[10px] font-mono font-bold tracking-wider text-orange-600 dark:text-orange-450 uppercase block">
                ✦ Head Office Location ✦
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white uppercase">Corporate Saffron Suite</h3>
              
              <div className="space-y-4 text-xs font-sans text-stone-600 dark:text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Utsav Bites Plaza</p>
                    <p>12th Floor, Saffron Tower, Connaught Place, New Delhi - 110001</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">24x7 Custom Hotline</p>
                    <p>+91 1800 123 4567 / +91 98871 00234</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Digital Desk Inquiry</p>
                    <p>concierge@utsavbites.in / support@utsavbites.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Auspicious Booking Support</p>
                    <p>Daily 08:00 AM - 10:00 PM IST (including public holidays)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SPIRITUAL CORNER */}
            <div className="bg-gradient-to-br from-orange-600/10 via-amber-500/5 to-transparent dark:bg-stone-850/50 p-6 rounded-2.5xl border border-orange-500/20 shadow-sm space-y-3" id="spiritual-hq">
              <div className="flex items-center gap-2">
                <span className="text-base">☸</span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#C51C13] dark:text-orange-400">Varanasi Ceremonial Desk</h4>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                Direct procurement desk at Scindia Ghat Varanasi for specialized Vedic items, Ganga jal, high-vibe incense, and pure brass items dispatch.
              </p>
              <div className="text-[11px] font-mono text-stone-600 dark:text-stone-300">
                Address: D-14/19, Scindia Dev Ghat, Varanasi, UP - 221001
              </div>
            </div>

            {/* LIVE CHAT SIMULATION ACCENT */}
            <div className="bg-stone-900 border-l-4 border-orange-600 p-5 rounded-r-2xl text-stone-300 flex items-start gap-3" id="faq-quick-accent">
              <MessageSquare className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase text-white tracking-wider">Planning in a Hurry?</h4>
                <p className="text-[10px] text-stone-400 mt-1 font-sans leading-relaxed">
                  Call our certified wedding coordination advisor instantly for priority venue configurations or catering trial bookings. Zero consultation fee!
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: CONTACT / WEb-INTAKE FORM (Col span 7) */}
          <div className="md:col-span-7 bg-white dark:bg-stone-850 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl relative overflow-hidden" id="contact-form-container">
            
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 opacity-5 pointer-events-none">
              <RangoliMandala className="w-full h-full text-orange-500" />
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5" id="ritual-contact-form">
                <h3 className="text-lg font-serif font-black text-stone-900 dark:text-white uppercase border-b border-stone-100 dark:border-stone-800 pb-3">
                  Auspicious Intake Sheet
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Your Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. +91 99880 12345"
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. rahul@hmail.com"
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Ceremony Date (Optional)</label>
                    <input 
                      type="date" 
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Ritual Category</label>
                    <select 
                      name="ritualType"
                      value={formData.ritualType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    >
                      <option>Wedding Ceremony</option>
                      <option>Dwar Puja Ritual</option>
                      <option>Makar Sankrant Feast</option>
                      <option>Utsav Sweet Boxes Order</option>
                      <option>Silver Ware Rentals</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Total Guests</label>
                    <select 
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    >
                      <option>50 - 150 guests</option>
                      <option>200 - 500 guests</option>
                      <option>500 - 1000 guests</option>
                      <option>1000+ Royal Feast</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Dietary Style</label>
                    <select 
                      name="dietaryPreference"
                      value={formData.dietaryPreference}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white"
                    >
                      <option>Pure Sattvik (No Onion/Garlic)</option>
                      <option>Pure Ghee Vegetarian (Standard)</option>
                      <option>Mughlai Feast (Egg/Halal Allowed)</option>
                      <option>Sugar-Free Organic Accents</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">Describe Your Desired Vibe & Mandap Theme</label>
                  <textarea 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe specific flower elements, ritual duration, raw mithai delivery protocols, budget limits..."
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors text-stone-900 dark:text-white resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-black tracking-widest uppercase rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Auspicious Booking Request</span>
                </button>
              </form>
            ) : (
              // SUBMITTED SUCCESS SHEET (VESTED RANGOLI RECEIPT)
              <div className="space-y-6 text-center py-6" id="success-intake-receipt">
                <div className="w-16 h-16 bg-green-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-200 dark:border-green-800 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black text-stone-900 dark:text-white uppercase tracking-tight">Booking Inquiry Registered!</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 px-4">
                    Pranam, <strong>{formData.fullName}</strong>. Your auspicious details are transmitted safely to the CP Concierge desk.
                  </p>
                </div>

                {/* Simulated Certificate Block */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-stone-900 dark:to-orange-950/20 p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-900/60 text-left relative overflow-hidden max-w-md mx-auto">
                  <div className="absolute top-0 right-0 p-2 text-stone-300 dark:text-stone-850 opacity-40">
                    <Bookmark className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-3 font-mono text-[11px] text-stone-700 dark:text-stone-300">
                    <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                      <span className="font-bold uppercase text-orange-600">Inquiry ID:</span>
                      <span className="font-black text-stone-900 dark:text-white">{inquiryId}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                      <span className="font-bold uppercase text-orange-600">Category:</span>
                      <span>{formData.ritualType}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                      <span className="font-bold uppercase text-orange-600">Date Proposed:</span>
                      <span>{formData.eventDate || 'Auspicious Muhurat Booking'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                      <span className="font-bold uppercase text-orange-600">Diet Standard:</span>
                      <span>{formData.dietaryPreference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold uppercase text-orange-600">Verification:</span>
                      <span className="text-green-600 font-black">● SUBMISSION OK</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 font-sans italic">
                  An SMS receipt and detailed email itinerary have been sent to <strong>{formData.phone}</strong> & <strong>{formData.email}</strong>. Our custom executive will call you within 2 clock hours.
                </p>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 border border-stone-200 dark:border-stone-700 rounded-xl text-[10px] font-bold uppercase hover:bg-stone-50 dark:hover:bg-stone-800 transition text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    Submit New Intake
                  </button>
                  <button 
                    onClick={() => onNavigate('landing')}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-bold uppercase transition cursor-pointer"
                  >
                    Go Back Home
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
