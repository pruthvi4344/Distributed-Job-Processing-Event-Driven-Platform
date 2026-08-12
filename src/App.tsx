import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Jobs } from "@/pages/Jobs";
import { JobDetail } from "@/pages/JobDetail";
import { Workers } from "@/pages/Workers";
import { Settings } from "@/pages/Settings";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
