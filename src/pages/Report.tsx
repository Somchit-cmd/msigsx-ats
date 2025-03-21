
import React from 'react';
import Layout from '@/components/Layout';
import ReportForm from '@/components/ReportForm';

const Report = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Work Report</h1>
          <p className="text-muted-foreground">
            Record your activities when working outside the office
          </p>
        </div>
        
        <div className="animate-fade-in">
          <ReportForm />
        </div>
      </div>
    </Layout>
  );
};

export default Report;
