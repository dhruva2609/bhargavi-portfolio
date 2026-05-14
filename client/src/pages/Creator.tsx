import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Book, Plus, ChevronRight, Save, Edit3, Loader2, Music, Heart } from 'lucide-react';
import featherSvg from '../assets/Feather.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const Creator = () => {
    const [mode, setMode] = useState<'volume' | 'echo' | 'melody' | 'scene'>('volume');
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [books, setBooks] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [scenes, setScenes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passphrase, setPassphrase] = useState(import.meta.env.VITE_CREATOR_KEY || '');
    const [isUnlocked, setIsUnlocked] = useState(false);

    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [selectedScene, setSelectedScene] = useState<any>(null);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | 'new'>('new');
    const [editorContent, setEditorContent] = useState({ title: '', body: '', mood: 'Melancholic', imageUrl: '', instaUrl: '' });
    const [echoBody, setEchoBody] = useState('');

    const authHeaders = {
        headers: { Authorization: `Bearer ${passphrase}` }
    };

    const handleUnlock = async () => {
        if (!passphrase.trim()) return;
        setLoading(true);
        try {
            await axios.get(`${API_URL}/api/content/verify`, {
                headers: { Authorization: `Bearer ${passphrase}` }
            });
            setIsUnlocked(true);
        } catch (err) {
            alert("The secret is incorrect. The vault remains sealed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isUnlocked) {
            fetchBooks();
            fetchSongs();
            fetchScenes();
        }
    }, [isUnlocked]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/content/stories`, authHeaders);
            setBooks(res.data);
        } catch (err) {
            console.error("The bookshelf was unreachable:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSongs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/content/songs`, authHeaders);
            setSongs(res.data);
        } catch (err) {
            console.error("The melodies were lost:", err);
        }
    };

    const fetchScenes = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/content/instagram`, authHeaders);
            setScenes(res.data);
        } catch (err) {
            console.error("The scenes were hidden:", err);
        }
    };

    const handleSaveEcho = async () => {
        if (!echoBody.trim()) return;
        try {
            setSaving(true);
            await axios.post(`${API_URL}/api/content/snippet`, { body: echoBody }, authHeaders);
            alert("The echo has been recorded in the archive.");
            setEchoBody('');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message;
            if (msg.includes('characters')) {
                alert("This fragment is too long for the archive's memory.");
            } else {
                alert("Failed to save the fragment. Check your secret passphrase.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMelody = async () => {
        if (!editorContent.title.trim() || !editorContent.body.trim()) return;
        try {
            setSaving(true);
            if (selectedSong) {
                await axios.put(`${API_URL}/api/content/songs/${selectedSong._id}`, {
                    title: editorContent.title,
                    lyrics: editorContent.body,
                    mood: editorContent.mood
                }, authHeaders);
            } else {
                await axios.post(`${API_URL}/api/content/songs`, {
                    title: editorContent.title,
                    lyrics: editorContent.body,
                    mood: editorContent.mood
                }, authHeaders);
            }
            alert("The melody has been etched into the collection.");
            fetchSongs();
            setView('list');
        } catch (err) {
            alert("Failed to save the melody.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveScene = async () => {
        if (!editorContent.title.trim() || !editorContent.imageUrl.trim()) return;
        try {
            setSaving(true);
            await axios.post(`${API_URL}/api/content/instagram`, {
                label: editorContent.title,
                image: editorContent.imageUrl,
                url: editorContent.instaUrl
            }, authHeaders);
            alert("The scene has been captured in the archive.");
            fetchScenes();
            setView('list');
        } catch (err) {
            alert("Failed to save the scene.");
        } finally {
            setSaving(false);
        }
    };

    const chapters = useMemo(() => {
        if (!selectedBook?.body) return [];
        const parts = selectedBook.body.split(/(?=Chapter \d+:)/);
        return parts.filter((p: string) => p.trim().startsWith('Chapter')).map((p: string) => {
            const lines = p.trim().split('\n');
            return {
                header: lines[0],
                content: lines.slice(1).join('\n').trim()
            };
        });
    }, [selectedBook]);

    const nextChapterNumber = chapters.length + 1;

    const handleSelectBook = (book: any) => {
        setSelectedBook(book);
        setSelectedSong(null);
        setSelectedScene(null);
        setEditorContent({ title: book.title, body: '', mood: 'Melancholic', imageUrl: '', instaUrl: '' });
        setSelectedChapterIndex('new');
        setView('editor');
    };

    const handleSelectSong = (song: any) => {
        setSelectedSong(song);
        setSelectedBook(null);
        setSelectedScene(null);
        setEditorContent({ title: song.title, body: song.lyrics, mood: song.mood || 'Melancholic', imageUrl: '', instaUrl: '' });
        setView('editor');
    };

    const handleNewBook = () => {
        setSelectedBook(null);
        setSelectedSong(null);
        setSelectedScene(null);
        setEditorContent({ title: '', body: '', mood: 'Melancholic', imageUrl: '', instaUrl: '' });
        setSelectedChapterIndex('new');
        setView('editor');
    };

    const handleNewSong = () => {
        setSelectedBook(null);
        setSelectedSong(null);
        setSelectedScene(null);
        setEditorContent({ title: '', body: '', mood: 'Melancholic', imageUrl: '', instaUrl: '' });
        setView('editor');
    };

    const handleNewScene = () => {
        setSelectedBook(null);
        setSelectedSong(null);
        setSelectedScene(null);
        setEditorContent({ title: '', body: '', mood: 'Melancholic', imageUrl: '', instaUrl: '' });
        setView('editor');
    };

    const handleSelectChapter = (index: number | 'new') => {
        setSelectedChapterIndex(index);
        if (index === 'new') {
            setEditorContent(prev => ({ ...prev, body: `Chapter ${nextChapterNumber}: New Chapter Title\n\nWrite your narrative here...` }));
        } else {
            const ch = chapters[index];
            setEditorContent(prev => ({ ...prev, body: `${ch.header}\n\n${ch.content}` }));
        }
    };

    const handleSave = async () => {
        if (mode === 'echo') return handleSaveEcho();
        if (mode === 'melody') return handleSaveMelody();
        if (mode === 'scene') return handleSaveScene();

        try {
            setSaving(true);
            let finalBody = editorContent.body;

            if (selectedBook) {
                if (selectedChapterIndex === 'new') {
                    finalBody = selectedBook.body + '\n\n' + editorContent.body;
                } else {
                    const newChapters = [...chapters];
                    const [header, ...contentLines] = editorContent.body.split('\n');
                    newChapters[selectedChapterIndex as number] = {
                        header: header.trim(),
                        content: contentLines.join('\n').trim()
                    };
                    finalBody = newChapters.map(c => `${c.header}\n\n${c.content}`).join('\n\n');
                }

                await axios.put(`${API_URL}/api/content/stories/${selectedBook._id}`, {
                    title: editorContent.title,
                    body: finalBody
                }, authHeaders);
            } else {
                const slug = editorContent.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                const wordCount = editorContent.body.split(/\s+/).length;
                const readTime = Math.ceil(wordCount / 225);

                await axios.post(`${API_URL}/api/content/stories`, {
                    title: editorContent.title,
                    body: editorContent.body,
                    slug,
                    readTime,
                    synopsis: editorContent.body.substring(0, 150) + '...'
                }, authHeaders);
            }

            alert("The archive has been updated gracefully.");
            await fetchBooks();
            setView('list');
        } catch (err) {
            console.error("The quill broke:", err);
            alert("Failed to etch the words. Check your connection.");
        } finally {
            setSaving(false);
        }
    };

    if (!isUnlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full editorial-card p-12 text-center space-y-8 shadow-2xl border border-dream-purple/5"
                    style={{ backgroundColor: 'var(--color-glass-bg)' }}
                >
                    <div className="flex justify-center">
                        <img src={featherSvg} alt="Feather" className="w-16 h-16 opacity-20" />
                    </div>
                    <div className="space-y-4">
                        <span className="metadata-precise text-[10px] tracking-[0.8em] text-muted-rosegold uppercase block">Administrative Vault</span>
                        <h2 className="font-serif text-4xl italic text-dream-purple leading-tight">Enter the Inkwell</h2>
                        <p className="font-serif text-charcoal/40 italic text-sm">To etch new words, the creator must first speak the secret.</p>
                    </div>
                    <input
                        type="password"
                        placeholder="Enter the Secret..."
                        className="w-full bg-transparent border-b border-dream-purple/10 py-4 text-center font-serif text-2xl outline-none placeholder:text-dream-purple/5 text-dream-purple"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    />
                    <button
                        onClick={handleUnlock}
                        disabled={loading}
                        className="w-full bg-dream-purple text-white py-4 rounded-full font-serif italic text-lg hover:shadow-editorial transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Unlock Studio"}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-32 px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-dream-pink/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="flex items-center gap-6">
                        <img src={featherSvg} alt="Feather" className="w-12 h-12 opacity-30" />
                        <div>
                            <span className="metadata-precise text-muted-rosegold text-[10px] tracking-[0.5em] block uppercase mb-1">Author's Studio</span>
                            <h1 className="font-serif text-4xl italic text-dream-purple">The Inkwell</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 editorial-card p-1.5 rounded-full border border-dream-purple/10 shadow-sm" style={{ backgroundColor: 'var(--nav-bg)' }}>
                        <button
                            onClick={() => { setMode('volume'); setView('list'); }}
                            className={`px-8 py-2.5 rounded-full font-serif italic text-base transition-all duration-500 ${mode === 'volume' ? 'bg-dream-purple text-white shadow-editorial' : 'text-dream-purple/40 hover:text-dream-purple'}`}
                        >
                            Bookshelf
                        </button>
                        <button
                            onClick={() => { setMode('echo'); setView('list'); }}
                            className={`px-8 py-2.5 rounded-full font-serif italic text-base transition-all duration-500 ${mode === 'echo' ? 'bg-cherry text-white shadow-editorial' : 'text-dream-purple/40 hover:text-dream-purple'}`}
                        >
                            Archive
                        </button>
                        <button
                            onClick={() => { setMode('melody'); setView('list'); }}
                            className={`px-8 py-2.5 rounded-full font-serif italic text-base transition-all duration-500 ${mode === 'melody' ? 'bg-dream-purple text-white shadow-editorial' : 'text-dream-purple/40 hover:text-dream-purple'}`}
                        >
                            Melodies
                        </button>
                        <button
                            onClick={() => { setMode('scene'); setView('list'); }}
                            className={`px-8 py-2.5 rounded-full font-serif italic text-base transition-all duration-500 ${mode === 'scene' ? 'bg-cherry text-white shadow-editorial' : 'text-dream-purple/40 hover:text-dream-purple'}`}
                        >
                            Scenes
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        {mode === 'volume' && view === 'list' && (
                            <button
                                onClick={handleNewBook}
                                className="group flex items-center gap-3 bg-dream-purple text-white px-8 py-3 rounded-full hover:shadow-editorial transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                <span className="font-serif italic text-lg">Add New Book</span>
                            </button>
                        )}
                        {mode === 'melody' && view === 'list' && (
                            <button
                                onClick={handleNewSong}
                                className="group flex items-center gap-3 bg-dream-purple text-white px-8 py-3 rounded-full hover:shadow-editorial transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                <span className="font-serif italic text-lg">Compose Melody</span>
                            </button>
                        )}
                        {mode === 'scene' && view === 'list' && (
                            <button
                                onClick={handleNewScene}
                                className="group flex items-center gap-3 bg-cherry text-white px-8 py-3 rounded-full hover:shadow-editorial transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                <span className="font-serif italic text-lg">Add Visual Scene</span>
                            </button>
                        )}
                        {view === 'editor' && (
                            <button
                                onClick={() => setView('list')}
                                className="text-dream-purple/40 hover:text-cherry transition-colors font-serif italic text-xl flex items-center gap-2"
                            >
                                <ChevronRight size={16} className="rotate-180" /> Return to List
                            </button>
                        )}
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {mode === 'echo' ? (
                        <motion.div
                            key="echo"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="editorial-card p-6 md:p-20 shadow-2xl relative overflow-hidden border border-cherry/10" style={{ backgroundColor: 'var(--color-glass-bg)' }}>
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-cherry opacity-40" />
                                <span className="metadata-precise text-muted-rosegold text-[10px] tracking-[0.4em] uppercase mb-12 block">Etch an Archive Quote</span>
                                <textarea
                                    placeholder="Write a small quote or fragment for the Archive..."
                                    className="w-full bg-transparent min-h-[300px] font-serif text-2xl md:text-3xl italic leading-relaxed outline-none text-charcoal/80 placeholder:text-dream-purple/10 custom-scrollbar resize-none mb-12"
                                    value={echoBody}
                                    onChange={(e) => setEchoBody(e.target.value)}
                                />
                                <button
                                    onClick={handleSaveEcho}
                                    disabled={saving || !echoBody.trim()}
                                    className="group w-full flex items-center justify-center gap-4 bg-cherry text-white py-4 md:py-6 rounded-full hover:shadow-editorial transition-all active:scale-95 disabled:opacity-30"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    <span className="font-serif italic text-lg md:text-2xl">Publish Quote to Archive</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : view === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {loading ? (
                                <div className="col-span-full flex justify-center py-48">
                                    <Loader2 size={40} className="text-dream-purple/20 animate-spin" />
                                </div>
                            ) : mode === 'volume' ? (
                                books.map((book) => (
                                    <div
                                        key={book._id}
                                        onClick={() => handleSelectBook(book)}
                                        className="editorial-card group p-10 cursor-pointer hover:shadow-editorial transition-all border border-dream-purple/5 hover:border-dream-purple/20"
                                        style={{ backgroundColor: 'var(--color-glass-bg)' }}
                                    >
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="w-12 h-12 rounded-lg bg-dream-purple/5 flex items-center justify-center text-dream-purple group-hover:bg-dream-purple group-hover:text-white transition-colors duration-500">
                                                <Book size={20} />
                                            </div>
                                            <span className="metadata-precise text-[10px] text-muted-rosegold/50 tracking-widest uppercase">
                                                {book.readTime} min read
                                            </span>
                                        </div>
                                        <span className="metadata-precise text-[8px] text-dream-purple/30 uppercase tracking-[0.3em] mb-2 block">Volume Title</span>
                                        <h3 className="font-serif text-3xl italic text-dream-purple mb-4 leading-tight group-hover:text-cherry transition-colors duration-500">
                                            {book.title}
                                        </h3>
                                        <p className="text-charcoal/40 text-sm line-clamp-2 mb-8 font-serif italic">
                                            {book.synopsis}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-dream-purple/30 group-hover:text-dream-purple transition-colors">
                                                <span className="metadata-precise text-[8px] uppercase tracking-[0.3em]">Edit Manuscript</span>
                                                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <div className="flex items-center gap-1.5 text-cherry/40">
                                                <Heart size={10} className="fill-cherry/10" />
                                                <span className="metadata-precise text-[8px]">{book.likes || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : mode === 'melody' ? (
                                songs.map((song) => (
                                    <div
                                        key={song._id}
                                        onClick={() => handleSelectSong(song)}
                                        className="editorial-card group p-10 cursor-pointer hover:shadow-editorial transition-all border border-cherry/5 hover:border-cherry/20"
                                        style={{ backgroundColor: 'var(--color-glass-bg)' }}
                                    >
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="w-12 h-12 rounded-lg bg-dream-purple/5 flex items-center justify-center text-dream-purple group-hover:bg-cherry group-hover:text-white transition-colors duration-500">
                                                <Music size={20} />
                                            </div>
                                            <span className="metadata-precise text-[10px] text-dream-purple/50 tracking-widest uppercase">
                                                {song.mood}
                                            </span>
                                        </div>
                                        <span className="metadata-precise text-[8px] text-dream-purple/30 uppercase tracking-[0.3em] mb-2 block">Melody Title</span>
                                        <h3 className="font-serif text-3xl italic text-dream-purple mb-4 leading-tight group-hover:text-cherry transition-colors duration-500">
                                            {song.title}
                                        </h3>
                                        <p className="text-charcoal/40 text-sm line-clamp-3 mb-8 font-serif italic">
                                            {song.lyrics}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-dream-purple/30 group-hover:text-cherry transition-colors">
                                                <span className="metadata-precise text-[8px] uppercase tracking-[0.3em]">Edit Lyrics</span>
                                                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <div className="flex items-center gap-1.5 text-cherry/40">
                                                <Heart size={10} className="fill-cherry/10" />
                                                <span className="metadata-precise text-[8px]">{song.likes || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : mode === 'scene' ? (
                                scenes.map((scene) => (
                                    <div 
                                        key={scene._id}
                                        className="editorial-card group p-6 border border-cherry/5"
                                        style={{ backgroundColor: 'var(--color-glass-bg)' }}
                                    >
                                        <div className="aspect-square rounded-xl overflow-hidden mb-6 relative group/img">
                                            <img src={scene.image} alt={scene.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-dream-purple/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="metadata-precise text-[8px] text-white uppercase tracking-widest">Active Scene</span>
                                            </div>
                                        </div>
                                        <h3 className="font-serif text-xl italic text-dream-purple mb-2">{scene.label}</h3>
                                        <div className="flex items-center justify-between text-[8px] metadata-precise text-dream-purple/40">
                                            <span>{scene.url ? 'Linked to Insta' : 'Internal Scene'}</span>
                                            <span className="opacity-40">{new Date(scene.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : null}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.8, ease: editorialEase }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            <div className="lg:col-span-4 space-y-8">
                                <div className="editorial-card p-8 border border-dream-purple/5" style={{ backgroundColor: 'var(--color-glass-bg)' }}>
                                    <h4 className="metadata-precise text-muted-rosegold text-[10px] tracking-[0.4em] uppercase mb-8">
                                        {mode === 'volume' ? 'Chapter Selection' : 'Written Melody'}
                                    </h4>
                                    <div className="space-y-4">
                                        {mode === 'volume' ? (
                                            <>
                                                <button
                                                    onClick={() => handleSelectChapter('new')}
                                                    className={`w-full text-left p-5 rounded-2xl transition-all flex items-center gap-4 ${selectedChapterIndex === 'new' ? 'bg-dream-purple text-white shadow-editorial' : 'hover:bg-dream-purple/5 text-dream-purple/60'}`}
                                                >
                                                    <Plus size={16} />
                                                    <span className="font-serif italic text-lg">New Chapter</span>
                                                </button>
                                                {chapters.map((ch: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSelectChapter(idx)}
                                                        className={`w-full text-left p-5 rounded-2xl transition-all border ${selectedChapterIndex === idx ? 'bg-cherry/5 border-cherry/20 text-cherry' : 'border-transparent hover:bg-dream-purple/5 text-dream-purple/60'}`}
                                                    >
                                                        <div className="font-serif italic text-lg truncate">{ch.header}</div>
                                                        <div className="metadata-precise text-[8px] uppercase opacity-40 mt-1">{ch.content.length} characters</div>
                                                    </button>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="p-4 space-y-6">
                                                <div className="space-y-2">
                                                    <span className="metadata-precise text-[8px] uppercase tracking-widest text-muted-rosegold">Select Mood</span>
                                                    <select
                                                        className="w-full bg-transparent border-b border-dream-purple/10 font-serif italic py-2 outline-none text-dream-purple"
                                                        value={editorContent.mood}
                                                        onChange={(e) => setEditorContent({ ...editorContent, mood: e.target.value })}
                                                    >
                                                        <option>Melancholic</option>
                                                        <option>Ethereal</option>
                                                        <option>Nostalgic</option>
                                                        <option>Whimsical</option>
                                                        <option>Dark</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-8">
                                <div className="editorial-card p-6 md:p-16 shadow-2xl relative overflow-hidden border border-dream-purple/5" style={{ backgroundColor: 'var(--color-glass-bg)' }}>
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-dream-purple via-cherry to-dream-purple opacity-40" />
                                    <div className="space-y-12">
                                        <div>
                                            <span className="metadata-precise text-muted-rosegold/40 text-[9px] uppercase tracking-[0.4em] mb-4 block">
                                                {mode === 'volume' ? 'Book Title' : 'Melody Title'}
                                            </span>
                                            <input
                                                type="text"
                                                placeholder={mode === 'volume' ? "Enter Book Title..." : "Enter Melody Title..."}
                                                className="w-full bg-transparent border-b border-dream-purple/5 pb-4 font-serif text-5xl md:text-6xl outline-none placeholder:text-dream-purple/10 text-dream-purple tracking-tighter italic"
                                                value={editorContent.title}
                                                onChange={(e) => setEditorContent({ ...editorContent, title: e.target.value })}
                                                disabled={mode === 'volume' && !!selectedBook}
                                            />
                                        </div>
                                        <div>
                                            <span className="metadata-precise text-muted-rosegold/40 text-[9px] uppercase tracking-[0.4em] mb-4 block">
                                                {mode === 'volume' ? 'Manuscript Content (Chapter Header + Body)' : mode === 'melody' ? 'Song Lyrics / Poetry' : 'Visual Scene Configuration'}
                                            </span>
                                            {mode === 'scene' ? (
                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <label className="metadata-precise text-[8px] text-muted-rosegold uppercase">Direct Image URL (Unsplash, etc.)</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="https://images.unsplash.com/photo..."
                                                            className="w-full bg-transparent border-b border-dream-purple/10 py-3 font-serif italic text-xl outline-none text-dream-purple"
                                                            value={editorContent.imageUrl}
                                                            onChange={(e) => setEditorContent({ ...editorContent, imageUrl: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="metadata-precise text-[8px] text-muted-rosegold uppercase">Instagram URL (Optional)</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="https://www.instagram.com/p/..."
                                                            className="w-full bg-transparent border-b border-dream-purple/10 py-3 font-serif italic text-xl outline-none text-dream-purple"
                                                            value={editorContent.instaUrl}
                                                            onChange={(e) => setEditorContent({ ...editorContent, instaUrl: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <textarea
                                                    placeholder={mode === 'volume' ? "Begin writing your chapter..." : "Etch your lyrics here..."}
                                                    className="w-full bg-transparent min-h-[500px] font-serif text-xl md:text-2xl leading-[1.8] outline-none text-charcoal/80 placeholder:text-dream-purple/10 custom-scrollbar resize-none"
                                                    value={editorContent.body}
                                                    onChange={(e) => setEditorContent({ ...editorContent, body: e.target.value })}
                                                />
                                            )}
                                        </div>
                                        <div className="pt-12 border-t border-dream-purple/5 flex justify-between items-center">
                                            <div className="flex items-center gap-4 text-muted-rosegold/40">
                                                <Edit3 size={16} />
                                                <span className="metadata-precise text-[10px] uppercase tracking-widest italic">Drafting mode active</span>
                                            </div>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className={`group flex items-center gap-4 ${mode === 'melody' ? 'bg-cherry' : 'bg-dream-purple'} text-white px-12 py-4 rounded-full hover:shadow-editorial transition-all active:scale-95 disabled:opacity-50`}
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                                <span className="font-serif italic text-xl">
                                                    {mode === 'melody' ? 'Save Melody' : mode === 'scene' ? 'Capture Scene' : 'Save to Bookshelf'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Creator;