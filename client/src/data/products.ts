export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  color: string;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 'linen-jacket',
    name: 'Linen Field Jacket',
    category: 'Outerwear',
    price: 128,
    rating: 4.8,
    color: 'Sage',
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
    description:
      'A breathable everyday layer with structured pockets, soft lining, and a relaxed cut for travel or city errands.',
  },
  {
    id: 'canvas-tote',
    name: 'Market Canvas Tote',
    category: 'Bags',
    price: 54,
    rating: 4.7,
    color: 'Natural',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    description:
      'Heavy canvas, reinforced handles, and enough room for a laptop, groceries, and the small things that disappear in shallow bags.',
  },
  {
    id: 'ceramic-mug',
    name: 'Stoneware Coffee Mug',
    category: 'Home',
    price: 32,
    rating: 4.9,
    color: 'Clay',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    description:
      'Hand-finished stoneware with a wide handle, satin glaze, and enough weight to feel steady on a busy desk.',
  },
  {
    id: 'desk-lamp',
    name: 'Adjustable Desk Lamp',
    category: 'Workspace',
    price: 86,
    rating: 4.6,
    color: 'Graphite',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    description:
      'A compact metal lamp with a warm diffuser, stable base, and smooth hinge movement for reading or focused work.',
  },
  {
    id: 'wool-throw',
    name: 'Wool Blend Throw',
    category: 'Home',
    price: 74,
    rating: 4.8,
    color: 'Oat',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    description:
      'Soft, warm, and tightly woven with a subtle texture that works on a sofa, chair, or end of bed.',
  },
  {
    id: 'leather-wallet',
    name: 'Slim Leather Wallet',
    category: 'Accessories',
    price: 48,
    rating: 4.5,
    color: 'Chestnut',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    description:
      'A compact card wallet made for front-pocket carry with four slots, a folded cash sleeve, and smooth edges.',
  },
];
