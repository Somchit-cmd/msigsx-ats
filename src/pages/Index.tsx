
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Index = () => {
  const cards = [
    {
      title: "Submit Work Report",
      description: "Record details of your field work when outside the office",
      icon: FileText,
      path: "/report",
      buttonText: "Create Report"
    },
    {
      title: "View Analytics",
      description: "Analyze field work patterns and optimize resources",
      icon: BarChart,
      path: "/analytics",
      buttonText: "View Analytics"
    }
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center animate-slide-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">Admin Officer Tracker</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Track Outside Work Activities</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple way to record and manage field activities for administrative officers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {cards.map((card, index) => (
            <Card key={index} className="overflow-hidden border transition-all duration-300 hover:shadow-md animate-slide-in opacity-0" style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'forwards' }}>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="gap-2 w-full sm:w-auto">
                  <Link to={card.path}>
                    {card.buttonText}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
