export interface User {
  id: string;
  email: string;
  points: number;
  isAdmin: boolean;
}

export interface Item {
  id: string;
  userEmail: string;
  title: string;
  description: string;
  category: 'Tops' | 'Bottoms' | 'Dresses' | 'Accessories' | 'Shoes' | 'Outerwear';
  type: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  tags: string[];
  status: 'pending' | 'approved' | 'unavailable';
  images: string[];
  createdAt: string;
}

export interface Swap {
  id: string;
  itemId: string;
  itemOwnerEmail: string;
  requesterEmail: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface ItemFormData {
  title: string;
  description: string;
  category: Item['category'];
  type: string;
  size: string;
  condition: Item['condition'];
  tags: string[];
  images: File[];
}