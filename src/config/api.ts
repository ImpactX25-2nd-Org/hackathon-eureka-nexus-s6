// src/config/api.ts

// ✅ Use a trailing slash-safe base URL
export const API_BASE_URL = "http://127.0.0.1:5000";

// ✅ Centralized API endpoints
export const API_ENDPOINTS = {
  // Orders
  orders: "/api/orders",
  orderDetails: (id: string) => `/api/orders/${id}`,

  // User
  profile: "/api/user/profile",

  // Bookings
  bookings: "/api/bookings",
  createBooking: "/api/bookings/create",

  // Services
  services: "/api/services",
  pricing: "/api/pricing",

  // Products
  products: "/api/products",
  productDetails: (id: number) => `/api/products/${id}`,
};
