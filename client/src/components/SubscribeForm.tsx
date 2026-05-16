import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2, Mail } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

interface SubscribeFormProps {
    source: string;
    title?: string;
    subtitle?: string;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ 
    source, 
    title = "The Midnight Bulletin", 
    subtitle = "Subscribe to receive a fragment of the narrative whenever a new story is etched into the archive." 
}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [showContactFields, setShowContactFields] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            if (showContactFields) {
                // If contact fields are shown, we use the collaborate endpoint
                await axios.post(`${API_URL}/api/content/collaborate`, {
                    name,
                    email,
                    message,
                    source: `${source} (Contact)`
                });
            } else {
                // Otherwise just subscribe
                await axios.post(`${API_URL}/api/content/subscribe`, {
                    email,
                    source
                });
            }
            
            setStatus('success');
            setEmail('');
            setName('');
            setMessage('');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err: any) {
            console.error("Transmission failed:", err);
            setStatus('error');
            setErrorMessage(err.response?.data?.message || "The connection to the sanctuary was interrupted.");
        }
    };

    return (
        <motion.div
            id="subscribe"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="editorial-card p-8 md:p-12 max-w-2xl mx-auto bg-[#fffafa] shadow-editorial relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Mail size={120} className="text-dream-purple rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <span className="metadata-precise text-muted-rosegold mb-3 block uppercase tracking-[0.4em]">Subscription</span>
                    <h3 className="font-serif text-3xl md:text-5xl italic text-dream-purple mb-4">{title}</h3>
                    <p className="font-serif italic text-charcoal/40 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="sub-email" className="metadata-precise text-[10px] uppercase tracking-[0.3em] text-dream-purple/60 ml-1">Your Email</label>
                        <div className="relative">
                            <input
                                id="sub-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-dream-purple/10 py-4 px-1 font-serif italic text-charcoal text-lg md:text-xl focus:border-cherry focus:outline-none transition-colors duration-500 placeholder:text-charcoal/10"
                                placeholder="Where shall I send the echoes?"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showContactFields && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6 pt-4"
                            >
                                <div className="space-y-2">
                                    <label htmlFor="sub-name" className="metadata-precise text-[10px] uppercase tracking-[0.3em] text-dream-purple/60 ml-1">Your Name</label>
                                    <input
                                        id="sub-name"
                                        type="text"
                                        required={showContactFields}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent border-b border-dream-purple/10 py-4 px-1 font-serif italic text-charcoal text-lg md:text-xl focus:border-cherry focus:outline-none transition-colors duration-500 placeholder:text-charcoal/10"
                                        placeholder="How shall I address you?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="sub-message" className="metadata-precise text-[10px] uppercase tracking-[0.3em] text-dream-purple/60 ml-1">Message</label>
                                    <textarea
                                        id="sub-message"
                                        required={showContactFields}
                                        rows={3}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-transparent border-b border-dream-purple/10 py-4 px-1 font-serif italic text-charcoal text-lg md:text-xl focus:border-cherry focus:outline-none transition-colors duration-500 placeholder:text-charcoal/10 resize-none"
                                        placeholder="Speak your mind..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-6 pt-4">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="toggle-contact"
                                checked={showContactFields}
                                onChange={(e) => setShowContactFields(e.target.checked)}
                                className="accent-cherry w-4 h-4"
                            />
                                <label htmlFor="toggle-contact" className="metadata-precise text-[10px] uppercase tracking-[0.3em] text-dream-purple/60 cursor-pointer">
                                    Also leave a personal message
                                </label>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending' || status === 'success'}
                            className="btn-editorial w-full md:w-auto min-w-[200px] justify-center"
                        >
                            <AnimatePresence mode="wait">
                                {status === 'sending' ? (
                                    <motion.div
                                        key="sending"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Transmitting...</span>
                                    </motion.div>
                                ) : status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check size={14} />
                                        <span>Echoes Secured</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{showContactFields ? 'Send & Subscribe' : 'Join the Bulletin'}</span>
                                        <Send size={12} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        {status === 'error' && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="metadata-precise text-[9px] text-cherry italic text-center"
                            >
                                {errorMessage}
                            </motion.p>
                        )}
                        
                        {status === 'success' && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="metadata-precise text-[9px] text-dream-purple/60 italic"
                            >
                                {showContactFields ? "Your message and subscription have been recorded." : "You have been added to the Midnight Bulletin."}
                            </motion.p>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default SubscribeForm;
