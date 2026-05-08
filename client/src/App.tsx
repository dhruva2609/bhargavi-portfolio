import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Creator from './pages/Creator'; // New Import
import Reader from './pages/Reader';
import Muse from './pages/Muse';
import Songs from './pages/Songs';
import Layout from './components/Layout';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/snippets" element={<Feed />} />
                <Route path="/write" element={<Creator />} /> {/* Secure Posting Path */}
                <Route path="/muse" element={<Muse />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/read/:slug" element={<Reader />} />
            </Routes>
        </Layout>
    );
}

export default App;