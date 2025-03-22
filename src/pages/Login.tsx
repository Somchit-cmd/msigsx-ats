
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { employeeLogin, currentUser } = useSupabase();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !password) {
      toast.error('Please enter both employee ID and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await employeeLogin(employeeId, password);
      navigate('/');
    } catch (error) {
      // Error is already handled in the context with toast
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/6ae9b495-93d8-4206-b2c6-726deb8ff764.png" 
              alt="Admin Tracker Logo" 
              className="w-auto h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Tracker</CardTitle>
          <CardDescription>Enter your employee ID and password to sign in</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
