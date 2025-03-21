
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location } from '@/types';

interface MapLocationProps {
  onLocationSelect: (location: Location | null) => void;
  className?: string;
}

const MapLocation: React.FC<MapLocationProps> = ({ onLocationSelect, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get address using reverse geocoding
        try {
          // In a real app, you would use a service like Google Maps Geocoding API
          // For this demo, we'll simulate the address
          const mockAddress = `${Math.floor(Math.random() * 999) + 1} Main St, San Francisco, CA`;
          
          const newLocation: Location = {
            latitude,
            longitude,
            address: mockAddress
          };
          
          setLocation(newLocation);
          onLocationSelect(newLocation);
        } catch (err) {
          console.error('Error getting address:', err);
          
          // Even without address, save the coordinates
          const newLocation: Location = {
            latitude,
            longitude
          };
          
          setLocation(newLocation);
          onLocationSelect(newLocation);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Please check permissions.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    onLocationSelect(null);
  };

  return (
    <div className={className}>
      {!location ? (
        <div className="border rounded-lg p-4">
          <div className="flex flex-col items-center justify-center py-4">
            <MapPin size={32} className="text-muted-foreground mb-3" />
            <p className="text-base font-medium mb-1 text-center">Location Capture</p>
            <p className="text-sm text-muted-foreground text-center mb-4">Record your current location</p>
            
            <Button 
              onClick={getLocation}
              disabled={isLoading}
              variant="secondary"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Getting Location...</span>
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  <span>Capture Location</span>
                </>
              )}
            </Button>
            
            {error && (
              <p className="mt-2 text-destructive text-sm">{error}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-secondary/40">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <h4 className="font-medium">Location Captured</h4>
              </div>
              
              {location.address ? (
                <p className="text-sm text-muted-foreground">{location.address}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Lat: {location.latitude.toFixed(6)}, 
                  Lng: {location.longitude.toFixed(6)}
                </p>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={clearLocation}
            >
              Change
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocation;
