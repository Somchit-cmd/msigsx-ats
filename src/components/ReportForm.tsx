import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Clock, Car, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import MapLocation from '@/components/MapLocation';
import { ReportFormData, Location, VEHICLES } from '@/types';
import { useSupabase } from '@/contexts/SupabaseContext';

const ReportForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitReport } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ReportFormData>({
    userName: '',
    purpose: '',
    timeOut: '',
    timeIn: '',
    vehicle: '',
    photo: null,
    location: null,
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file: File | null) => {
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handleLocationSelect = (location: Location | null) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.userName || !formData.purpose || !formData.timeOut || 
        !formData.timeIn || !formData.vehicle || !formData.photo || !formData.location) {
      toast({
        title: "Please complete all required fields",
        description: "All fields except notes are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      await submitReport(formData);
      
      toast({
        title: "Report submitted successfully",
        description: "Your work report has been recorded",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error submitting report",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName">Your Name</Label>
          <Input
            id="userName"
            name="userName"
            placeholder="Enter your full name"
            value={formData.userName}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of Visit</Label>
          <Input
            id="purpose"
            name="purpose"
            placeholder="Why are you going out?"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeOut">Time Out</Label>
            <div className="relative">
              <Input
                id="timeOut"
                name="timeOut"
                type="datetime-local"
                value={formData.timeOut}
                onChange={handleChange}
                className="w-full"
              />
              <CalendarClock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeIn">Expected Return</Label>
            <div className="relative">
              <Input
                id="timeIn"
                name="timeIn"
                type="datetime-local"
                value={formData.timeIn}
                onChange={handleChange}
                className="w-full"
              />
              <Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicle">Vehicle Used</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('vehicle', value)}
            value={formData.vehicle}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLES.map(vehicle => (
                <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Proof of Visit</Label>
          <ImageUpload onImageSelect={handleImageSelect} />
        </div>
        
        <div className="space-y-2">
          <Label>Location</Label>
          <MapLocation onLocationSelect={handleLocationSelect} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Additional Notes (Optional)</span>
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional information..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full min-h-[100px]"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Report...
          </>
        ) : (
          'Submit Report'
        )}
      </Button>
    </form>
  );
};

export default ReportForm;
