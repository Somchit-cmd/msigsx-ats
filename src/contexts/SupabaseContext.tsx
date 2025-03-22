
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, TABLES, ROLES } from '@/lib/supabase';
import { Report, ReportFormData, Location, UserRole } from '@/types';
import { toast } from "sonner";

interface UserData {
  id: string;
  employee_id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface SupabaseContextProps {
  // Auth
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: UserRole | null;
  userData: UserData | null;
  employeeLogin: (employeeId: string, password: string) => Promise<void>;
  createEmployee: (employeeId: string, name: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Reports
  submitReport: (reportData: ReportFormData) => Promise<void>;
  getReports: () => Promise<Report[]>;
  getReportsByUser: (userName: string) => Promise<Report[]>;
  getReportsByDateRange: (startDate: Date, endDate: Date) => Promise<Report[]>;
  
  // Image Upload
  uploadImage: (file: File, path: string) => Promise<string>;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user || null);
        
        if (session?.user) {
          // Get user data including role from Supabase
          try {
            const { data, error } = await supabase
              .from(TABLES.USERS)
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user data:", error);
              setUserRole('user'); // Default role if error
            } else if (data) {
              setUserData(data as UserData);
              setUserRole(data.role);
            } else {
              setUserRole('user'); // Default role if not specified
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUserRole('user'); // Default role if error
          }
        } else {
          setUserRole(null);
          setUserData(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCurrentUser(session?.user || null);
      
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user data:", error);
            setUserRole('user'); // Default role if error
          } else if (data) {
            setUserData(data as UserData);
            setUserRole(data.role);
          } else {
            setUserRole('user'); // Default role if not specified
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole('user'); // Default role if error
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Employee ID login
  const employeeLogin = async (employeeId: string, password: string) => {
    try {
      // Query Supabase to find the user with the given employee ID
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('email')
        .eq('employee_id', employeeId)
        .single();
      
      if (error || !data) {
        throw new Error("Employee ID not found");
      }
      
      if (!data.email) {
        throw new Error("Employee account is not properly configured");
      }
      
      // Login with email/password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      toast.success("Login successful");
    } catch (error: any) {
      console.error('Error logging in with employee ID:', error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  // Create employee account (admin only)
  const createEmployee = async (
    employeeId: string,
    name: string,
    password: string,
    role: UserRole
  ) => {
    try {
      // Check if employeeId already exists
      const { data: existingEmployee, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('employee_id', employeeId)
        .single();
      
      if (existingEmployee) {
        throw new Error("Employee ID already exists");
      }
      
      // Create a unique email address based on employee ID
      const email = `${employeeId.toLowerCase()}@admintracker.local`;
      
      // Create user with Supabase auth
      const { data: userData, error: createUserError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (createUserError || !userData.user) {
        throw new Error(createUserError?.message || "Failed to create user account");
      }
      
      // Create user document in Supabase database
      const { error: profileError } = await supabase
        .from(TABLES.USERS)
        .insert([{
          id: userData.user.id,
          employee_id: employeeId,
          name,
          email,
          role,
          created_at: new Date().toISOString()
        }]);
      
      if (profileError) {
        throw new Error(profileError.message);
      }
      
      toast.success("Employee account created successfully");
    } catch (error: any) {
      console.error('Error creating employee account:', error);
      toast.error(error.message || "Failed to create employee account");
      throw error;
    }
  };

  // Regular auth functions
  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create user profile
        await supabase
          .from(TABLES.USERS)
          .insert([{
            id: data.user.id,
            email,
            role: ROLES.USER,
            created_at: new Date().toISOString()
          }]);
      }
      
      toast.success("Account created successfully");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login successful");
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  };

  // Reports functions
  const submitReport = async (reportData: ReportFormData) => {
    try {
      // Upload photo first to get the URL
      let photoUrl = '';
      if (reportData.photo) {
        const path = `reports/${Date.now()}_${reportData.photo.name}`;
        photoUrl = await uploadImage(reportData.photo, path);
      }

      // Add report to Supabase
      const { error } = await supabase
        .from(TABLES.REPORTS)
        .insert([{
          user_name: reportData.userName,
          user_id: currentUser?.id || '',
          purpose: reportData.purpose,
          time_out: reportData.timeOut,
          time_in: reportData.timeIn,
          vehicle: reportData.vehicle,
          photo_url: photoUrl,
          location: reportData.location,
          notes: reportData.notes || '',
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        throw error;
      }
      
      toast.success("Report submitted successfully");
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || "Failed to submit report");
      throw error;
    }
  };

  const getReports = async (): Promise<Report[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.REPORTS)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        userName: item.user_name,
        purpose: item.purpose,
        timeOut: item.time_out,
        timeIn: item.time_in,
        vehicle: item.vehicle,
        photoUrl: item.photo_url,
        location: item.location,
        notes: item.notes,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  };

  const getReportsByUser = async (userName: string): Promise<Report[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.REPORTS)
        .select('*')
        .eq('user_name', userName)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        userName: item.user_name,
        purpose: item.purpose,
        timeOut: item.time_out,
        timeIn: item.time_in,
        vehicle: item.vehicle,
        photoUrl: item.photo_url,
        location: item.location,
        notes: item.notes,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting reports by user:', error);
      throw error;
    }
  };

  const getReportsByDateRange = async (startDate: Date, endDate: Date): Promise<Report[]> => {
    try {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      const { data, error } = await supabase
        .from(TABLES.REPORTS)
        .select('*')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        userName: item.user_name,
        purpose: item.purpose,
        timeOut: item.time_out,
        timeIn: item.time_in,
        vehicle: item.vehicle,
        photoUrl: item.photo_url,
        location: item.location,
        notes: item.notes,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting reports by date range:', error);
      throw error;
    }
  };

  // Storage functions
  const uploadImage = async (file: File, path: string): Promise<string> => {
    try {
      const { error, data } = await supabase.storage
        .from('reports')
        .upload(path, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('reports')
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    isLoading,
    userRole,
    userData,
    employeeLogin,
    createEmployee,
    login,
    signup,
    logout,
    submitReport,
    getReports,
    getReportsByUser,
    getReportsByDateRange,
    uploadImage
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!isLoading && children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
