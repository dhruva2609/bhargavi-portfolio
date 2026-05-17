import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Creator from './pages/Creator'; // New Import
import Reader from './pages/Reader';
import Muse from './pages/Muse';
import Songs from './pages/Songs';
import Dashboard from './pages/Dashboard';

import Layout from './components/Layout';

import { useState, useEffect, type ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalLoader from './components/GlobalLoader';

function App() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial data fetch simulation / verification
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            <GlobalLoader loading={loading} />
            <Layout>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
                        <Route path="/snippets" element={<PageWrapper><Feed /></PageWrapper>} />
                        <Route path="/write" element={<PageWrapper><Creator /></PageWrapper>} />
                        <Route path="/creator" element={<PageWrapper><Creator /></PageWrapper>} />
                        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                        <Route path="/muse" element={<PageWrapper><Muse /></PageWrapper>} />
                        <Route path="/songs" element={<PageWrapper><Songs /></PageWrapper>} />
                        <Route path="/write" element={<PageWrapper><Creator /></PageWrapper>} />
                        <Route path="/read/:slug" element={<PageWrapper><Reader /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </Layout>
        </ErrorBoundary>
    );
}

const PageWrapper = ({ children }: { children: ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

export default App;
