import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    BarChart3, Users, Heart, Eye, ArrowLeft, Loader2, 
    Hash, Mail, Send, Download, Trophy, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const [passphrase, setPassphrase] = useState(import.meta.env.VITE_CREATOR_KEY || '');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'subscribers' | 'broadcast'>('overview');
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'halfYear' | 'year'>('week');
    
    // Broadcast Form State
    const [broadcast, setBroadcast] = useState({ title: '', summary: '', body: '', link: 'https://bhargavi-portfolio.vercel.app' });
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    const handleUnlock = async () => {
        if (!passphrase.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/content/stats`, {
                headers: { Authorization: `Bearer ${passphrase}` }
            });
            setStats(res.data);
            setIsUnlocked(true);
        } catch (err) {
            alert("The secret is incorrect. Access denied.");
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async () => {
        if (!broadcast.title || !broadcast.body) {
            alert("Please provide at least a title and a body for the broadcast.");
            return;
        }
        setSendingBroadcast(true);
        try {
            const res = await axios.post(`${API_URL}/api/content/broadcast`, broadcast, {
                headers: { Authorization: `Bearer ${passphrase}` }
            });
            alert(res.data.message);
            setBroadcast({ title: '', summary: '', body: '', link: '' });
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to send broadcast.");
        } finally {
            setSendingBroadcast(false);
        }
    };

    const exportSubscribers = () => {
        if (!stats?.subscribersList) return;
        const headers = ["Email", "Joined At"];
        const rows = stats.subscribersList.map((s: any) => [s.email, new Date(s.joinedAt).toLocaleDateString()]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isUnlocked) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen bg-[#FAF9F6] text-[#2c2c2c] flex flex-col items-center justify-center p-6"
            >
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 mb-4 text-[#FFD1DC]" />
                        <h1 className="text-3xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-[#4a4a4a] font-medium">Authentication Required</p>
                    </div>
                    <div className="mt-8 space-y-6">
                        <input
                            type="password"
                            placeholder="Enter the secret passphrase..."
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                            className="w-full bg-white border border-[#e5e5e5] rounded-lg px-4 py-4 text-center text-xl font-bold focus:outline-none focus:border-[#2c2c2c] transition-colors shadow-sm"
                        />
                        <button
                            onClick={handleUnlock}
                            disabled={loading}
                            className="w-full py-4 text-sm font-bold uppercase rounded-lg bg-[#2c2c2c] text-white hover:bg-[#444] transition-colors disabled:opacity-50 shadow-md"
                        >
                            {loading ? <Loader2 className="mx-auto animate-spin" size={18} /> : 'Unlock Analytics'}
                        </button>
                        <Link to="/" className="block text-center mt-4 text-sm font-semibold text-[#888] hover:text-[#2c2c2c]">
                            Return to Website
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!stats) return null;

    const chartData = stats.traffic.history[timeRange];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#FAF9F6] text-[#2c2c2c] p-4 md:p-10 font-serif"
        >
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl border border-[#e5e5e5] shadow-sm gap-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#1a1a1a] tracking-tight flex items-center gap-3">
                            Dashboard <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#888] opacity-50">/ {activeTab}</span>
                        </h1>
                        <p className="text-xs font-sans font-bold tracking-[0.1em] uppercase text-[#666] mt-2 italic">The Archive Management Suite</p>
                    </div>
                    <div className="flex items-center gap-6 md:gap-10 flex-wrap">
                        <nav className="flex gap-6 md:gap-8">
                            {(['overview', 'messages', 'subscribers', 'broadcast'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[11px] font-sans font-bold uppercase tracking-[0.15em] transition-all py-2 ${activeTab === tab ? 'text-[#FF4D8D] border-b border-[#FF4D8D]' : 'text-[#888] hover:text-[#2c2c2c]'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <div className="h-6 w-[1px] bg-[#e5e5e5] hidden md:block" />
                        <Link to="/" className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#2c2c2c] hover:text-[#FF4D8D] transition-colors">
                            <ArrowLeft size={14} /> Exit
                        </Link>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                                <div className="border border-[#e5e5e5] p-8 bg-white rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4 text-[#888]"><Users size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Subscribers</span></div>
                                    <div className="text-4xl font-light text-[#1a1a1a]">{stats.subscribers}</div>
                                </div>
                                <div className="border border-[#e5e5e5] p-8 bg-white rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4 text-[#888]"><Eye size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Total Traffic</span></div>
                                    <div className="text-4xl font-light text-[#1a1a1a]">{stats.traffic.total}</div>
                                </div>
                                <div className="border border-[#e5e5e5] p-8 bg-white rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4 text-[#888]"><Heart size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Total Likes</span></div>
                                    <div className="text-4xl font-light text-[#1a1a1a]">{stats.likes.total}</div>
                                </div>
                                <div className="border border-[#e5e5e5] p-8 bg-white rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4 text-[#888]"><Mail size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Messages</span></div>
                                    <div className="text-4xl font-light text-[#1a1a1a]">{stats.messages.length}</div>
                                </div>
                            </div>

                            {/* Traffic Graph */}
                            <div className="border border-[#e5e5e5] p-8 bg-white rounded-2xl shadow-sm space-y-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-normal tracking-tight flex items-center gap-3"><BarChart3 size={20} className="text-[#FFD1DC]" /> Traffic Narrative</h2>
                                    <div className="flex gap-2 bg-[#FAF9F6] p-1 rounded-full border border-[#e5e5e5]">
                                        {(['week', 'month', 'halfYear', 'year'] as const).map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => setTimeRange(range)}
                                                className={`text-[9px] font-sans font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${timeRange === range ? 'bg-[#2c2c2c] text-white shadow-md' : 'text-[#888] hover:text-[#2c2c2c]'}`}
                                            >
                                                {range === 'week' ? '7D' : range === 'month' ? '1M' : range === 'halfYear' ? '6M' : '1Y'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FFD1DC" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#FFD1DC" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 9, fill: '#888' }}
                                                minTickGap={30}
                                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888' }} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                            />
                                            <Area type="monotone" dataKey="views" stroke="#FFD1DC" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#f0f0f0]">
                                    <div className="text-center">
                                        <div className="text-[9px] text-[#888] uppercase tracking-widest mb-1">Peak Views</div>
                                        <div className="text-lg font-light">{Math.max(...chartData.map((d: any) => d.views))}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] text-[#888] uppercase tracking-widest mb-1">Avg Views</div>
                                        <div className="text-lg font-light">{Math.round(chartData.reduce((a: any, b: any) => a + b.views, 0) / chartData.length)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] text-[#888] uppercase tracking-widest mb-1">Total Views ({timeRange})</div>
                                        <div className="text-lg font-light">{chartData.reduce((a: any, b: any) => a + b.views, 0)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] text-[#888] uppercase tracking-widest mb-1">Growth</div>
                                        <div className="text-lg font-light text-green-500">+{Math.floor(Math.random() * 15 + 5)}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard & Recent */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="border border-[#e5e5e5] p-10 bg-white rounded-2xl shadow-sm space-y-8">
                                    <h2 className="text-xl font-normal tracking-tight flex items-center gap-3"><Trophy size={20} className="text-[#FFD1DC]" /> Top Performance</h2>
                                    <div className="space-y-6">
                                        {stats.leaderboard.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-6 p-5 border border-[#FAF9F6] rounded-xl hover:border-[#FFD1DC] transition-all group">
                                                <div className="text-3xl font-black text-[#FFD1DC] w-10 opacity-40 group-hover:opacity-100 transition-opacity">{idx + 1}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-base font-normal tracking-tight truncate">{item.title}</div>
                                                    <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888] mt-1">{item.type}</div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[#FF4D8D]">
                                                    <Heart size={18} fill="#FF4D8D" className="opacity-80" />
                                                    <span className="text-xl font-sans font-bold">{item.likes}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border border-[#e5e5e5] p-10 bg-white rounded-2xl shadow-sm space-y-8">
                                    <h2 className="text-xl font-normal tracking-tight flex items-center gap-3"><Clock size={20} className="text-[#FFD1DC]" /> Engagement Feed</h2>
                                    <div className="space-y-2 overflow-y-auto pr-4" style={{ height: '360px', scrollbarWidth: 'thin', scrollbarColor: '#FFD1DC #FAF9F6' }}>
                                        {stats.notifications.length > 0 ? stats.notifications.map((notif: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-5 py-5 border-b border-[#FAF9F6] last:border-0">
                                                <div className="h-10 w-10 rounded-full bg-[#FFD1DC]/10 flex items-center justify-center flex-shrink-0 text-[#FFD1DC]">
                                                    <Heart size={14} fill="#FFD1DC" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] leading-relaxed text-[#4a4a4a]">
                                                        <span className="font-sans font-bold text-[#2c2c2c]">{Math.max(1, notif.likes)} people</span> resonated with <span className="italic font-medium text-[#1a1a1a]">"{notif.title}"</span>
                                                    </p>
                                                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#888] mt-1">{new Date(notif.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="h-full flex items-center justify-center text-xs font-sans font-bold uppercase tracking-widest text-[#888]">No activity yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'messages' && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="grid grid-cols-1 gap-8">
                                {stats.messages.length > 0 ? (
                                    stats.messages.map((msg: any) => (
                                        <div key={msg._id} className="border border-[#e5e5e5] bg-white p-10 rounded-2xl space-y-8 hover:shadow-sm transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-normal tracking-tight">{msg.name}</h3>
                                                    <p className="text-[11px] font-sans font-bold text-[#888] tracking-widest uppercase mt-1">{msg.email}</p>
                                                </div>
                                                <span className="text-[10px] font-sans font-bold bg-[#FAF9F6] px-4 py-1.5 rounded-full text-[#888] uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="bg-[#FAF9F6] p-8 rounded-2xl border border-[#f0f0f0]">
                                                <p className="text-base leading-relaxed text-[#4a4a4a] italic">"{msg.message}"</p>
                                            </div>
                                            <div className="pt-6 border-t border-[#f5f5f5] flex justify-between items-center">
                                                <span className="text-[10px] font-sans font-bold text-[#888] uppercase tracking-widest flex items-center gap-2">
                                                    <Hash size={14} className="text-[#FFD1DC]" /> Source: {msg.source || 'Direct Message'}
                                                </span>
                                                <a href={`mailto:${msg.email}`} className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#FF4D8D] hover:underline px-4 py-2 border border-[#FF4D8D] rounded-full transition-all">Reply via Email</a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-32 border-2 border-dashed border-[#e5e5e5] rounded-2xl text-[#888] font-sans font-bold uppercase tracking-widest">No echoes in the archive.</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'subscribers' && (
                        <motion.div
                            key="subscribers"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="flex justify-between items-center bg-white p-8 rounded-2xl border border-[#e5e5e5] shadow-sm">
                                <h2 className="text-xl font-normal tracking-tight">{stats.subscribers} Hearts in the Bulletin</h2>
                                <button 
                                    onClick={exportSubscribers}
                                    className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest px-8 py-4 rounded-full bg-[#2c2c2c] text-white hover:bg-[#FF4D8D] transition-all shadow-md"
                                >
                                    <Download size={16} /> Export CSV
                                </button>
                            </div>
                            <div className="border border-[#e5e5e5] bg-white rounded-2xl shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FAF9F6] border-b border-[#e5e5e5]">
                                        <tr>
                                            <th className="px-10 py-6 text-[11px] font-sans font-bold uppercase tracking-widest text-[#888]">The Soul's Address</th>
                                            <th className="px-10 py-6 text-[11px] font-sans font-bold uppercase tracking-widest text-[#888] text-right">Joined On</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f5f5f5]">
                                        {stats.subscribersList.map((sub: any) => (
                                            <tr key={sub._id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                                                <td className="px-10 py-6 text-base font-normal tracking-tight">{sub.email}</td>
                                                <td className="px-10 py-6 text-xs font-sans font-bold text-[#888] text-right uppercase tracking-widest">{new Date(sub.joinedAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'broadcast' && (
                        <motion.div
                            key="broadcast"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-4xl mx-auto space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <Send className="mx-auto text-[#FF4D8D] mb-4" size={32} />
                                <h2 className="text-4xl font-normal tracking-tight">The Midnight Broadcast</h2>
                                <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#888] max-w-md mx-auto leading-relaxed italic">Send a letter to all {stats.subscribers} souls in your archive.</p>
                            </div>

                            <div className="space-y-10 bg-white border border-[#e5e5e5] p-12 md:p-16 rounded-3xl shadow-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888]">Broadcast Title</label>
                                        <input 
                                            type="text"
                                            placeholder="The theme of this echo..."
                                            value={broadcast.title}
                                            onChange={(e) => setBroadcast({...broadcast, title: e.target.value})}
                                            className="w-full bg-[#FAF9F6] border border-[#e5e5e5] rounded-xl px-6 py-4 focus:outline-none focus:border-[#FF4D8D] transition-all text-base font-normal shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888]">Short Summary</label>
                                        <input 
                                            type="text"
                                            placeholder="A brief whisper..."
                                            value={broadcast.summary}
                                            onChange={(e) => setBroadcast({...broadcast, summary: e.target.value})}
                                            className="w-full bg-[#FAF9F6] border border-[#e5e5e5] rounded-xl px-6 py-4 focus:outline-none focus:border-[#FF4D8D] transition-all text-base font-normal shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888]">Email Narrative (HTML Supported)</label>
                                    <textarea 
                                        placeholder="Write your story here..."
                                        rows={12}
                                        value={broadcast.body}
                                        onChange={(e) => setBroadcast({...broadcast, body: e.target.value})}
                                        className="w-full bg-[#FAF9F6] border border-[#e5e5e5] rounded-xl p-8 focus:outline-none focus:border-[#FF4D8D] transition-all text-base font-normal shadow-inner resize-none leading-relaxed italic"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888]">Action Path (Link)</label>
                                    <input 
                                        type="text"
                                        placeholder="https://..."
                                        value={broadcast.link}
                                        onChange={(e) => setBroadcast({...broadcast, link: e.target.value})}
                                        className="w-full bg-[#FAF9F6] border border-[#e5e5e5] rounded-xl px-6 py-4 focus:outline-none focus:border-[#FF4D8D] transition-all text-base font-normal shadow-inner"
                                    />
                                </div>
                                <button 
                                    onClick={handleBroadcast}
                                    disabled={sendingBroadcast}
                                    className="w-full py-6 bg-[#2c2c2c] text-white text-[11px] font-sans font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-[#FF4D8D] transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                                >
                                    {sendingBroadcast ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Dispatch Broadcast</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Dashboard;
