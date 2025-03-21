// Report types
export interface Report {
  id: string;
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  photoUrl: string;
  location: Location;
  notes?: string;
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Form data type
export interface ReportFormData {
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  photo: File | null;
  location: Location | null;
  notes?: string;
}

// Mock data
export const VEHICLES = [
  "Personal Car",
  "Company Vehicle",
  "Taxi",
  "Public Transport",
  "Walking",
  "Other"
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    userName: "John Doe",
    purpose: "Client Meeting",
    timeOut: "2023-06-01T09:00",
    timeIn: "2023-06-01T12:30",
    vehicle: "Personal Car",
    photoUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=3270&auto=format&fit=crop",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "123 Market St, San Francisco, CA"
    },
    notes: "Met with client to discuss the new project requirements.",
    createdAt: "2023-06-01T08:45:00Z"
  },
  {
    id: "2",
    userName: "Jane Smith",
    purpose: "Site Inspection",
    timeOut: "2023-06-02T13:00",
    timeIn: "2023-06-02T16:45",
    vehicle: "Company Vehicle",
    photoUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=3270&auto=format&fit=crop",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: "456 Pine St, San Francisco, CA"
    },
    notes: "Inspected the construction site for upcoming project.",
    createdAt: "2023-06-02T12:50:00Z"
  },
  {
    id: "3",
    userName: "Robert Johnson",
    purpose: "Supply Pickup",
    timeOut: "2023-06-03T10:15",
    timeIn: "2023-06-03T11:30",
    vehicle: "Personal Car",
    photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=3269&auto=format&fit=crop",
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: "789 Sunset Blvd, San Francisco, CA"
    },
    notes: "Picked up office supplies from the warehouse.",
    createdAt: "2023-06-03T10:00:00Z"
  },
  {
    id: "4",
    userName: "Emily Davis",
    purpose: "Partner Meeting",
    timeOut: "2023-06-04T14:00",
    timeIn: "2023-06-04T17:30",
    vehicle: "Taxi",
    photoUrl: "https://images.unsplash.com/photo-1565792508300-56146195ba8f?q=80&w=3270&auto=format&fit=crop",
    location: {
      latitude: 37.7879,
      longitude: -122.4074,
      address: "321 Howard St, San Francisco, CA"
    },
    notes: "Discussed collaboration opportunities with potential partner.",
    createdAt: "2023-06-04T13:45:00Z"
  },
  {
    id: "5",
    userName: "Michael Brown",
    purpose: "Training Session",
    timeOut: "2023-06-05T08:30",
    timeIn: "2023-06-05T15:45",
    vehicle: "Public Transport",
    photoUrl: "https://images.unsplash.com/photo-1559485137-75efbfc1af04?q=80&w=3270&auto=format&fit=crop",
    location: {
      latitude: 37.7841,
      longitude: -122.3959,
      address: "555 Mission St, San Francisco, CA"
    },
    notes: "Attended training session on new project management software.",
    createdAt: "2023-06-05T08:15:00Z"
  }
];

export type UserRole = 'admin' | 'user';
