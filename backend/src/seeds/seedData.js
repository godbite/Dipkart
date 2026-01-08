require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { User, Category, Product, Cart, Order } = require('../models');

// Mapping DummyJSON categories to our categories
const categoryMapping = {
  'smartphones': 'Mobiles',
  'laptops': 'Electronics',
  'fragrances': 'Beauty',
  'skincare': 'Beauty',
  'groceries': 'Grocery',
  'home-decoration': 'Home & Furniture',
  'furniture': 'Home & Furniture',
  'tops': 'Fashion',
  'womens-dresses': 'Fashion',
  'womens-shoes': 'Fashion',
  'mens-shirts': 'Fashion',
  'mens-shoes': 'Fashion',
  'mens-watches': 'Electronics',
  'womens-watches': 'Electronics',
  'womens-bags': 'Fashion',
  'jewellery': 'Beauty',
  'sunglasses': 'Fashion',
  'automotive': 'Two Wheelers',
  'motorcycle': 'Two Wheelers',
  'lighting': 'Home & Furniture'
};

const categoryImages = {
  'Electronics': 'https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png',
  'Mobiles': 'https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png',
  'Fashion': 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png',
  'Home & Furniture': 'https://rukminim2.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg',
  'Appliances': 'https://rukminim2.flixcart.com/flap/80/80/image/0ff199d1bd27eb98.png',
  'Grocery': 'https://rukminim2.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png'
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    // Create default user
    console.log('Creating default user...');
    await User.create({
      name: 'Default User',
      email: 'default@flipkart.com',
      phone: '9876543210',
      addresses: [
        {
          fullName: 'Default User',
          phone: '9876543210',
          addressLine1: '123 Main Street',
          addressLine2: 'Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }
      ]
    });

    // Fetch data from DummyJSON
    console.log('Fetching data from DummyJSON...');
    // Fetch all products (DummyJSON has ~194 products now)
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    const fetchedProducts = data.products;

    const categoryDocsMap = {}; // Maps our category name to doc _id

    // Categories data
    const categoriesData = [
      {
        name: 'Mobiles',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png',
      },
      {
        name: 'Electronics',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png',
      },
      {
        name: 'Fashion',
        image: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png',
      },
      {
        name: 'Home & Furniture',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg',
      },
      {
        name: 'Appliances',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/0ff199d1bd27eb98.png',
      },
      {
        name: 'Grocery',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png',
      },
      {
        name: 'Beauty',
        image: 'https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png',
      },
      {
        name: 'Toys',
        image: 'https://cdn-icons-png.flaticon.com/512/3737/3737372.png', 
      }
    ];

    // Create Categories in DB
    console.log(`Creating ${categoriesData.length} categories...`);
    for (const cat of categoriesData) {
      const slug = cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      const category = await Category.create({
        name: cat.name,
        slug: slug,
        image: cat.image,
        description: `Everything in ${cat.name}`
      });
      categoryDocsMap[cat.name] = category._id;
    }

    // Process and Create Products
    console.log('Processing and creating products...');
    let successCount = 0;
    
    // Helper to map more DummyJSON categories if they appear in the expanded list
    // Updates to mapping for better coverage:
    // 'kitchen-accessories' -> 'Appliances' or 'Home & Furniture' (DummyJSON has kitchen-accessories)
    // 'sports-accessories' -> 'Toys' (maybe? or Fashion) -> Let's map 'sports-accessories' to 'Toys' to fill it? Or 'Fashion'.
    // 'mobile-accessories' -> 'Mobiles' or 'Electronics'
    
    // Dynamic mapping extension during loop if needed? No, stick to static.
    
    for (const p of fetchedProducts) {
      try {
        let targetCatName = categoryMapping[p.category];
        
        // Extended fallback logic for new categories in bigger dataset
        if (!targetCatName) {
           if (p.category.includes('shirt') || p.category.includes('shoes') || p.category.includes('dress') || p.category.includes('bag')) targetCatName = 'Fashion';
           else if (p.category.includes('watch') || p.category.includes('decoration')) targetCatName = 'Home & Furniture'; // watches -> Electronics usually, but decoration -> Home
           else if (p.category === 'kitchen-accessories') targetCatName = 'Appliances';
           else if (p.category === 'sports-accessories') targetCatName = 'Toys'; // Approximate
           else if (p.category === 'tablets') targetCatName = 'Mobiles';
           else targetCatName = 'Electronics';
        }
        
        // Special case: Map some specific brands/items to Toys if they look like toys?
        // Hard to distinguish.
        
        // Check manually defined mappings from before
        // ... (We rely on categoryMapping at top of file, but I should update that too if I can)
        
        const categoryId = categoryDocsMap[targetCatName];
        
        // Ensure numeric values
        let price = Number(p.price) || 0;
        let discountPct = Number(p.discountPercentage) || 0;
        
        // Convert to approx INR (83 rate)
        const sellingPriceINR = Math.round(price * 83);
        const mrpINR = Math.round(sellingPriceINR / (1 - (discountPct / 100))) || sellingPriceINR;

        const productData = {
          name: p.title,
          slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000), 
          description: p.description,
          category: categoryId,
          brand: p.brand || 'Generic',
          price: mrpINR,
          sellingPrice: sellingPriceINR,
          discount: Math.round(discountPct),
          images: p.images || [],
          thumbnail: p.thumbnail || p.images[0],
          stock: p.stock || 0,
          isAvailable: (p.stock || 0) > 0,
          specifications: [
            { key: 'Brand', value: p.brand || 'Generic' },
            { key: 'Category', value: p.category }, // Original DummyJSON category
            { key: 'Rating', value: `${p.rating} / 5` }
          ],
          highlights: [
            `${p.brand || 'Generic'} Brand Product`,
            `Rated ${p.rating || 0} stars`,
            'High quality materials',
            'Warranty available'
          ],
          rating: {
            average: Number(p.rating) || 0,
            count: Math.floor(Math.random() * 5000) + 50
          },
          tags: p.tags || [p.category]
        };

        await Product.create(productData);
        successCount++;
      } catch (err) {
        console.warn(`Skipping product "${p.title}": ${err.message}`);
      }
    }
    
    console.log(`Successfully created ${successCount} products from DummyJSON`);

    console.log('\n✅ Database seeded successfully with real data!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
