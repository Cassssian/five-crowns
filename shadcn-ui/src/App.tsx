import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import GameModeSelection from './pages/GameModeSelection';
import Lobby from './pages/Lobby';
import JoinGame from './pages/JoinGame';
import GamePage from './pages/GamePage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/game-mode" element={<GameModeSelection />} />
                    <Route path="/lobby" element={<Lobby />} />
                    <Route path="/join" element={<JoinGame />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;