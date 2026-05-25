import React from 'react';
import { Truck, ChevronRight } from 'lucide-react';

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

interface KanbanBoardProps {
  orders: Order[];
  stages: string[];
  onSelectOrder: (order: Order) => void;
  onAdvanceStage: (id: string, currentStatus: string) => void;
  onOpenRiderModal: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  orders,
  stages,
  onSelectOrder,
  onAdvanceStage,
  onOpenRiderModal,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" id="orders-kanban-board">
      {stages.map((stage) => {
        const stageOrders = orders.filter((o) => o.status === stage);
        return (
          <div key={stage} className="bg-stone-50 dark:bg-stone-900 border border-stone-200/55 dark:border-stone-800 p-4 rounded-2xl flex flex-col min-h-[480px]">
            {/* Kanban column heading */}
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-850 mb-4 shrink-0 text-left">
              <span className="text-xs font-black uppercase text-stone-900 dark:text-stone-300 font-mono tracking-wider">
                {stage}
              </span>
              <span className="w-5 h-5 bg-orange-600 font-bold text-xs text-white rounded-full flex items-center justify-center">
                {stageOrders.length}
              </span>
            </div>

            {/* Loop inside column */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px]">
              {stageOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 hover:border-orange-200 dark:hover:border-stone-700 shadow-sm cursor-pointer space-y-3 text-left transition-all duration-200"
                >
                  <div className="flex justify-between items-start" onClick={() => onSelectOrder(ord)}>
                    <div>
                      <span className="text-[10px] font-bold font-mono text-orange-600 uppercase">
                        {ord.id}
                      </span>
                      <h4 className="font-extrabold text-sm text-stone-900 dark:text-white mt-0.5">
                        {ord.customer}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">{ord.restaurant}</p>
                    </div>
                    <span className="font-bold text-xs text-stone-850 dark:text-stone-100 shrink-0">
                      ₹{ord.amount}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-1">{ord.items}</p>

                  {/* Rider panel display */}
                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-stone-105 dark:border-stone-800 pt-2.5">
                    <div className="flex items-center gap-1 text-stone-500">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{ord.partner ? ord.partner : 'Unassigned Rider'}</span>
                    </div>

                    {stage !== 'Delivered' && (
                      <div className="flex gap-1.5 shrink-0">
                        {!ord.partner && (
                          <button
                            onClick={() => onOpenRiderModal(ord.id)}
                            className="text-[9px] bg-orange-50 hover:bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold uppercase transition cursor-pointer"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => onAdvanceStage(ord.id, ord.status)}
                          className="text-[9px] bg-green-50 hover:bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase transition flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {stageOrders.length === 0 && (
                <div className="h-40 border border-dashed border-stone-250 dark:border-stone-800 rounded-xl flex items-center justify-center text-xs text-stone-400">
                  No active orders
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
