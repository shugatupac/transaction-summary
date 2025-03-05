import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./layout/Header";
import AccountCards from "./dashboard/AccountCards";
import MonthlySummary from "./dashboard/MonthlySummary";
import TransactionList from "./dashboard/TransactionList";
import BudgetTracker from "./dashboard/BudgetTracker";
import NotificationCenter from "./dashboard/NotificationCenter";

const Home: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("May 2023");

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNotificationClick={handleNotificationClick}
        userName="Jane Doe"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <AccountCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <MonthlySummary
              currentMonth={selectedMonth}
              onMonthChange={handleMonthChange}
            />
            <TransactionList />
          </div>

          <div className="space-y-8">
            <BudgetTracker month={selectedMonth} />

            <div className="lg:block">
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-50 lg:relative lg:bg-transparent lg:z-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                  >
                    <motion.div
                      className="absolute right-0 top-0 h-full w-[350px] lg:static lg:h-auto lg:w-full"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <NotificationCenter
                        isOpen={true}
                        onClose={() => setShowNotifications(false)}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showNotifications && (
                <div className="hidden lg:block">
                  <NotificationCenter />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
