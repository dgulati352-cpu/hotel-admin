export const initialDishes = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    price: 250,
    category: "Main Course",
    type: "veg",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Chicken Biryani",
    price: 320,
    category: "Main Course",
    type: "non-veg",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 299,
    category: "Fast Food",
    type: "veg",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const initialOrders = [
  {
    id: "ORD-1001",
    table_number: "T-04",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 250 },
      { name: "Margherita Pizza", quantity: 1, price: 299 }
    ],
    total_amount: 799,
    payment_method: "UPI",
    status: "pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: "ORD-1002",
    table_number: "T-12",
    items: [
      { name: "Chicken Biryani", quantity: 3, price: 320 }
    ],
    total_amount: 960,
    payment_method: "Counter",
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
  }
];
