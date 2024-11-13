import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createBooking } from '@/lib/supabase';

export function Confirmation() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    timeslots,
    selectedTimeslotId,
    selectedDate,
    selectedTime,
    userName,
    setUserName
  } = useBookingStore();
  
  const timeslot = timeslots.find((t) => t.id === selectedTimeslotId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createBooking({
        id: selectedTimeslotId,
        name: userName,
      });
      setShowConfirmation(true);
    } catch (err) {
      console.log(err)
      setError('Det gick inte att boka rummet. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmed = () => {
    setShowConfirmation(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-[600px]">
        <h1 className="text-[40px] font-normal mb-8">Bekräfta bokning</h1>

        <div className="space-y-6 mb-8">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-500 mb-1">Rum</p>
            <p className="font-medium">{timeslot?.name}</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-500 mb-1">Tid</p>
            <p className="font-medium">{selectedDate} {selectedTime}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Ditt namn
            </label>
            <input
              type="text"
              id="name"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-neutral-950"
              placeholder="Skriv ditt namn"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 text-base rounded-full"
          >
            {isSubmitting ? 'Bokar...' : 'Bekräfta bokning'}
          </Button>
        </form>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold mb-4">Ditt rum är bokat!</h2>
              <Button onClick={handleConfirmed} className="w-full h-14 text-base rounded-full">
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}