const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Category = require("./models/Category");

dotenv.config();

// --- Categories ---

const categories = [
  { name: "Audio", description: "Audio devices, headphones, and speakers" },
  { name: "Wearables", description: "Wearable smart technology" },
  { name: "Accessories", description: "Computer and gaming accessories" },
  { name: "Storage", description: "High-speed storage drives" },
  { name: "Power", description: "Charging adapters and power devices" },
  { name: "Displays", description: "Monitors and display systems" },
  { name: "VR & Tech", description: "Virtual reality and next-gen tech devices" },
];


// --- Helpers ---

const unsplash = (photoId, width = 600) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=${width}`;

/** Category is a name here; resolved to a MongoDB id before insert. */
const product = ({
  name,
  description,
  price,
  category,
  countInStock,
  image,
  rating,
  reviewsCount,
}) => ({
  name,
  description,
  price,
  category,
  countInStock,
  image,
  rating,
  reviewsCount,
});


// --- Products (grouped by category) ---

const audio = [
  product({
    name: "Sequoia Inspiring Musico",
    description:
      "Experience professional acoustic engineering. Built with dynamic 40mm drivers, active noise cancellation, and soft memory-foam cups for hours of luxurious listening.",
    price: 299,
    category: "Audio",
    countInStock: 15,
    image: unsplash("1505740420928-5e560c06d30e", 900),
    rating: 4.8,
    reviewsCount: 1240,
  }),
  product({
    name: "New Gen X-Bud",
    description:
      "Sleek, splash-proof wireless earbuds featuring intelligent audio filters, ultra-clear microphones, and a dynamic 30-hour battery life charging case.",
    price: 149,
    category: "Audio",
    countInStock: 25,
    image: unsplash("1636093973985-4fe333d36de9", 900),
    rating: 4.6,
    reviewsCount: 890,
  }),
  product({
    name: "Wireless Headset Pro",
    description:
      "Studio-grade wireless over-ear headphones with premium deep bass driver cores and built-in acoustic isolating earcups.",
    price: 249,
    category: "Audio",
    countInStock: 12,
    image: unsplash("1505740420928-5e560c06d30e"),
    rating: 4.7,
    reviewsCount: 654,
  }),
  product({
    name: "Light Grey Surface Headphone",
    description:
      "Light grey premium surface headphone with deep tuned bass, smooth comfort padding, and immersive clarity for everyday listening.",
    price: 349,
    category: "Audio",
    countInStock: 9,
    image: unsplash("1546435770-a3e426bf472b"),
    rating: 4.6,
    reviewsCount: 430,
  }),
  product({
    name: "Hi-Fi USB-C DAC Headphone Amp",
    description:
      "Compact USB-C audio DAC/amp tuned for rich detail, low-noise output, and effortless high-impedance headphone drive.",
    price: 129,
    category: "Audio",
    countInStock: 14,
    image: unsplash("1505740420928-5e560c06d30e"),
    rating: 4.9,
    reviewsCount: 340,
  }),
  product({
    name: "Studio Reference Monitors",
    description:
      "Pair of powered near-field studio monitors with flat frequency response for mixing, editing, and critical listening.",
    price: 279,
    category: "Audio",
    countInStock: 8,
    image: unsplash("1487180144351-b8472da7d491"),
    rating: 4.9,
    reviewsCount: 167,
  }),
  product({
    name: "Open-Ear Sport Buds",
    description:
      "Open-ear wireless earbuds that keep you aware of your surroundings while delivering punchy audio on runs and rides.",
    price: 119,
    category: "Audio",
    countInStock: 21,
    image: unsplash("1572569511254-d8f925fe2cbb"),
    rating: 4.5,
    reviewsCount: 920,
  }),
  product({
    name: "Travel ANC Headphones",
    description:
      "Foldable over-ear headphones with adaptive noise cancellation, 40-hour battery life, and a compact travel case.",
    price: 329,
    category: "Audio",
    countInStock: 13,
    image: unsplash("1484704849700-f032a568e944"),
    rating: 4.8,
    reviewsCount: 1450,
  }),
  product({
    name: "Bluetooth Party Speaker",
    description:
      "Room-filling portable speaker with deep bass radiators, IPX7 splash resistance, and stereo pairing for outdoor events.",
    price: 199,
    category: "Audio",
    countInStock: 17,
    image: unsplash("1608043152269-423dbba4e7e1"),
    rating: 4.6,
    reviewsCount: 680,
  }),
];

const wearables = [
  product({
    name: "Smart Watch Active",
    description:
      "Full health metrics tracking smart watch. Features heart rate sensor, active GPS, sleep monitor, and a gorgeous AMOLED glass display.",
    price: 199,
    category: "Wearables",
    countInStock: 18,
    image: unsplash("1523275335684-37898b6baf30"),
    rating: 4.5,
    reviewsCount: 1120,
  }),
  product({
    name: "Fitness Tracker Ring",
    description:
      "Discreet smart fitness ring measuring heart rate trends, recovery readiness, and sleep performance.",
    price: 149,
    category: "Wearables",
    countInStock: 11,
    image: unsplash("1523275335684-37898b6baf30"),
    rating: 4.4,
    reviewsCount: 760,
  }),
  product({
    name: "Smart Glasses Lite",
    description:
      "Lightweight smart glasses with open-ear audio, voice assistant shortcuts, and UV-protective polarized lenses.",
    price: 249,
    category: "Wearables",
    countInStock: 6,
    image: unsplash("1574258495973-f010dfbbce1b"),
    rating: 4.3,
    reviewsCount: 210,
  }),
  product({
    name: "GPS Running Watch Pro",
    description:
      "Multi-band GPS running watch with advanced training metrics, breadcrumb navigation, and 14-day battery life.",
    price: 279,
    category: "Wearables",
    countInStock: 10,
    image: unsplash("1434493789847-2f02dc6ca35d"),
    rating: 4.7,
    reviewsCount: 540,
  }),
];

const accessories = [
  product({
    name: "RGB Mechanical Keyboard",
    description:
      "Tactile clicky mechanical keyboard with customizable RGB backlighting and premium aluminum build frame.",
    price: 129,
    category: "Accessories",
    countInStock: 20,
    image: unsplash("1587829741301-dc798b83add3"),
    rating: 4.7,
    reviewsCount: 2100,
  }),
  product({
    name: "Precision Gaming Mouse",
    description:
      "High-precision wireless gaming mouse with 20K DPI optical sensor and ultra-fast polling rate options.",
    price: 79,
    category: "Accessories",
    countInStock: 30,
    image: unsplash("1615663245857-ac93bb7c39e7"),
    rating: 4.8,
    reviewsCount: 3400,
  }),
  product({
    name: "Streaming 4K Webcam",
    description:
      "Ultra HD webcam for crystal-clear streaming, digital meetings, and autofocus support.",
    price: 99,
    category: "Accessories",
    countInStock: 16,
    image: unsplash("1603539947678-cd3954ed515d"),
    rating: 4.4,
    reviewsCount: 520,
  }),
  product({
    name: "Multiport USB-C Hub",
    description:
      "7-in-1 space gray aluminum USB-C hub adapter containing HDMI, USB-A ports, and memory card readers.",
    price: 59,
    category: "Accessories",
    countInStock: 40,
    image: unsplash("1558489080-2a075ec8039c"),
    rating: 4.5,
    reviewsCount: 780,
  }),
  product({
    name: "Ergonomic Vertical Mouse",
    description:
      "Wireless vertical mouse designed to reduce wrist strain with adjustable DPI presets and silent click switches.",
    price: 69,
    category: "Accessories",
    countInStock: 24,
    image: unsplash("1527864550417-7fd91fc51a46"),
    rating: 4.6,
    reviewsCount: 430,
  }),
  product({
    name: "Desk Ring Light Pro",
    description:
      "Adjustable 10-inch LED ring light with warm-to-cool color temperature control for streaming, calls, and content creation.",
    price: 89,
    category: "Accessories",
    countInStock: 19,
    image: unsplash("1598305038224-9a166f962e8c"),
    rating: 4.5,
    reviewsCount: 870,
  }),
  product({
    name: "Thunderbolt 4 Dock",
    description:
      "Desktop Thunderbolt 4 dock with dual 4K display support, 90W laptop charging, and front-facing USB-C fast access.",
    price: 189,
    category: "Accessories",
    countInStock: 11,
    image: unsplash("1625842268584-8f3296236761"),
    rating: 4.8,
    reviewsCount: 390,
  }),
  product({
    name: "Laptop Stand Aluminum",
    description:
      "Adjustable aluminum laptop stand with cable routing and improved airflow for long coding and design sessions.",
    price: 45,
    category: "Accessories",
    countInStock: 35,
    image: unsplash("1527864550417-7fd91fc51a46"),
    rating: 4.7,
    reviewsCount: 2100,
  }),
];

const storage = [
  product({
    name: "External SSD 1TB",
    description:
      "Portable high-speed solid state drive for backing up files, editing media, and transferring data fast.",
    price: 119,
    category: "Storage",
    countInStock: 10,
    image: unsplash("1531297484001-80022131f5a1"),
    rating: 4.8,
    reviewsCount: 940,
  }),
  product({
    name: "NVMe SSD 2TB",
    description:
      "High-throughput NVMe SSD designed for fast boot, rapid file transfers, and smooth creative workflows.",
    price: 159,
    category: "Storage",
    countInStock: 7,
    image: unsplash("1531297484001-80022131f5a1"),
    rating: 4.8,
    reviewsCount: 1100,
  }),
  product({
    name: "MicroSD Pro 512GB",
    description:
      "A2-rated 512GB microSD card built for 4K video capture, drone footage, and fast app storage on compatible devices.",
    price: 79,
    category: "Storage",
    countInStock: 28,
    image: unsplash("1614624532983-4ce03382d631"),
    rating: 4.6,
    reviewsCount: 1240,
  }),
  product({
    name: "NAS HDD Enclosure 2-Bay",
    description:
      "Two-bay USB 3.2 storage enclosure for home backups and media libraries with tool-free drive trays.",
    price: 99,
    category: "Storage",
    countInStock: 9,
    image: unsplash("1597872200969-2b65d7a2cd7c"),
    rating: 4.4,
    reviewsCount: 185,
  }),
];

const power = [
  product({
    name: "Fast Power Bank 20000mAh",
    description:
      "High capacity portable charger with dual USB-C output ports and 22.5W quick power delivery.",
    price: 49,
    category: "Power",
    countInStock: 22,
    image: unsplash("1610945265064-0e34e5519bbf"),
    rating: 4.6,
    reviewsCount: 1580,
  }),
  product({
    name: "Multi-device Charger 65W",
    description:
      "Compact wall adapter utilizing GaN technology to charge laptops, tablets, and phones simultaneously.",
    price: 39,
    category: "Power",
    countInStock: 26,
    image: unsplash("1610945265064-0e34e5519bbf"),
    rating: 4.7,
    reviewsCount: 620,
  }),
  product({
    name: "Multi Wireless Charging Stand",
    description:
      "Fast qi wireless charging base stand for smartphones, smartwatches, and wireless earbud cases.",
    price: 39,
    category: "Power",
    countInStock: 18,
    image: unsplash("1558618666-fcd25c85cd64"),
    rating: 4.5,
    reviewsCount: 890,
  }),
  product({
    name: "Solar Power Bank 30000mAh",
    description:
      "Rugged solar-ready power bank with 30000mAh capacity, LED flashlight, and dual USB-C PD outputs for travel.",
    price: 89,
    category: "Power",
    countInStock: 15,
    image: unsplash("1609091839311-d5365f9ff1c5"),
    rating: 4.5,
    reviewsCount: 970,
  }),
  product({
    name: "MagSafe Car Charger",
    description:
      "Vent-mounted magnetic car charger with 15W fast wireless charging and strong grip for bumpy commutes.",
    price: 34,
    category: "Power",
    countInStock: 32,
    image: unsplash("1591290619762-d2f69c4f4d08"),
    rating: 4.6,
    reviewsCount: 1520,
  }),
];

const displays = [
  product({
    name: 'Curved Gaming Monitor 27"',
    description:
      "27 inch curved display panel featuring 165Hz refresh rate and HDR gaming color precision profiles.",
    price: 349,
    category: "Displays",
    countInStock: 6,
    image: unsplash("1527443224154-c4a3942d3acf"),
    rating: 4.8,
    reviewsCount: 412,
  }),
  product({
    name: 'Portable 4K Monitor 15.6"',
    description:
      "Lightweight 15.6 inch portable 4K monitor for work-from-anywhere setups with crisp color and sharp text.",
    price: 219,
    category: "Displays",
    countInStock: 5,
    image: unsplash("1527443224154-c4a3942d3acf"),
    rating: 4.7,
    reviewsCount: 285,
  }),
  product({
    name: 'UltraWide Monitor 34"',
    description:
      "34-inch ultrawide QHD panel with 144Hz refresh, curved VA screen, and adaptive sync for immersive productivity and gaming.",
    price: 449,
    category: "Displays",
    countInStock: 4,
    image: unsplash("1547083327-19f3076e5e6e"),
    rating: 4.8,
    reviewsCount: 298,
  }),
  product({
    name: '4K Productivity Monitor 32"',
    description:
      "32-inch 4K IPS monitor with USB-C hub, 65W power delivery, and factory-calibrated color for design work.",
    price: 399,
    category: "Displays",
    countInStock: 7,
    image: unsplash("1527443224154-c4a3942d3acf"),
    rating: 4.9,
    reviewsCount: 445,
  }),
];

const vrAndTech = [
  product({
    name: "Aura VR Glass",
    description:
      "Immersive VR headset featuring dual 4K resolution screens, ultra-fast refresh rates, spatial sound, and smart spatial tracking controllers.",
    price: 499,
    category: "VR & Tech",
    countInStock: 8,
    image: unsplash("1593508512255-86ab42a8e620"),
    rating: 4.9,
    reviewsCount: 280,
  }),
  product({
    name: "Spatial Motion VR Controllers",
    description:
      "Ergonomic motion controllers optimized for VR tracking with haptic feedback and ultra-low latency pairing.",
    price: 179,
    category: "VR & Tech",
    countInStock: 9,
    image: unsplash("1593508512255-86ab42a8e620"),
    rating: 4.6,
    reviewsCount: 195,
  }),
  product({
    name: "VR Treadmill Sensor Kit",
    description:
      "Foot and hip tracking sensor kit that improves locomotion accuracy in compatible VR fitness and exploration apps.",
    price: 299,
    category: "VR & Tech",
    countInStock: 5,
    image: unsplash("1622979135225-d2c89ef5101b"),
    rating: 4.5,
    reviewsCount: 88,
  }),
  product({
    name: "Mixed Reality Developer Kit",
    description:
      "Developer-focused mixed reality headset kit with passthrough cameras, hand tracking, and SDK-ready calibration tools.",
    price: 599,
    category: "VR & Tech",
    countInStock: 3,
    image: unsplash("1592478411213-6153e4ebc696"),
    rating: 4.7,
    reviewsCount: 124,
  }),
];

const productTemplates = [
  ...audio,
  ...wearables,
  ...accessories,
  ...storage,
  ...power,
  ...displays,
  ...vrAndTech,
];

// --- Seed runner ---

const buildCategoryMap = (createdCategories) =>
  Object.fromEntries(createdCategories.map((cat) => [cat.name, cat._id]));

const attachCategoryIds = (templates, categoryMap) =>
  templates.map(({ category, ...product }) => ({
    ...product,
    category: categoryMap[category],
  }));

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    const categoryMap = buildCategoryMap(createdCategories);
    const products = attachCategoryIds(productTemplates, categoryMap);

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);
    console.log("Database seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedDatabase();
