import { create } from 'zustand';
import { Timeslot, getBookings, getTimeslot } from '@/lib/supabase';

interface BookingStore {
  timeslots: Timeslot[];
  selectedRooms: string[];
  selectedDate: string;
  selectedTime: string;
  selectedRoomId: string;
  userName: string;
  isLoading: boolean;
  error: string | null;
  toggleRoom: (roomId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSelectedRoomId: (roomId: string) => void;
  setUserName: (name: string) => void;
  fetchTimeslots: () => Promise<void>;
  fetchBookings: (startDate: string, endDate: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  rooms: [],
  selectedRooms: [],
  selectedDate: '',
  selectedTime: '',
  selectedRoomId: '',
  userName: '',
  isLoading: false,
  error: null,

  toggleRoom: (roomId) => 
    set((state) => ({
      selectedRooms: state.selectedRooms.includes(roomId)
        ? state.selectedRooms.filter(id => id !== roomId)
        : [...state.selectedRooms, roomId],
      selectedTime: state.selectedRoomId === roomId ? '' : state.selectedTime,
      selectedRoomId: state.selectedRoomId === roomId ? '' : state.selectedRoomId,
    })),

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),
  setUserName: (name) => set({ userName: name }),

  fetchTimeslots: async () => {
    set({ isLoading: true, error: null });
    try {
      const timeslot = await getTimeslot();
      set({ timeslot, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch rooms', isLoading: false });
    }
  },

  fetchBookings: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getBookings(startDate, endDate);
      set({ isLoading: false });
      return bookings;
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
      return [];
    }
  },
}));