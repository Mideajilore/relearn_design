import { Navigate, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { TrackerProvider } from './lib/tracker';
import { Guide } from './routes/Guide';
import { History } from './routes/History';
import { Today } from './routes/Today';

export default function App() {
  return (
    <TrackerProvider>
      <div className="min-h-screen bg-grey-50">
        <Nav />

        <main className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-grey-200 bg-white">
          <div className="mx-auto max-w-content px-4 py-6 sm:px-6">
            <p className="text-sm text-grey-500">
              Consume less, apply more, and publish the applying.
            </p>
          </div>
        </footer>
      </div>
    </TrackerProvider>
  );
}
