
import React from 'react';
import Layout from '@/components/Layout';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default Admin;
