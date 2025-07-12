import { useState, useEffect } from 'react';
import { Item, ItemFormData } from '@/types';
import featuredItem1 from '@/assets/featured-item-1.jpg';
import featuredItem2 from '@/assets/featured-item-2.jpg';
import featuredItem3 from '@/assets/featured-item-3.jpg';

const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    userEmail: 'user@rewear.com',
    title: 'Vintage Denim Jacket',
    description: 'Beautiful vintage denim jacket in excellent condition. Perfect for layering and adding a retro touch to any outfit.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Good',
    tags: ['vintage', 'denim', 'casual', 'retro'],
    status: 'approved',
    images: [featuredItem1],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userEmail: 'user@rewear.com',
    title: 'Elegant Evening Dress',
    description: 'Stunning evening dress perfect for special occasions. Made from sustainable materials and barely worn.',
    category: 'Dresses',
    type: 'Evening Dress',
    size: 'S',
    condition: 'Like New',
    tags: ['elegant', 'evening', 'sustainable', 'formal'],
    status: 'approved',
    images: [featuredItem2],
    createdAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    userEmail: 'admin@rewear.com',
    title: 'Eco-Friendly Hoodie',
    description: 'Comfortable hoodie made from organic cotton. Great for casual wear and environmentally conscious fashion.',
    category: 'Tops',
    type: 'Hoodie',
    size: 'L',
    condition: 'New',
    tags: ['organic', 'cotton', 'casual', 'eco-friendly'],
    status: 'approved',
    images: [featuredItem3],
    createdAt: '2024-01-17T09:15:00Z',
  },
];

export const useItems = () => {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  const getFeaturedItems = () => {
    return items.filter(item => item.status === 'approved').slice(0, 3);
  };

  const getApprovedItems = () => {
    return items.filter(item => item.status === 'approved');
  };

  const getPendingItems = () => {
    return items.filter(item => item.status === 'pending');
  };

  const getUserItems = (userEmail: string) => {
    return items.filter(item => item.userEmail === userEmail);
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const addItem = async (itemData: ItemFormData, userEmail: string): Promise<boolean> => {
    setIsLoading(true);
    
  
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
   
      const imageUrls = itemData.images.map((file, index) => {
       
        const placeholders = [featuredItem1, featuredItem2, featuredItem3];
        return placeholders[index % placeholders.length];
      });

      const newItem: Item = {
        id: Date.now().toString(),
        userEmail,
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        type: itemData.type,
        size: itemData.size,
        condition: itemData.condition,
        tags: itemData.tags,
        status: 'pending', 
        images: imageUrls.length > 0 ? imageUrls : [featuredItem1],
        createdAt: new Date().toISOString(),
      };

      setItems(prev => [...prev, newItem]);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const approveItem = async (itemId: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'approved' as const } : item
      )
    );
    
    setIsLoading(false);
    return true;
  };

  const rejectItem = async (itemId: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prev => prev.filter(item => item.id !== itemId));
    
    setIsLoading(false);
    return true;
  };

  const updateItemStatus = async (itemId: string, status: Item['status']): Promise<boolean> => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
    return true;
  };

  return {
    items,
    isLoading,
    getFeaturedItems,
    getApprovedItems,
    getPendingItems,
    getUserItems,
    getItemById,
    addItem,
    approveItem,
    rejectItem,
    updateItemStatus,
  };
};
