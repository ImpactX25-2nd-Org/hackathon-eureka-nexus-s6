// src/services/api.ts

const API_BASE_URL = "http://localhost:5000";

const API_ENDPOINTS = {
  // Orders
  orders: "/api/orders",
  orderDetails: (orderId: string) => `/api/orders/${orderId}`,
  
  // Booking
  createBooking: "/api/bookings/create",
  
  // Users
  users: "/api/users",
  profile: "/api/profile",
  
  // Drivers
  drivers: "/api/drivers",
  
  // Products (if needed)
  products: "/api/products",
  productDetails: (productId: number) => `/api/products/${productId}`,
  
  // Services (if needed)
  pricing: "/api/pricing",
  services: "/api/services",
};

// ✅ Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// ✅ Order Services
export interface OrderDetails {
  id: string;
  status: string;
  date: string;
  time: string;
  address: string;
  service: string;
  driver: {
    name: string;
    phone: string;
    plateNo: string;
    location: string;
  };
  payment: {
    amount: string;
    method: string;
    transactionId: string;
    status: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Booking {
  id: string;
  status: string;
  date: string;
  time: string;
  address: string;
  service: string;
}

// Backend Order Response (matches your actual backend)
export interface BackendOrder {
  pickupId: string;
  wasteType: string;
  pickupTime: string;
  pickupDate: string;
  userLocation: string;
  cost: string;
  pickupRating: number;
  notes: string;
  photoFilename: string | null;
  userId: number;
  driverId: number;
}

export const orderService = {
  getOrderDetails: (orderId: string) =>
    fetchAPI<OrderDetails>(API_ENDPOINTS.orderDetails(orderId)),

  getAllOrders: async (): Promise<Booking[]> => {
    const backendOrders = await fetchAPI<BackendOrder[]>(API_ENDPOINTS.orders);
    
    // Map backend format to frontend format
    return backendOrders.map(order => ({
      id: order.pickupId,
      status: order.pickupRating > 0 ? "Completed" : "Scheduled",
      date: order.pickupDate,
      time: order.pickupTime,
      address: order.userLocation,
      service: order.wasteType,
    }));
  },
  
  getOrderById: (orderId: string) =>
    fetchAPI<BackendOrder>(API_ENDPOINTS.orderDetails(orderId)),
};

// ✅ User Services
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export const userService = {
  getProfile: () =>
    fetchAPI<UserProfile>(API_ENDPOINTS.profile),
};

// ✅ Booking Services
export interface CreateBookingData {
  wasteType: string;
  address: string;
  pickupTime: string;
  notes?: string;
  photo?: File;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingData): Promise<BookingResponse> => {
    console.log("📤 Sending booking request:", {
      wasteType: data.wasteType,
      address: data.address,
      pickupTime: data.pickupTime,
      hasNotes: !!data.notes,
      hasPhoto: !!data.photo,
    });

    const formData = new FormData();
    
    // Add required fields
    formData.append("wasteType", data.wasteType);
    formData.append("address", data.address);
    formData.append("pickupTime", data.pickupTime);
    
    // Add optional fields only if they exist
    if (data.notes) {
      formData.append("notes", data.notes);
    }
    
    if (data.photo) {
      formData.append("photo", data.photo);
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createBooking}`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("❌ Booking failed:", errorData);
      throw new Error(errorData.error || `Booking failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Booking successful:", result);
    return result;
  },
};

// ✅ Product Services
export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  rating: number;
}

export const productService = {
  getAllProducts: () =>
    fetchAPI<Product[]>(API_ENDPOINTS.products),

  getProductDetails: (productId: number) =>
    fetchAPI<Product>(API_ENDPOINTS.productDetails(productId)),
};

// ✅ Service/Pricing Services
export interface Service {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export const serviceService = {
  getPricing: () =>
    fetchAPI<Service[]>(API_ENDPOINTS.pricing),

  getServices: () =>
    fetchAPI<Service[]>(API_ENDPOINTS.services),
};