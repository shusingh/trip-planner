import { Route, Routes } from 'react-router-dom';

import PlannerPage from './pages/Planner/Planner';
import ResultsPage from './pages/Results/Results';

import { KentoCursor } from '@/components/KentoCursor/KentoCursor';
import { PaperShader } from '@/components/PaperShader/PaperShader';
import LandingPage from '@/pages/LandingPage/LandingPage';

function App() {
  return (
    <>
      <PaperShader />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<PlannerPage />} path="/planner" />
        <Route element={<ResultsPage />} path="/planner/results" />
      </Routes>
      <KentoCursor />
    </>
  );
}

export default App;
