import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Muse from './pages/Muse';
import Reader from './pages/Reader';
import Landing from './pages/Landing'; // Ensure you created this from the previous prompts

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/muse" element={<Muse />} />
                    <Route path="/read/:slug" element={<Reader />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;