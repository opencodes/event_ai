export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestSeller?: boolean;
  isFestiveSpecial?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  deliveryTime: number; // in mins
  distance: number; // in km
  costForTwo: number;
  image: string;
  offerText?: string;
  hasFestivalDeal?: boolean;
  isVeg?: boolean;
  isPureVeg?: boolean;
  isPopular?: boolean;
  featuredDishes: string[];
  menu: FoodItem[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  addressLine: string;
  landmark?: string;
  city: string;
}

export interface OrderHistoryItem {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  ratingGiven?: number;
}

export interface WalletTransaction {
  id: string;
  type: 'Credit' | 'Debit';
  amount: number;
  date: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  date: string;
  messages: { sender: 'User' | 'Support'; text: string; time: string }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  royaltyPoints: number;
  addresses: SavedAddress[];
  orders: OrderHistoryItem[];
  supportTickets: SupportTicket[];
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  activeRestaurants: number;
  revenueTrend: { date: string; revenue: number; orders: number }[];
  categorySales: { category: string; value: number }[];
  recentOrders: {
    id: string;
    customerName: string;
    restaurantName: string;
    items: string;
    amount: number;
    status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    time: string;
  }[];
}

export interface MarketingCampaign {
  id: string;
  title: string;
  code: string;
  discount: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  performance: number; // Percentage conversion or count
  type: 'Coupon' | 'Banner' | 'Festival' | 'Referral';
  startDate: string;
  endDate: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  celebrants: string;
  location: string;
  date: string;
  category: 'Royal Palace' | 'Mithila Heritage' | 'Contemporary' | 'Corporate Festive';
  image: string;
  guestCount: number;
  highlightFood: string;
  decorTheme: string;
  quoteAuthor: string;
  quoteText: string;
  description: string;
  detailedCaseStudy: {
    story: string;
    timeline: { time: string; ritual: string }[];
    chefSpecial: string[];
    invitationTheme: string;
    decorationSecrets: string[];
  };
}
