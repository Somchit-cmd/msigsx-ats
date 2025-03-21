
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
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
  deleteDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { Report, ReportFormData, Location } from '@/types';

interface FirebaseContextProps {
  // Auth
  currentUser: User | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth functions
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
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
      await addDoc(collection(db, 'reports'), {
        userName: reportData.userName,
        purpose: reportData.purpose,
        timeOut: reportData.timeOut,
        timeIn: reportData.timeIn,
        vehicle: reportData.vehicle,
        photoUrl: photoUrl,
        location: reportData.location,
        notes: reportData.notes || '',
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  };

  const getReports = async (): Promise<Report[]> => {
    try {
      const q = query(
        collection(db, 'reports'),
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
        collection(db, 'reports'),
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
        collection(db, 'reports'),
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
