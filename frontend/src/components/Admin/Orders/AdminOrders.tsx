import React, { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';
import { AssignRiderModal } from './AssignRiderModal';

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  items: string;
  amount: number;
  status: string;
  time: string;
  address: string;
  phone: string;
  partner?: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 'FED-9831', customer: 'Aishwarya Roy', restaurant: 'Kesaria Golden Sweets', items: 'Kaju Katli (250g) x2', amount: 560, status: 'Pending', time: 'Just now', address: 'A-102 Parsvnath sector 50, Noida', phone: '+91 91002 02120' },
    { id: 'FED-9830', customer: 'Virat Kohli', restaurant: 'Mehfil Royal Biryani', items: 'Saffron Veg Dum Biryani x1', amount: 299, status: 'Preparing', time: '4 mins ago', address: 'C-55 Kings Court, sector 26 Noida', phone: '+91 99991 18182', partner: 'Rahul Kumar' },
    { id: 'FED-9829', customer: 'Rohit Sharma', restaurant: 'Saffron Grand Thali & Rasoi', items: 'Shahi Diwali Festival Thali x2', amount: 900, status: 'Out for Delivery', time: '12 mins ago', address: 'Plot 4, MI Complex sector 56, Noida', phone: '+91 98111 26260', partner: 'Simran Singh' },
    { id: 'FED-9828', customer: 'Ananya Panday', restaurant: 'Chaat Street Bazaar', items: 'Katori Chaat x3, Samosa Plate x1', amount: 460, status: 'Delivered', time: '25 mins ago', address: 'B-14 sector 15, Noida', phone: '+91 95050 40402', partner: 'Jaspreet Gill' },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRiderModal, setShowRiderModal] = useState<string | null>(null);

  const ridersList = ['Ramesh Srivastav', 'Kuldeep Yadav', 'Gaurav Yadav', 'Pawan Kalyan', 'Deepak Hooda'];
  const kanbanStages = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  const handleStageAdvance = (orderId: string, currentStatus: string) => {
    const idx = kanbanStages.indexOf(currentStatus);
    if (idx < kanbanStages.length - 1) {
      const nextStatus = kanbanStages[idx + 1];
      const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
      setOrders(updatedOrders);
      
      // Update selected drawer if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: nextStatus });
      }
    }
  };

  const handleAssignRider = (orderId: string, rider: string) => {
    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, partner: rider } : o));
    setOrders(updatedOrders);
    setShowRiderModal(null);

    // Update selected drawer if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, partner: rider });
    }
    alert(`Success! Satvik rider ${rider} assigned on high priority to order ${orderId}.`);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-orders-tab">
      <KanbanBoard
        orders={orders}
        stages={kanbanStages}
        onSelectOrder={setSelectedOrder}
        onAdvanceStage={handleStageAdvance}
        onOpenRiderModal={setShowRiderModal}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvanceStage={handleStageAdvance}
      />

      <AssignRiderModal
        orderId={showRiderModal}
        onClose={() => setShowRiderModal(null)}
        ridersList={ridersList}
        onAssignRider={handleAssignRider}
      />
    </div>
  );
};
