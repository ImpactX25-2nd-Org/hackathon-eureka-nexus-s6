import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

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
    throw new Error(`API Error: ${response.statusText}`);
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

export const orderService = {
  getOrderDetails: (orderId: string) =>
    fetchAPI<OrderDetails>(API_ENDPOINTS.orderDetails(orderId)),

  getAllOrders: () =>
    fetchAPI<Booking[]>(API_ENDPOINTS.orders),
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
  notes: string;
  pickupTime: string;
  photo?: File;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingData) => {
    const formData = new FormData();
    formData.append("wasteType", data.wasteType);
    formData.append("address", data.address);
    formData.append("notes", data.notes);
    formData.append("pickupTime", data.pickupTime);
    if (data.photo) {
      formData.append("photo", data.photo);
    }

    // ✅ Fixed: Corrected fetch call and variable name
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createBooking}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.statusText}`);
    }

    return response.json() as Promise<BookingResponse>;
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
