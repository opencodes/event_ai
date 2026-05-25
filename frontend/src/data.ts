import { Restaurant, UserProfile, AdminStats, MarketingCampaign, FoodItem } from './types';

export const FESTIVE_COLORS = {
  saffron: '#C51C13',
  marigold: '#FFCB44',
  red: '#E53935',
  green: '#2E7D32',
  bg: '#FFFDF7',
};

export const FESTIVE_COUPONS = [
  { code: 'DUSSEHRA50', discount: '50% OFF', desc: 'Up to ₹120 on festival special meals' },
  { code: 'FESTIVEFEAST', discount: '₹100 FLAT', desc: 'On orders of ₹499 and above' },
  { code: 'KASARIALOVE', discount: 'FREE SWEET', desc: 'Get free Kaju Katli box on orders above ₹599' },
  { code: 'WELCOMEUTSAV', discount: '60% OFF', desc: 'Welcome deal for first-time festival diners' },
];

export const CATEGORIES = [
  { id: 'sweets', name: 'Festive Sweets', icon: '✨', count: 12 },
  { id: 'biryani', name: 'Royal Biryani', icon: '🍛', count: 8 },
  { id: 'thali', name: 'Shahi Thali', icon: '🍱', count: 5 },
  { id: 'paneer', name: 'Paneer Specials', icon: '🧀', count: 18 },
  { id: 'chaat', name: 'Desi Chaat', icon: '🍢', count: 14 },
  { id: 'drinks', name: 'Cool Elixirs', icon: '🥤', count: 9 },
  { id: 'breads', name: 'Tandoor Breads', icon: '🫓', count: 11 },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Kesaria Golden Sweets',
    cuisine: ['Indian Sweets', 'Desserts', 'Bengali Mithai'],
    rating: 4.8,
    ratingCount: 1200,
    deliveryTime: 20,
    distance: 1.8,
    costForTwo: 300,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Indian sweets
    offerText: '60% OFF up to ₹120 | Use FESTIVE60',
    hasFestivalDeal: true,
    isVeg: true,
    isPureVeg: true,
    isPopular: true,
    featuredDishes: ['Shahi Malpua', 'Kesari Kaju Katli', 'Motichoor Laddoo'],
    menu: [
      {
        id: 'food-e-1',
        name: 'Kesari Kaju Katli (250g)',
        description: 'Premium cashew fudge refined with pure organic saffron and decorated with silver vark.',
        price: 280,
        rating: 4.9,
        ratingCount: 350,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Festive Sweets',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-2',
        name: 'Ghee Laddu Box (4pcs)',
        description: 'Melt-in-mouth laddoos prepared with golden pure cow ghee and dry fruits.',
        price: 150,
        rating: 4.7,
        ratingCount: 190,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Festive Sweets',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-3',
        name: 'Shahi Malpua with Rabdi',
        description: 'Traditional deep-fried pancakes soaked in sugar syrup, paired with dense cooked rabdi.',
        price: 199,
        rating: 4.8,
        ratingCount: 420,
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Festive Sweets',
        isVeg: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-4',
        name: 'Gulab Jamun (2 pcs)',
        description: 'Golden fried khoya dumplings soaked in rose-flavored saffron syrup.',
        price: 60,
        rating: 4.6,
        ratingCount: 500,
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Festive Sweets',
        isVeg: true,
      }
    ],
  },
  {
    id: 'rest-2',
    name: 'Mehfil Royal Biryani',
    cuisine: ['Mughlai', 'Biryani', 'North Indian'],
    rating: 4.6,
    ratingCount: 2400,
    deliveryTime: 35,
    distance: 3.2,
    costForTwo: 500,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Biryani
    offerText: '₹100 OFF with code FESTIVEFEAST',
    hasFestivalDeal: true,
    isVeg: false,
    isPopular: true,
    featuredDishes: ['Utsav Hydrabadi Biryani', 'Dum Paneer Biryani', 'Korma & Naan'],
    menu: [
      {
        id: 'food-e-5',
        name: 'Utsav Hydrabadi Chicken Biryani',
        description: 'Fragrant basmati rice layered with juicy pieces of chicken infused with festive spices.',
        price: 349,
        rating: 4.8,
        ratingCount: 1400,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Royal Biryani',
        isVeg: false,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-6',
        name: 'Saffron Veg Dum Biryani',
        description: 'Slow cooked aromatic rice loaded with garden fresh vegetables, paneer cublets, and rich saffron threads.',
        price: 299,
        rating: 4.5,
        ratingCount: 850,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Royal Biryani',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-7',
        name: 'Paneer Tikka Masala',
        description: 'Paneer chunks roasted in tandoor and simmered in an aromatic spiced tomato cream sauce.',
        price: 260,
        rating: 4.4,
        ratingCount: 620,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Paneer Specials',
        isVeg: true,
      }
    ],
  },
  {
    id: 'rest-3',
    name: 'Saffron Grand Thali & Rasoi',
    cuisine: ['Gujarati', 'Rajasthani', 'North Indian Thali'],
    rating: 4.7,
    ratingCount: 1800,
    deliveryTime: 28,
    distance: 2.5,
    costForTwo: 600,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Thali
    offerText: 'FREE Kesari Shrikhand | Code UTSAVSHREE',
    hasFestivalDeal: true,
    isVeg: true,
    isPureVeg: true,
    isPopular: true,
    featuredDishes: ['Shahi Diwali Festival Thali', 'Dal Baati Churma Special', 'Malai Kofta'],
    menu: [
      {
        id: 'food-e-8',
        name: 'The Great Shahi Diwali Festive Thali',
        description: 'A luxurious assortment of 4 curries (Dal Makhani, Shahi Paneer, Aloo Tamatar, Mix Veg), 2 sweets (Kaju Katli, Gulab Jamun), Basmati Rice, Butter Kulcha, Raita, and salad.',
        price: 450,
        rating: 4.9,
        ratingCount: 780,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Shahi Thali',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-9',
        name: 'Dal Baati Churma Traditional',
        description: 'Three baked wheat bati dipped in pure cow ghee, served with panchmel dal, spicy garlic chutney, and golden sweet churma.',
        price: 320,
        rating: 4.8,
        ratingCount: 450,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Shahi Thali',
        isVeg: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-10',
        name: 'Kaju Khoya Rich Curry',
        description: 'Rich creamy cashew and condensed milk gravy roasted to golden perfection with premium spices.',
        price: 289,
        rating: 4.6,
        ratingCount: 300,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Paneer Specials',
        isVeg: true,
      }
    ],
  },
  {
    id: 'rest-4',
    name: 'Chaat Street Bazaar',
    cuisine: ['Street Food', 'Snacks', 'Chaat'],
    rating: 4.5,
    ratingCount: 3100,
    deliveryTime: 15,
    distance: 0.9,
    costForTwo: 200,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Chaat / Samosa
    offerText: 'Buy 2 Get 1 FREE on Puchka / Dahi Puri',
    hasFestivalDeal: true,
    isVeg: true,
    isPureVeg: true,
    isPopular: false,
    featuredDishes: ['Festive Katori Chaat', 'Desi Ghee Samosa Plate', 'Shree Dahi Bhalla'],
    menu: [
      {
        id: 'food-e-11',
        name: 'Festive Special Crispy Katori Chaat',
        description: 'Large savory nested pastry cup filled with potatoes, sprouted chickpeas, curd, pomegranate, and sweet/tangy chutneys.',
        price: 130,
        rating: 4.7,
        ratingCount: 910,
        image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Desi Chaat',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      },
      {
        id: 'food-e-12',
        name: 'Diwali Samosa Plate (2pcs)',
        description: 'Golden, crispy cones stuffed with masala potato and green peas, topped with red imli and green mint sauce.',
        price: 70,
        rating: 4.4,
        ratingCount: 1400,
        image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Desi Chaat',
        isVeg: true,
      },
      {
        id: 'food-e-13',
        name: 'Utsav Special Thandi Lassi',
        description: 'Creamy yogurt beverage dressed in rich saffron malai, sliced almonds, and a touch of organic cardamom.',
        price: 90,
        rating: 4.8,
        ratingCount: 650,
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Cool Elixirs',
        isVeg: true,
        isBestSeller: true,
        isFestiveSpecial: true,
      }
    ],
  },
  {
    id: 'rest-5',
    name: 'Peshawari Tandoor & Curries',
    cuisine: ['North Indian', 'Tandoor', 'Kebabs'],
    rating: 4.4,
    ratingCount: 1750,
    deliveryTime: 30,
    distance: 4.1,
    costForTwo: 450,
    image: 'https://images.unsplash.com/photo-1545231027-63b3f162d20e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Curry
    offerText: '₹75 OFF with gold credit card',
    hasFestivalDeal: false,
    isVeg: false,
    featuredDishes: ['Paneer Tikka Charcoal', 'Butter Chicken Deluxe', 'Garlic Naan Basket'],
    menu: [
      {
        id: 'food-e-14',
        name: 'Charcoal Paneer Tikka (6pcs)',
        description: 'Slices of soft cottage cheese marinated in hung curd Kashmiri chili paste and grilled in clay-oven.',
        price: 240,
        rating: 4.5,
        ratingCount: 420,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Paneer Specials',
        isVeg: true,
      },
      {
        id: 'food-e-15',
        name: 'Butter Naan (1pc)',
        description: 'Traditional leavened flatbread freshly baked in tandoor slathered with salted butter.',
        price: 50,
        rating: 4.7,
        ratingCount: 1900,
        image: 'https://images.unsplash.com/photo-1545231027-63b3f162d20e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // bread
        category: 'Tandoor Breads',
        isVeg: true,
      }
    ]
  }
];

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Gaurav Sharma",
  email: "gaurav.sharma@utsav.com",
  phone: "+91 98765 43210",
  walletBalance: 1250,
  royaltyPoints: 480,
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      addressLine: 'A-402, Shanti Kunj Apartments, Sector 56',
      landmark: 'Near Golden Durga Mandir',
      city: 'Noida, UP'
    },
    {
      id: 'addr-2',
      type: 'Work',
      addressLine: 'Tower B, Floor 14, Tech Park Infinity',
      landmark: 'Opposite Holiday Inn Hotel',
      city: 'Gurugram, HR'
    }
  ],
  orders: [
    {
      id: 'FED-9821-A',
      restaurantName: 'Kesaria Golden Sweets',
      restaurantImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=100&auto=format&fit=crop&q=60',
      date: '2026-05-23 19:40',
      status: 'Delivered',
      items: [
        { name: 'Kesari Kaju Katli (250g)', quantity: 2, price: 280 },
        { name: 'Ghee Laddu Box (4pcs)', quantity: 1, price: 150 }
      ],
      totalAmount: 710,
      ratingGiven: 5,
    },
    {
      id: 'FED-9710-C',
      restaurantName: 'Mehfil Royal Biryani',
      restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&auto=format&fit=crop&q=60',
      date: '2026-05-20 13:10',
      status: 'Delivered',
      items: [
        { name: 'Saffron Veg Dum Biryani', quantity: 1, price: 299 },
        { name: 'Utsav Special Thandi Lassi', quantity: 2, price: 90 }
      ],
      totalAmount: 479,
      ratingGiven: 4,
    },
    {
      id: 'FED-9640-B',
      restaurantName: 'Saffron Grand Thali & Rasoi',
      restaurantImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&auto=format&fit=crop&q=60',
      date: '2026-05-18 20:15',
      status: 'Cancelled',
      items: [
        { name: 'The Great Shahi Diwali Festive Thali', quantity: 1, price: 450 }
      ],
      totalAmount: 450,
    }
  ],
  supportTickets: [
    {
      id: 'TCK-402',
      subject: 'Refund not credited in wallet for cancelled order FED-9640-B',
      category: 'Transactions & Refunds',
      status: 'Resolved',
      date: '2026-05-19',
      messages: [
        { sender: 'User', text: 'Hey, my order was cancelled but I still have not received the money back in my wallet.', time: '10:00 AM' },
        { sender: 'Support', text: 'Namaste Gaurav! We have verified the transaction and successfully credited ₹450 to your wallet. You should be able to see it now. Have a grand festive week!', time: '11:15 AM' },
        { sender: 'User', text: 'Thank you! Got the money.', time: '11:30 AM' }
      ]
    },
    {
      id: 'TCK-508',
      subject: 'Delay in delivery partner allocation during Dussehra evening peak',
      category: 'Delivery Delays',
      status: 'In Progress',
      date: '2026-05-23',
      messages: [
        { sender: 'User', text: 'Order FED-9821-A is stuck in preparing state for more than 20 mins.', time: '08:00 PM' },
        { sender: 'Support', text: 'Hi Gaurav, we extremely apologize. Due to heavy Diwali festive rain and peak demand, delivery times are temporarily delayed. A rider is being allocated on high priority.', time: '08:10 PM' }
      ]
    }
  ]
};

export const MOCK_ADMIN_STATS: AdminStats = {
  totalOrders: 2841,
  totalRevenue: 842150,
  activeCustomers: 12450,
  activeRestaurants: 74,
  revenueTrend: [
    { date: '18 May', revenue: 95000, orders: 310 },
    { date: '19 May', revenue: 105000, orders: 340 },
    { date: '20 May', revenue: 115000, orders: 380 },
    { date: '21 May', revenue: 142000, orders: 480 },
    { date: '22 May', revenue: 165000, orders: 540 },
    { date: '23 May', revenue: 220150, orders: 791 },
  ],
  categorySales: [
    { category: 'Festive Sweets', value: 38 },
    { category: 'Royal Biryani', value: 25 },
    { category: 'Shahi Thalis', value: 18 },
    { category: 'Desi Chaat', value: 14 },
    { category: 'Breads & Curries', value: 5 },
  ],
  recentOrders: [
    {
      id: 'FED-9831',
      customerName: 'Aishwarya Roy',
      restaurantName: 'Kesaria Golden Sweets',
      items: 'Kesari Kaju Katli (250g) x2',
      amount: 560,
      status: 'Pending',
      time: 'Just now'
    },
    {
      id: 'FED-9830',
      customerName: 'Virat Kohli',
      restaurantName: 'Mehfil Royal Biryani',
      items: 'Saffron Veg Dum Biryani x1',
      amount: 299,
      status: 'Preparing',
      time: '4 mins ago'
    },
    {
      id: 'FED-9829',
      customerName: 'Rohit Sharma',
      restaurantName: 'Saffron Grand Thali & Rasoi',
      items: 'The Great Shahi Diwali Festive Thali x2',
      amount: 900,
      status: 'Out for Delivery',
      time: '12 mins ago'
    },
    {
      id: 'FED-9828',
      customerName: 'Ananya Panday',
      restaurantName: 'Chaat Street Bazaar',
      items: 'Katori Chaat x3, Samosa Plate x1',
      amount: 460,
      status: 'Delivered',
      time: '25 mins ago'
    },
    {
      id: 'FED-9827',
      customerName: 'Karan Johar',
      restaurantName: 'Peshawari Tandoor',
      items: 'Charcoal Paneer Tikka x1, Butter Naan x2',
      amount: 340,
      status: 'Cancelled',
      time: '45 mins ago'
    }
  ]
};

export const MOCK_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    title: 'Diwali Special 2026 Sweet Extravaganza',
    code: 'DIWALISWEET',
    discount: 'Buy 500g sweets, Get 100g Laddoo Box FREE',
    status: 'Active',
    performance: 82,
    type: 'Festival',
    startDate: '2026-05-15',
    endDate: '2026-05-31',
  },
  {
    id: 'camp-2',
    title: 'Weekend Saffron Feast Biryani Rush',
    code: 'SAFFRONFEAST',
    discount: '30% Off up to ₹150 + free delivery',
    status: 'Active',
    performance: 64,
    type: 'Coupon',
    startDate: '2026-05-01',
    endDate: '2026-05-30',
  },
  {
    id: 'camp-3',
    title: 'Warm Welcome New User Campaign',
    code: 'UTSAVWELCOME',
    discount: '60% Off up to ₹200 for 1st order',
    status: 'Scheduled',
    performance: 0,
    type: 'Coupon',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
  },
  {
    id: 'camp-4',
    title: 'Utsav Food Carnival App Download Banner',
    code: 'CARNIVALBANNER',
    discount: 'Interactive Carousel Main Banner',
    status: 'Active',
    performance: 45,
    type: 'Banner',
    startDate: '2026-05-10',
    endDate: '2026-05-28',
  },
  {
    id: 'camp-5',
    title: 'Festive Friend Referral Bonanza',
    code: 'REFUTSAV',
    discount: '₹150 cashback in wallet for both users',
    status: 'Active',
    performance: 28,
    type: 'Referral',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
  }
];
