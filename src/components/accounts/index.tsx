import React, { useState } from "react";
import Header from "../layout/Header";
import AccountsList from "./AccountsList";
import AccountDetails from "./AccountDetails";

const AccountsPage: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const handleBackToAccounts = () => {
    setSelectedAccountId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName="Jane Doe"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {selectedAccountId ? (
          <AccountDetails onBack={handleBackToAccounts} />
        ) : (
          <AccountsList onSelectAccount={handleSelectAccount} />
        )}
      </main>
    </div>
  );
};

export default AccountsPage;
