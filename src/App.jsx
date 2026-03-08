import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useLanguage";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import TopicList from "./pages/TopicList";
import TopicDetail from "./pages/TopicDetail";
import LessonPage from "./pages/LessonPage";
import PracticeList from "./pages/PracticeList";
import ProblemPage from "./pages/ProblemPage";
import Playground from "./pages/Playground";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/DSA-DAA-PROJECTS">
        <Routes>
          {/* Playground and ProblemPage are full-screen, no layout */}
          <Route path="/playground" element={<Playground />} />
          <Route path="/problem/:category/:topicId/:problemId" element={<ProblemPage />} />

          {/* Pages with Layout (Navbar) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/topics/:category/:topicId" element={<TopicDetail />} />
            <Route path="/learn/:category/:topicId" element={<LessonPage />} />
            <Route path="/practice/:category/:topicId" element={<PracticeList />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
