import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctnftgnypvutexeajwcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bmZ0Z255cHZ1dGV4ZWFqd2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MTYxODksImV4cCI6MjA0NzA5MjE4OX0.QBqsLhypQbWjprOlY7_DilS2gFfrSlKZWNLAErtvpGc';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Bookable {
  id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  booked: boolean;
}

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getBookings(startDate: string, endDate: string): Promise<Bookable[]> {
  const { data, error } = await supabase
    .from('timeslots')
    .select('*')
    .gte('start_time', startDate)
    .lte('start_time', endDate);
  
  if (error) throw error;
  return data || [];
}

export async function createBooking(booking: {
  room_id: string;
  user_name: string;
  date: string;
  time: string;
}): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...booking,
      date: new Date(booking.date).toISOString().split('T')[0],
      time: `${booking.time}:00`
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getAvailableTimeSlots(
  selectedRooms: string[],
  date: string
): Promise<Array<{ time: string; roomId: string; roomName: string }>> {
  // Format date to ISO format for PostgreSQL
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // Get all bookings for the selected date
  const { data: bookings, error: bookingsError } = await supabase
    .from('timeslots')
    .select('room_id, start_time, booked')
    .eq('start_time', formattedDate);

  if (bookingsError) throw bookingsError;

  // Get room details
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .in('id', selectedRooms);

  if (roomsError) throw roomsError;

  // Define available time slots (8:00 to 17:00)
  const timeSlots = Array.from({ length: 10 }, (_, i) => 
    `${String(i + 8).padStart(2, '0')}:00`
  );

  // Create a map of booked slots
  const bookedSlots = new Set(
    bookings?.map(b => `${b.room_id}-${b.time.slice(0, 5)}`) || []
  );

  // Generate available slots
  const availableSlots = [];
  for (const room of rooms || []) {
    for (const time of timeSlots) {
      if (!bookedSlots.has(`${room.id}-${time}`)) {
        availableSlots.push({
          time,
          roomId: room.id,
          roomName: room.name,
        });
      }
    }
  }

  return availableSlots.sort((a, b) => a.time.localeCompare(b.time));
}