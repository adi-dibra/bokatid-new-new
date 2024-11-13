import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { TimeSlot } from './pages/TimeSlot';
import { Confirmation } from './pages/Confirmation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/timeslot" element={<TimeSlot />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;