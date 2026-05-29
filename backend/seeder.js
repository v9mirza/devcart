const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Category = require("./models/Category");

dotenv.config();

// Tech-only categories to be created (exactly 7)
const categories = [
  { name: "Audio", description: "Audio devices, headphones, and speakers" },
  { name: "Wearables", description: "Wearable smart technology" },
  { name: "Accessories", description: "Computer and gaming accessories" },
  { name: "Storage", description: "High-speed storage drives" },
  { name: "Power", description: "Charging adapters and power devices" },
  { name: "Displays", description: "Monitors and display systems" },
  { name: "VR & Tech", description: "Virtual reality and next-gen tech devices" },
];

// Product templates with price in USD and external image URLs
const productTemplates = [
  {
    name: "Sequoia Inspiring Musico",
    description: "Experience professional acoustic engineering. Built with dynamic 40mm drivers, active noise cancellation, and soft memory-foam cups for hours of luxurious listening.",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=900",
    category: "Audio",
    countInStock: 15,
  },
  {
    name: "New Gen X-Bud",
    description: "Sleek, splash-proof wireless earbuds featuring intelligent audio filters, ultra-clear microphones, and a dynamic 30-hour battery life charging case.",
    price: 149,
    image: "https://images.unsplash.com/photo-1636093973985-4fe333d36de9?auto=format&fit=crop&q=80&w=900",
    category: "Audio",
    countInStock: 25,
  },
  {
    name: "Aura VR Glass",
    description: "Immersive VR headset featuring dual 4K resolution screens, ultra-fast refresh rates, spatial sound, and smart spatial tracking controllers.",
    price: 499,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600",
    category: "VR & Tech",
    countInStock: 8,
  },
  {
    name: "Wireless Headset Pro",
    description: "Studio-grade wireless over-ear headphones with premium deep bass driver cores and built-in acoustic isolating earcups.",
    price: 249,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 12,
  },
  {
    name: "Smart Watch Active",
    description: "Full health metrics tracking smart watch. Features heart rate sensor, active GPS, sleep monitor, and a gorgeous AMOLED glass display.",
    price: 199,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    countInStock: 18,
  },
  {
    name: "RGB Mechanical Keyboard",
    description: "Tactile clicky mechanical keyboard with customizable RGB backlighting and premium aluminum build frame.",
    price: 129,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 20,
  },
  {
    name: "Precision Gaming Mouse",
    description: "High-precision wireless gaming mouse with 20K DPI optical sensor and ultra-fast polling rate options.",
    price: 79,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 30,
  },
  {
    name: "Light Grey Surface Headphone",
    description: "Light grey premium surface headphone with deep tuned bass, smooth comfort padding, and immersive clarity for everyday listening.",
    price: 349,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 9,
  },
  {
    name: "Streaming 4K Webcam",
    description: "Ultra HD webcam for crystal-clear streaming, digital meetings, and autofocus support.",
    price: 99,
    image: "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 16,
  },
  {
    name: "Multiport USB-C Hub",
    description: "7-in-1 space gray aluminum USB-C hub adapter containing HDMI, USB-A ports, and memory card readers.",
    price: 59,
    image: "https://images.unsplash.com/photo-1558489080-2a075ec8039c?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 40,
  },
  {
    name: "External SSD 1TB",
    description: "Portable high-speed solid state drive for backing up files, editing media, and transferring data fast.",
    price: 119,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600",
    category: "Storage",
    countInStock: 10,
  },
  {
    name: "Fast Power Bank 20000mAh",
    description: "High capacity portable charger with dual USB-C output ports and 22.5W quick power delivery.",
    price: 49,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 22,
  },
  {
    name: "Multi-device Charger 65W",
    description: "Compact wall adapter utilizing GaN technology to charge laptops, tablets, and phones simultaneously.",
    price: 39,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 26,
  },
  {
    name: "Curved Gaming Monitor 27\"",
    description: "27 inch curved display panel featuring 165Hz refresh rate and HDR gaming color precision profiles.",
    price: 349,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
    category: "Displays",
    countInStock: 6,
  },
  {
    name: "Multi Wireless Charging Stand",
    description: "Fast qi wireless charging base stand for smartphones, smartwatches, and wireless earbud cases.",
    price: 39,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 18,
  },
  {
    name: "Spatial Motion VR Controllers",
    description: "Ergonomic motion controllers optimized for VR tracking with haptic feedback and ultra-low latency pairing.",
    price: 179,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600",
    category: "VR & Tech",
    countInStock: 9,
  },
  {
    name: "Hi-Fi USB-C DAC Headphone Amp",
    description: "Compact USB-C audio DAC/amp tuned for rich detail, low-noise output, and effortless high-impedance headphone drive.",
    price: 129,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 14,
  },
  {
    name: "Fitness Tracker Ring",
    description: "Discreet smart fitness ring measuring heart rate trends, recovery readiness, and sleep performance.",
    price: 149,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    countInStock: 11,
  },
  {
    name: "NVMe SSD 2TB",
    description: "High-throughput NVMe SSD designed for fast boot, rapid file transfers, and smooth creative workflows.",
    price: 159,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600",
    category: "Storage",
    countInStock: 7,
  },
  {
    name: "Portable 4K Monitor 15.6\"",
    description: "Lightweight 15.6 inch portable 4K monitor for work-from-anywhere setups with crisp color and sharp text.",
    price: 219,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
    category: "Displays",
    countInStock: 5,
  },
  {
    name: "Studio Reference Monitors",
    description: "Pair of powered near-field studio monitors with flat frequency response for mixing, editing, and critical listening.",
    price: 279,
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 8,
  },
  {
    name: "Open-Ear Sport Buds",
    description: "Open-ear wireless earbuds that keep you aware of your surroundings while delivering punchy audio on runs and rides.",
    price: 119,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 21,
  },
  {
    name: "Travel ANC Headphones",
    description: "Foldable over-ear headphones with adaptive noise cancellation, 40-hour battery life, and a compact travel case.",
    price: 329,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 13,
  },
  {
    name: "Bluetooth Party Speaker",
    description: "Room-filling portable speaker with deep bass radiators, IPX7 splash resistance, and stereo pairing for outdoor events.",
    price: 199,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 17,
  },
  {
    name: "Smart Glasses Lite",
    description: "Lightweight smart glasses with open-ear audio, voice assistant shortcuts, and UV-protective polarized lenses.",
    price: 249,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbbce1b?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    countInStock: 6,
  },
  {
    name: "GPS Running Watch Pro",
    description: "Multi-band GPS running watch with advanced training metrics, breadcrumb navigation, and 14-day battery life.",
    price: 279,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    countInStock: 10,
  },
  {
    name: "Ergonomic Vertical Mouse",
    description: "Wireless vertical mouse designed to reduce wrist strain with adjustable DPI presets and silent click switches.",
    price: 69,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 24,
  },
  {
    name: "Desk Ring Light Pro",
    description: "Adjustable 10-inch LED ring light with warm-to-cool color temperature control for streaming, calls, and content creation.",
    price: 89,
    image: "https://images.unsplash.com/photo-1598305038224-9a166f962e8c?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 19,
  },
  {
    name: "Thunderbolt 4 Dock",
    description: "Desktop Thunderbolt 4 dock with dual 4K display support, 90W laptop charging, and front-facing USB-C fast access.",
    price: 189,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 11,
  },
  {
    name: "Laptop Stand Aluminum",
    description: "Adjustable aluminum laptop stand with cable routing and improved airflow for long coding and design sessions.",
    price: 45,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    countInStock: 35,
  },
  {
    name: "MicroSD Pro 512GB",
    description: "A2-rated 512GB microSD card built for 4K video capture, drone footage, and fast app storage on compatible devices.",
    price: 79,
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d631?auto=format&fit=crop&q=80&w=600",
    category: "Storage",
    countInStock: 28,
  },
  {
    name: "NAS HDD Enclosure 2-Bay",
    description: "Two-bay USB 3.2 storage enclosure for home backups and media libraries with tool-free drive trays.",
    price: 99,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d7a2cd7c?auto=format&fit=crop&q=80&w=600",
    category: "Storage",
    countInStock: 9,
  },
  {
    name: "Solar Power Bank 30000mAh",
    description: "Rugged solar-ready power bank with 30000mAh capacity, LED flashlight, and dual USB-C PD outputs for travel.",
    price: 89,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 15,
  },
  {
    name: "MagSafe Car Charger",
    description: "Vent-mounted magnetic car charger with 15W fast wireless charging and strong grip for bumpy commutes.",
    price: 34,
    image: "https://images.unsplash.com/photo-1591290619762-d2f69c4f4d08?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 32,
  },
  {
    name: "UltraWide Monitor 34\"",
    description: "34-inch ultrawide QHD panel with 144Hz refresh, curved VA screen, and adaptive sync for immersive productivity and gaming.",
    price: 449,
    image: "https://images.unsplash.com/photo-1547083327-19f3076e5e6e?auto=format&fit=crop&q=80&w=600",
    category: "Displays",
    countInStock: 4,
  },
  {
    name: "4K Productivity Monitor 32\"",
    description: "32-inch 4K IPS monitor with USB-C hub, 65W power delivery, and factory-calibrated color for design work.",
    price: 399,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
    category: "Displays",
    countInStock: 7,
  },
  {
    name: "VR Treadmill Sensor Kit",
    description: "Foot and hip tracking sensor kit that improves locomotion accuracy in compatible VR fitness and exploration apps.",
    price: 299,
    image: "https://images.unsplash.com/photo-1622979135225-d2c89ef5101b?auto=format&fit=crop&q=80&w=600",
    category: "VR & Tech",
    countInStock: 5,
  },
  {
    name: "Mixed Reality Developer Kit",
    description: "Developer-focused mixed reality headset kit with passthrough cameras, hand tracking, and SDK-ready calibration tools.",
    price: 599,
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&q=80&w=600",
    category: "VR & Tech",
    countInStock: 3,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing categories and products
    await Category.deleteMany();
    await Product.deleteMany();

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Map product templates to use category IDs
    const products = productTemplates.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log("Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
