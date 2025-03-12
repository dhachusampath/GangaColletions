import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

// Create the Store Context
const StoreContext = createContext();

// Custom Hook for accessing the store
export const useStore = () => useContext(StoreContext);

 

// Store Provider Component
export const StoreProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("retailer"); // Default to 'retailer'
  const [products, setProducts] = useState([]);
  const categories = [
    { name: "All", subcategories: [] },
    { name: "Mugapu Thali chains", subcategories: [] },
    {
      name: "Impon jewelleries",
      subcategories: [
        "Dollar Chains",
        "Attigai",
        "Bangles",
        "Rings",
        "Metti / Toe rings",
        "Thali urukkal",
        "kaapu / kada",
      ],
    },
    {
      name: "Necklace",
      subcategories: [
        "Gold plated Necklace",
        "Stone necklace",
        "Antique & Matte necklace",
      ],
    },
    {
      name: "Haram",
      subcategories: [
        "Goldplated",
        "Stone Haram",
        "Antique & Matte",
      ],
    },
    {
      name: "Combo sets",
      subcategories: [
        "Gold plated Combo sets",
        "Stone sets Combo sets",
      ],
    },
    { name: "Daily use chains", subcategories: [] },
    { name: "Forming", subcategories: [] },
    {
      name: "Bangles",
      subcategories: [
        "Gold plated Bangles",
        "Microplated Bangles",
        "Impon Bangles",
        "Antique & Matte Bangles",
        "Baby Bangles",
      ],
    },
    {
      name: "Earrings",
      subcategories: [
        "Gold plated Earrings",
        "Microplated Earrings",
        "Impon Earrings",
        "Antique & Matte",
      ],
    },
    { name: "Anklets", subcategories: [] },
    { name: "Maatal & Tikka", subcategories: [] },
    { name: "Combo offer sets", subcategories: [] },
    { name: "Hipbelts", subcategories: [] },
    { name: "Rings", subcategories: ["Diamond Rings", "Gold Rings"] },
    { name: "Necklaces", subcategories: ["Gold Necklaces", "Silver Necklaces"] },
    { name: "Earrings", subcategories: ["Diamond Earrings", "Pearl Earrings"] },
    { name: "Bracelets", subcategories: ["Platinum Bracelets", "Silver Bracelets"] },
  ];
  const [cart, setCart] = useState([]);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const toggleCartSidebar = () => {
    setCartSidebarOpen(!cartSidebarOpen);
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      if (!storedUserId) {
        console.warn('No userId found in localStorage.');
        return;
      }
  
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/user/${storedUserId}`);
        if (response.data?.user) {
          setUserRole(response.data.user.isRetailer ? 'retailer' : 'wholesaler');
        } else {
          console.error('User data is missing in the response:', response.data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data.');
      }
    };
  
    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;
  
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/user/${storedUserId}`);
        const user = response.data.user;
  
        if (user?.isRetailer === false) {
          setUserRole("wholesaler");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const syncCartWithBackend = async () => {
      if (cart.length > 0) {
        try {
          await axios.post(`${API_BASE_URL}/cart/sync`, {
            userId,
            cartItems: cart,
          });
          console.log("Cart synced with backend.");
        } catch (error) {
          console.error("Error syncing cart with backend:", error);
        }
      }
    };

    fetchUserRole();
  }, [userId, cart]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
        setCart(response.data.items); // Update context or state with fetched cart items
        setLoading(false);
      } catch (error) {
        setError('Error fetching cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCart, userId]);
  
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        console.log("Fetched products:", response.data); // Log the response data
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  
  useEffect(() => {
    console.log("Products updated:", products); // This will log after products are updated
  }, [products]);
    

  
  
  const addToCart = async (product, selectedSize, currentPrice) => {
    const productId = product._id;
    const image = product.images?.[0]; // Get the first image from the array (if it exists)
  
    // Check if the same product with the selected size already exists in the cart
    const existingItem = cart.find(
      (item) => item.productId === productId && item.size === selectedSize
    );
  
    if (existingItem) {
      // If the same product with the same size exists, update its quantity locally
      const newCart = cart.map((item) =>
        item.productId === productId && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1, price: currentPrice }
          : item
      );
      setCart(newCart);
  
      // Send update to backend
      try {
        await axios.post(`${API_BASE_URL}/cart/update`, {
          userId: userId, // Replace with actual user ID from your auth system
          productId,
          size: selectedSize,
          quantity: existingItem.quantity + 1,
          price: currentPrice,
          name: product.name,
          image,
        });
      } catch (error) {
        console.error("Error updating backend for existing item:", error);
      }
    } else {
      // If no match with size is found, add as a new item locally
      const newCart = [
        ...cart,
        {
          productId,
          size: selectedSize,
          quantity: 1,
          price: currentPrice,
          name: product.name,
          image, // Include the image
        },
      ];
      setCart(newCart);
  
      // Send addition to backend
      try {
        await axios.post(`${API_BASE_URL}/cart/add`, {
          userId: userId, // Replace with actual user ID from your auth system
          productId,
          size: selectedSize,
          quantity: 1,
          price: currentPrice,
          name: product.name,
          image, // Include the image in the request
        });
      } catch (error) {
        console.error("Error updating backend for new item:", error);
      }
    }
  
    setCartSidebarOpen(true); // Open the cart sidebar when adding an item
  };
  
   
  
  const removeFromCart = async (productId, size) => {
    // Remove item locally
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.size === size))
    );
    console.log(`Removed product with ID: ${productId}, size: ${size}`);
  
    // Send removal to backend
    try {
      await axios.post(`${API_BASE_URL}/cart/remove`, {
        userId: userId, // Replace with actual user ID
        productId,
        size,
      });
      console.log("Backend updated successfully for removal.");
    } catch (error) {
      console.error("Error updating backend for removal:", error);
      // Optionally refetch the cart to ensure state consistency
    }
  };
  
  const updateQuantity = async (productId, size, quantity) => {
    if (quantity <= 0) {
      // Remove the product if quantity is zero or less
      await removeFromCart(productId, size);
    } else {
      // Update the quantity for the product with matching productId and size locally
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
      console.log(`Updated quantity locally for productId: ${productId}, size: ${size}, to: ${quantity}`);
  
      // Send quantity update to backend
      try {
        await axios.post(`${API_BASE_URL}/cart/update`, {
          userId: userId, // Replace with actual user ID
          productId,
          size,
          quantity,
        });
        console.log("Backend updated successfully for quantity update.");
      } catch (error) {
        console.error("Error updating backend for quantity update:", error);
        // Optionally refetch the cart to ensure state consistency
      }
    }
  };
  
  
  
  
const calculateSubtotal = () =>  cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    products,
    setProducts,
    categories,
    cart,setCart,
    API_BASE_URL,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSubtotal,
    cartSidebarOpen,
    toggleCartSidebar,
    userRole, setUserRole,
    authToken, setAuthToken,userId, setUserId,
    
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
