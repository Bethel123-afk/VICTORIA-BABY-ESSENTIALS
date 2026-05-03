const products = [
    // CLOTHING & ESSENTIALS
    { name: 'Newborn Cotton Onesies (Pack of 3)', price: 4500, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 20, description: 'Soft, breathable 100% cotton onesies for everyday wear.' },
    { name: 'Warm Sleepsuits / Rompers (Pack of 2)', price: 6000, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 15, description: 'Cozy sleepsuits with easy snap buttons for night time.' },
    { name: 'Baby Mittens & Caps Set', price: 2000, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 30, description: 'Prevents scratching and keeps baby warm.' },
    { name: 'Thermal Socks (Pack of 5)', price: 2500, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 25, description: 'Soft socks to keep tiny feet warm.' },
    { name: 'Cotton Bibs (Pack of 3)', price: 2500, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 20, description: 'Absorbent bibs for feeding and drooling.' },
    { name: 'Receiving Blankets (Pack of 4)', price: 7000, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 15, description: 'Lightweight blankets for swaddling and comforting.' },
    { name: 'Thick Fleece Blanket', price: 8000, image: '/uploads/placeholder.jpg', category: 'Clothing', countInStock: 10, description: 'Heavy blanket for colder weather.' },

    // FEEDING
    { name: 'Anti-Colic Feeding Bottles (150ml)', price: 3500, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 30, description: 'Designed to reduce colic and discomfort.' },
    { name: 'Anti-Colic Feeding Bottles (250ml)', price: 4000, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 30, description: 'Larger bottles for growing appetites.' },
    { name: 'Electric Breast Pump', price: 25000, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 5, description: 'Efficient and pain-free milk extraction.' },
    { name: 'Manual Breast Pump', price: 8000, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 10, description: 'Portable and easy-to-use manual pump.' },
    { name: 'Formula Milk Dispenser', price: 2000, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 20, description: 'Multi-compartment container for formula on the go.' },
    { name: 'Bottle Sterilizer & Dryer', price: 28000, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 5, description: 'Kills 99.9% of germs using steam.' },
    { name: 'Bottle Cleaning Brush Set', price: 1500, image: '/uploads/placeholder.jpg', category: 'Feeding', countInStock: 25, description: 'Perfect for reaching all bottle corners safely.' },

    // DIAPERING
    { name: 'Premium Newborn Diapers (Size 1)', price: 6500, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 50, description: 'Highly absorbent with wetness indicator.' },
    { name: 'Premium Baby Diapers (Size 2)', price: 7000, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 50, description: 'Soft and comfortable for growing babies.' },
    { name: 'Fragrance-Free Baby Wipes (Pack of 3)', price: 4000, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 40, description: 'Gentle on sensitive skin.' },
    { name: 'Diaper Rash Cream', price: 3500, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 20, description: 'Soothes and protects against irritation.' },
    { name: 'Waterproof Changing Mat', price: 4000, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 15, description: 'Easy to wipe clean, perfect for travel.' },
    { name: 'Diaper Bag / Maternity Bag', price: 15000, image: '/uploads/placeholder.jpg', category: 'Diapering', countInStock: 10, description: 'Spacious bag with thermal compartments.' },

    // BATH & SKINCARE
    { name: 'Head-to-Toe Baby Wash', price: 4500, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 25, description: 'Tear-free formula for hair and body.' },
    { name: 'Nourishing Baby Lotion', price: 4500, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 25, description: 'Keeps baby skin hydrated for 24 hours.' },
    { name: 'Baby Massage Oil', price: 3000, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 20, description: 'Perfect for bonding and soothing baby.' },
    { name: 'Baby Powder (Talc-free)', price: 2500, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 20, description: 'Absorbs moisture and prevents chafing.' },
    { name: 'Hooded Baby Towel', price: 3500, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 15, description: 'Ultra-soft and highly absorbent.' },
    { name: 'Soft Washcloths (Pack of 6)', price: 2000, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 30, description: 'Gentle for face and body cleaning.' },
    { name: 'Baby Bathtub with Net', price: 12000, image: '/uploads/placeholder.jpg', category: 'Skincare', countInStock: 8, description: 'Safe and supportive for newborn bathing.' },

    // HEALTH & GROOMING
    { name: 'Baby Grooming Kit (Nail Clipper, Brush, Comb)', price: 3000, image: '/uploads/placeholder.jpg', category: 'Health', countInStock: 20, description: 'Essential tools for baby hygiene.' },
    { name: 'Digital Thermometer', price: 2500, image: '/uploads/placeholder.jpg', category: 'Health', countInStock: 15, description: 'Fast and accurate temperature reading.' },
    { name: 'Nasal Aspirator', price: 1500, image: '/uploads/placeholder.jpg', category: 'Health', countInStock: 25, description: 'Safely clears baby congestion.' },
    { name: 'Umbilical Cord Care Set (Spirit & Cotton)', price: 2000, image: '/uploads/placeholder.jpg', category: 'Health', countInStock: 40, description: 'Everything needed for cord care.' },
    { name: 'Teething Ring', price: 1500, image: '/uploads/placeholder.jpg', category: 'Health', countInStock: 30, description: 'Soothes sore gums during teething.' },

    // NURSERY & GEAR
    { name: 'Baby Cot with Mattress', price: 85000, image: '/uploads/placeholder.jpg', category: 'Nursery', countInStock: 2, description: 'Sturdy wooden cot for safe sleeping.' },
    { name: 'Mosquito Net (Cot size)', price: 5000, image: '/uploads/placeholder.jpg', category: 'Nursery', countInStock: 10, description: 'Protects baby from insects while sleeping.' },
    { name: 'Baby Carrier', price: 12000, image: '/uploads/placeholder.jpg', category: 'Nursery', countInStock: 10, description: 'Ergonomic design for comfortable carrying.' },
    { name: 'Playmat / Gym', price: 15000, image: '/uploads/placeholder.jpg', category: 'Nursery', countInStock: 5, description: 'Stimulating toys and safe floor play.' }
];

module.exports = products;
