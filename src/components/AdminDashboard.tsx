
import React, { useState } from 'react';
import { Search, Calendar, Download, Eye, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Report, MOCK_REPORTS } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  
  const filteredReports = reports.filter(report => 
    report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (report.location.address && report.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting CSV...');
    alert('Reports exported to CSV');
  };
  
  const handleViewDetails = (report: Report) => {
    // In a real app, this would open a modal or navigate to a details page
    console.log('View details:', report);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>View and manage field work reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, purpose, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="group">
                    <TableCell className="font-medium">{report.userName}</TableCell>
                    <TableCell>{report.purpose}</TableCell>
                    <TableCell>{formatDate(report.timeOut)}</TableCell>
                    <TableCell>{formatDate(report.timeIn)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 max-w-[180px] truncate">
                        <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{report.location.address || "No address"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                        className="gap-1 invisible group-hover:visible"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboard;
