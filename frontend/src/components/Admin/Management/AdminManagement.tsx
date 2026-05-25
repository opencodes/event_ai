import React, { useState } from 'react';
import { MOCK_RESTAURANTS } from '../../../data';
import { Restaurant } from '../../../types';
import { RestaurantSearchBar } from './RestaurantSearchBar';
import { RestaurantTable } from './RestaurantTable';
import { AddRestaurantModal } from './AddRestaurantModal';

export const AdminManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({
    'rest-1': true,
    'rest-2': true,
    'rest-3': true,
    'rest-4': true,
    'rest-5': false,
  });

  const handleToggleStatus = (id: string) => {
    setStatusMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteStore = (id: string) => {
    if (confirm('Are you sure you want to pull this kitchen joint off Noida databases?')) {
      setRestaurants(restaurants.filter((r) => r.id !== id));
    }
  };

  const handleCreateRestaurant = (newRestData: Omit<Restaurant, 'id' | 'rating' | 'ratingCount' | 'distance' | 'featuredDishes' | 'menu'>) => {
    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: newRestData.name,
      cuisine: newRestData.cuisine,
      rating: 4.5,
      ratingCount: 1,
      deliveryTime: newRestData.deliveryTime,
      distance: 2.3,
      costForTwo: newRestData.costForTwo,
      image: newRestData.image,
      featuredDishes: ['Festival Feast Thali'],
      menu: [],
    };

    setRestaurants([...restaurants, newRest]);
    setStatusMap((prev) => ({ ...prev, [newRest.id]: true }));
    setShowAddModal(false);
    alert('Kitchen store registered and pushed into active Satvik approval grid pipeline.');
  };

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-management-tab">
      <RestaurantSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      <RestaurantTable
        restaurants={filtered}
        statusMap={statusMap}
        onToggleStatus={handleToggleStatus}
        onDeleteRestaurant={handleDeleteStore}
      />

      <AddRestaurantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateRestaurant}
      />
    </div>
  );
};
