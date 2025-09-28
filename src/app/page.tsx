import CoachOverlay from '@/components/CoachOverlay';
import TelehealthBackground from '@/components/TelehealthBackground';

export default function Home() {
  return (
    <main className="relative w-screen h-screen">
      <TelehealthBackground />
      <CoachOverlay />
    </main>
  );
}