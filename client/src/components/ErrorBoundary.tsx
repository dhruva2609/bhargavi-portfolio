import { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Narrative Tear Detected:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-off-white px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl space-y-12"
          >
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-dream-pink/10 rounded-full flex items-center justify-center text-dream-pink">
                <Feather size={48} className="rotate-45" />
              </div>
            </div>
            
            <div className="space-y-6">
              <span className="metadata-precise text-[10px] tracking-[0.8em] text-muted-rosegold uppercase block">Errata: Volume Missing</span>
              <h1 className="font-serif text-6xl md:text-8xl italic text-dream-purple tracking-tighter leading-none">
                A Tear in the <br /> Narrative
              </h1>
              <p className="font-serif italic text-xl text-charcoal/40 leading-relaxed">
                The fragment you seek has dissolved back into the silence. Perhaps it was never meant to be read in this light.
              </p>
            </div>

            <div className="pt-12">
              <button 
                onClick={() => window.location.href = '/'}
                className="metadata-precise text-[10px] tracking-[0.4em] text-dream-purple hover:text-cherry transition-colors border-b border-dream-purple/20 pb-2 uppercase"
              >
                Return to the Sanctuary
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
