const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Category = require("./models/Category");

dotenv.config();

// Categories to be created (Furniture removed, tech-only)
const categories = [
  { name: "Audio", description: "Audio devices, headphones, and speakers" },
  { name: "Wearables", description: "Wearable smart technology" },
  { name: "Accessories", description: "Computer and gaming accessories" },
  { name: "Storage", description: "High-speed storage drives" },
  { name: "Power", description: "Charging adapters and power devices" },
  { name: "Displays", description: "Monitors and display systems" },
  { name: "VR & Tech", description: "Virtual reality and next-gen tech devices" },
];

// Product templates with price in USD and high-resolution Unsplash URLs
const productTemplates = [
  {
    name: "Sequoia Inspiring Musico",
    description: "Experience professional acoustic engineering. Built with dynamic 40mm drivers, active noise cancellation, and soft memory-foam cups for hours of luxurious listening.",
    price: 299,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 15,
  },
  {
    name: "New Gen X-Bud",
    description: "Sleek, splash-proof wireless earbuds featuring intelligent audio filters, ultra-clear microphones, and a dynamic 30-hour battery life charging case.",
    price: 149,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
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
    name: "Portable Soundwave Speaker",
    description: "Rugged waterproof Bluetooth speaker offering 360-degree immersive audio playback and 12 hours of battery lifespan.",
    price: 89,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    countInStock: 14,
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
    image: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600",
    category: "Storage",
    countInStock: 10,
  },
  {
    name: "Fast Power Bank 20000mAh",
    description: "High capacity portable charger with dual USB-C output ports and 22.5W quick power delivery.",
    price: 49,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&q=80&w=600",
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
    name: "Smart RGB Desk Lightstrip",
    description: "Customizable dynamic neon LED ambient strip lighting compatible with home automated sync programs.",
    price: 29,
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600",
    category: "VR & Tech",
    countInStock: 35,
  },
  {
    name: "Multi Wireless Charging Stand",
    description: "Fast qi wireless charging base stand for smartphones, smartwatches, and wireless earbud cases.",
    price: 39,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600",
    category: "Power",
    countInStock: 18,
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
