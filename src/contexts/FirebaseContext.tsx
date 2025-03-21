import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db, storage, COLLECTIONS, ROLES } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  updateDoc, 
  doc, 
  deleteDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { Report, ReportFormData, Location, UserRole } from '@/types';
import { toast } from "sonner";

interface UserData {
  uid: string;
  employeeId: string;
  name: string;
  role: UserRole;
  email: string;
}

interface FirebaseContextProps {
  // Auth
  currentUser: User | null;
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

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user data including role from Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserData, 'uid'>;
            setUserData({ ...userData, uid: user.uid } as UserData);
            setUserRole(userData.role);
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
    });

    return unsubscribe;
  }, []);

  // Employee ID login
  const employeeLogin = async (employeeId: string, password: string) => {
    try {
      // Query Firestore to find the user with the given employee ID
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('employeeId', '==', employeeId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("Employee ID not found");
      }
      
      // Get the email associated with this employee ID
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      if (!userData.email) {
        throw new Error("Employee account is not properly configured");
      }
      
      // Login with email/password
      await signInWithEmailAndPassword(auth, userData.email, password);
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
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('employeeId', '==', employeeId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("Employee ID already exists");
      }
      
      // Create a unique email address based on employee ID
      const email = `${employeeId.toLowerCase()}@admintracker.local`;
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        employeeId,
        name,
        email,
        role,
        createdAt: Timestamp.now()
      });
      
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document with default role
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        email,
        role: ROLES.USER, // Default role
        createdAt: Timestamp.now()
      });
      
      toast.success("Account created successfully");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
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

      // Add report to Firestore
      await addDoc(collection(db, COLLECTIONS.REPORTS), {
        userName: reportData.userName,
        userId: currentUser?.uid || '',
        purpose: reportData.purpose,
        timeOut: reportData.timeOut,
        timeIn: reportData.timeIn,
        vehicle: reportData.vehicle,
        photoUrl: photoUrl,
        location: reportData.location,
        notes: reportData.notes || '',
        createdAt: Timestamp.now()
      });
      
      toast.success("Report submitted successfully");
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || "Failed to submit report");
      throw error;
    }
  };

  const getReports = async (): Promise<Report[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.REPORTS),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          purpose: data.purpose,
          timeOut: data.timeOut,
          timeIn: data.timeIn,
          vehicle: data.vehicle,
          photoUrl: data.photoUrl,
          location: data.location,
          notes: data.notes,
          createdAt: data.createdAt.toDate().toISOString()
        } as Report;
      });
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  };

  const getReportsByUser = async (userName: string): Promise<Report[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.REPORTS),
        where('userName', '==', userName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          purpose: data.purpose,
          timeOut: data.timeOut,
          timeIn: data.timeIn,
          vehicle: data.vehicle,
          photoUrl: data.photoUrl,
          location: data.location,
          notes: data.notes,
          createdAt: data.createdAt.toDate().toISOString()
        } as Report;
      });
    } catch (error) {
      console.error('Error getting reports by user:', error);
      throw error;
    }
  };

  const getReportsByDateRange = async (startDate: Date, endDate: Date): Promise<Report[]> => {
    try {
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      const q = query(
        collection(db, COLLECTIONS.REPORTS),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          purpose: data.purpose,
          timeOut: data.timeOut,
          timeIn: data.timeIn,
          vehicle: data.vehicle,
          photoUrl: data.photoUrl,
          location: data.location,
          notes: data.notes,
          createdAt: data.createdAt.toDate().toISOString()
        } as Report;
      });
    } catch (error) {
      console.error('Error getting reports by date range:', error);
      throw error;
    }
  };

  // Storage functions
  const uploadImage = async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
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
    <FirebaseContext.Provider value={value}>
      {!isLoading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
