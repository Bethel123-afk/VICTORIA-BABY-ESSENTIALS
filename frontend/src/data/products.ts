export interface StaticProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    badge: string;
    category: string;
    shortDesc: string;
}

export const products: StaticProduct[] = [
    {
        id: 'onesie',
        name: 'Premium Cotton Onesie',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=800&q=80',
        badge: 'Essential Foundation',
        category: 'Essential',
        shortDesc: 'Breathable, organic fibers for neonatal skin integrity.',
    },
    {
        id: 'blanket',
        name: 'Thermal Fleece Blanket',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80',
        badge: 'Climate Control',
        category: 'Essential',
        shortDesc: 'Engineered cellular fleece for optimal thermal regulation.',
    },
    {
        id: 'socks',
        name: 'Thermal Socks (Set of 5)',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
        badge: 'Foundation',
        category: 'Essential',
        shortDesc: 'Breathable, heat-retentive socks for peripheral warmth.',
    },
    {
        id: 'diapers',
        name: 'Premium Diaper Suite',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=800&q=80',
        badge: 'Essential Foundation',
        category: 'Essential',
        shortDesc: 'High-absorbency fibers for sustained neonatal dryness.',
    },
    {
        id: 'swaddle',
        name: 'Muslin Swaddle Set (x3)',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1604176427245-df2f5458931b?auto=format&fit=crop&w=800&q=80',
        badge: 'Comfort Weave',
        category: 'Essential',
        shortDesc: '100% organic muslin for secure, breathable comfort.',
    },
    {
        id: 'bottle',
        name: 'Anti-Colic Solution Bottle',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
        badge: 'Nutritional Intake',
        category: 'Feeding',
        shortDesc: 'Clinically designed to reduce neonatal air intake.',
    },
    {
        id: 'sterilizer',
        name: 'UV Sterilizer & Dryer',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1627993434193-de5a42f56636?auto=format&fit=crop&w=800&q=80',
        badge: 'Hygiene Protocol',
        category: 'Feeding',
        shortDesc: 'Eliminates 99.9% of germs with medical-grade UV light.',
    },
    {
        id: 'skincare',
        name: 'Biological Care Suite',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
        badge: 'Biological Support',
        category: 'Skincare',
        shortDesc: 'pH balanced for fragile biological barriers.',
    },
    {
        id: 'baby-oil',
        name: 'Organic Calendula Oil',
        price: 4200,
        image: 'https://images.unsplash.com/photo-1570172619644-dfa3337b85e8?auto=format&fit=crop&w=800&q=80',
        badge: 'Hydration',
        category: 'Skincare',
        shortDesc: 'Pure, cold-pressed oil for massage and moisture lock.',
    },
    {
        id: 'thermometer',
        name: 'Digital Precision Thermometer',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=800&q=80',
        badge: 'Clinical Observation',
        category: 'Health',
        shortDesc: 'Rapid, clinical-grade temperature intelligence.',
    },
    {
        id: 'antiseptic',
        name: 'Essential Care Kit',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        badge: 'Antiseptic',
        category: 'Health',
        shortDesc: 'Medical-grade solution for umbilical care.',
    },
    {
        id: 'mini-collection',
        name: 'Starter Package',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        badge: 'Essential Starter Kit',
        category: 'Collection',
        shortDesc: 'Hospital discharge & first 2 weeks. Vetted essentials.',
    },
    {
        id: 'medium-collection',
        name: 'Standard Package',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80',
        badge: 'Signature Monthly Kit',
        category: 'Collection',
        shortDesc: 'Complete daily care for the first 30 days of life.',
    },
    {
        id: 'mega-collection',
        name: 'Elite Package',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        badge: 'Premium All-in-One Kit',
        category: 'Collection',
        shortDesc: 'Ready-for-anything 3-month elite package.',
    }
];
