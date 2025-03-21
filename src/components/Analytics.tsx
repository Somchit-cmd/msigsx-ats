
import React from 'react';
import { Calendar, Users, Car, Clock, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MOCK_REPORTS } from '@/types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Simulate analytics data
const vehicleData = [
  { name: 'Personal Car', value: 8 },
  { name: 'Company Vehicle', value: 12 },
  { name: 'Public Transport', value: 5 },
  { name: 'Taxi', value: 3 },
  { name: 'Walking', value: 2 },
];

const timeData = [
  { day: 'Mon', hours: 24 },
  { day: 'Tue', hours: 18 },
  { day: 'Wed', hours: 32 },
  { day: 'Thu', hours: 26 },
  { day: 'Fri', hours: 22 },
];

const purposeData = [
  { month: 'Jan', 'Client Meetings': 20, 'Site Visits': 12, 'Training': 8 },
  { month: 'Feb', 'Client Meetings': 25, 'Site Visits': 15, 'Training': 10 },
  { month: 'Mar', 'Client Meetings': 18, 'Site Visits': 20, 'Training': 5 },
  { month: 'Apr', 'Client Meetings': 22, 'Site Visits': 18, 'Training': 12 },
  { month: 'May', 'Client Meetings': 30, 'Site Visits': 10, 'Training': 15 },
  { month: 'Jun', 'Client Meetings': 28, 'Site Visits': 22, 'Training': 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  // Calculate some statistics from the mock data
  const totalReports = MOCK_REPORTS.length;
  const uniqueUsers = new Set(MOCK_REPORTS.map(r => r.userName)).size;
  const averageTimeOut = Math.round(MOCK_REPORTS.reduce((acc, report) => {
    const timeOut = new Date(report.timeOut);
    const timeIn = new Date(report.timeIn);
    const hours = (timeIn.getTime() - timeOut.getTime()) / (1000 * 60 * 60);
    return acc + hours;
  }, 0) / totalReports * 10) / 10; // Round to 1 decimal place

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{Math.floor(Math.random() * 10) + 1}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active field workers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Usage</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(MOCK_REPORTS.filter(r => r.vehicle === 'Personal Car').length / totalReports * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Personal vehicles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time Out</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTimeOut} hrs</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per field visit
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Purpose Trends</CardTitle>
            <CardDescription>
              Monthly breakdown of visit purposes
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={purposeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="Client Meetings" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Site Visits" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Training" 
                    stroke="#FFBB28" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vehicle Distribution</CardTitle>
            <CardDescription>
              Types of vehicles used for field work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours Outside Office</CardTitle>
          <CardDescription>
            Total hours spent on field work per day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, 'Time Spent']}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
