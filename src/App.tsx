import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TagsPage from './pages/TagsPage';
import SettingsPage from './pages/SettingsPage';
import TrendingPage from './pages/TrendingPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailsPage from './pages/CollectionDetailsPage';
import WorkflowsPage from './pages/WorkflowsPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster position="bottom-right" theme="dark" richColors />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<HomePage view="favorites" />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/workflows/:id" element={<WorkflowsPage />} /> {/* Placeholder for now */}
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
