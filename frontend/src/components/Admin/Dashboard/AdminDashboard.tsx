import React, { useState } from 'react';
import { MOCK_ADMIN_STATS } from '../../../data';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { DiwaliAnalyticsChart } from './DiwaliAnalyticsChart';
import { TopSellingCategories } from './TopSellingCategories';
import { RecentOrdersTable } from './RecentOrdersTable';
import { QuickActionsPanel } from './QuickActionsPanel';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const stats = MOCK_ADMIN_STATS;
  const [activeSegment, setActiveSegment] = useState<'revenue' | 'orders'>('revenue');

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-dashboard-tab">
      {/* 1. KEY STATS CARDS GRID */}
      <DashboardStatsGrid stats={stats} />

      {/* 2. SALES CHANNELS GRAPH & CATEGORIES SALES */}
      <div className="grid lg:grid-cols-3 gap-6" id="charts-layout">
        <DiwaliAnalyticsChart
          revenueTrend={stats.revenueTrend}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />
        <TopSellingCategories categorySales={stats.categorySales} />
      </div>

      {/* 3. RECENT ORDERS TABLE & ACTIONS */}
      <div className="grid lg:grid-cols-4 gap-6" id="dashboard-bottom-grid">
        <RecentOrdersTable recentOrders={stats.recentOrders} onNavigateTab={onNavigateTab} />
        <QuickActionsPanel onNavigateTab={onNavigateTab} />
      </div>
    </div>
  );
};
