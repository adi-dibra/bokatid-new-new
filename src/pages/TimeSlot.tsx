import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { format, addDays } from '../utils/date';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAvailableTimeSlots } from '@/lib/supabase';

export function TimeSlot() {
  const navigate = useNavigate();
  const { 
    rooms,
    selectedRooms, 
    selectedTime, 
    selectedDate,
    selectedRoomId,
    toggleRoom,
    setSelectedDate,
    setSelectedTime,
    setSelectedRoomId,
    fetchRooms,
    isLoading,
    error
  } = useBookingStore();

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; roomId: string; roomName: string }>>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (selectedRooms.length === 0) return;
      
      setSlotsLoading(true);
      try {
        const slots = await getAvailableTimeSlots(
          selectedRooms,
          format(new Date())
        );
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
      } finally {
        setSlotsLoading(false);
      }
    }

    fetchAvailableSlots();
  }, [selectedRooms]);

  const handleSlotSelect = (date: string, time: string, roomId: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedRoomId(roomId);
  };

  const today = new Date();
  const startDate = addDays(today, currentWeekOffset * 3);
  const dates = [startDate, addDays(startDate, 1), addDays(startDate, 2)];

  const canProceed = selectedTime && selectedRoomId;

  const handlePrevious = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  const handleNext = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const isSelected = (date: string, time: string, roomId: string) => {
    return selectedDate === date && selectedTime === time && selectedRoomId === roomId;
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Laddar...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[600px] mx-auto p-8">
      <h1 className="text-[40px] font-normal mb-8">Välj en tid</h1>
      
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => toggleRoom(room.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedRooms.includes(room.id)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center relative mb-4">
          <div className="absolute left-0">
            <button 
              onClick={handlePrevious}
              disabled={currentWeekOffset === 0}
              className="p-2 hover:bg-neutral-100 rounded-full disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <span className="text-base">
            {format(dates[0])} - {format(dates[dates.length - 1])}
          </span>
          <div className="absolute right-0">
            <button 
              onClick={handleNext}
              className="p-2 hover:bg-neutral-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-lg">
          {dates.map((date) => (
            <div key={date.toString()}>
              <h3 className="text-sm font-medium mb-2">{format(date)}</h3>
              <div className="space-y-2">
                {selectedRooms.length === 0 ? (
                  <div className="text-sm text-neutral-500 p-3">
                    Välj rum först
                  </div>
                ) : slotsLoading ? (
                  <div className="text-sm text-neutral-500 p-3">
                    Laddar...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-sm text-neutral-500 p-3">
                    Inga lediga tider
                  </div>
                ) : (
                  availableSlots.map((slot) => {
                    const formattedDate = format(date);
                    const selected = isSelected(formattedDate, slot.time, slot.roomId);
                    return (
                      <button
                        key={`${date}-${slot.time}-${slot.roomId}`}
                        onClick={() => handleSlotSelect(formattedDate, slot.time, slot.roomId)}
                        className={`w-full p-3 text-left text-sm rounded-lg transition-colors ${
                          selected
                            ? 'bg-neutral-900 text-white border-2 border-neutral-900'
                            : 'bg-white border-2 border-emerald-500 hover:border-emerald-600'
                        }`}
                      >
                        <div>{slot.time}</div>
                        <div className="text-xs text-neutral-500">
                          {slot.roomName}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button 
          onClick={() => navigate('/confirmation')}
          disabled={!canProceed}
          className="w-full h-14 text-base rounded-full disabled:opacity-50"
        >
          Nästa
        </Button>
      </div>
    </div>
  );
}