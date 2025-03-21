
import React from 'react';
import Layout from '@/components/Layout';
import AnalyticsComponent from '@/components/Analytics';

const Analytics = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <AnalyticsComponent />
      </div>
    </Layout>
  );
};

export default Analytics;
