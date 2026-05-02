const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const products = [
    {
        name: 'Premium Cotton Onesie',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=800&q=80',
        category: 'Essential',
        countInStock: 20,
        description: 'Breathable, organic fibers for neonatal skin integrity. Essential Foundation.',
    },
    {
        name: 'Thermal Fleece Blanket',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80',
        category: 'Essential',
        countInStock: 15,
        description: 'Engineered cellular fleece for optimal thermal regulation. Climate Control.',
    },
    {
        name: 'Thermal Socks (Set of 5)',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
        category: 'Essential',
        countInStock: 50,
        description: 'Breathable, heat-retentive socks for peripheral warmth. Foundation.',
    },
    {
        name: 'Premium Diaper Suite',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=800&q=80',
        category: 'Essential',
        countInStock: 10,
        description: 'High-absorbency fibers for sustained neonatal dryness. Essential Foundation.',
    },
    {
        name: 'Anti-Colic Solution Bottle',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
        category: 'Feeding',
        countInStock: 30,
        description: 'Clinically designed to reduce neonatal air intake. Nutritional Intake.',
    },
    {
        name: 'UV Sterilizer & Dryer',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1627993434193-de5a42f56636?auto=format&fit=crop&w=800&q=80',
        category: 'Feeding',
        countInStock: 5,
        description: 'Eliminates 99.9% of germs with medical-grade UV light. Hygiene Protocol.',
    },
    {
        name: 'Biological Care Suite',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
        category: 'Skincare',
        countInStock: 12,
        description: 'pH balanced for fragile biological barriers. Biological Support.',
    },
    {
        name: 'Elite Package',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        category: 'Collection',
        countInStock: 3,
        description: 'Ready-for-anything 3-month elite package. Premium All-in-One Kit.',
    }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
