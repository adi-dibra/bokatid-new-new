import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-between p-8 max-w-[600px] mx-auto w-full">
        <div className="flex-1 flex items-center justify-center w-full">
          <h1 className="text-[64px] font-normal leading-[1.1] tracking-tight">
            Boka ett rum
          </h1>
        </div>
        <div className="w-full">
          <Button 
            className="w-full h-14 text-base rounded-full"
            onClick={() => navigate('/timeslot')}
          >
            Boka
          </Button>
        </div>
      </main>
    </div>
  );
}