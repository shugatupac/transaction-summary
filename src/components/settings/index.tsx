import React from "react";
import Header from "../layout/Header";
import ProfileSettings from "./ProfileSettings";

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName="Jane Doe"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <ProfileSettings />
      </main>
    </div>
  );
};

export default SettingsPage;
