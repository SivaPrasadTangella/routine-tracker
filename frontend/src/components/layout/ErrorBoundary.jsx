import React from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-950 dark:to-red-950/20">
                    <div className="glass-card max-w-lg w-full p-8 md:p-12 text-center rounded-3xl border border-red-200 dark:border-red-900/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-xl shadow-red-200/50 dark:shadow-none animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-6 mx-auto text-red-600 dark:text-red-400">
                            <AlertTriangle size={40} />
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Something went wrong</h1>
                        <p className="text-slate-500 dark:text-zinc-400 mb-6 font-medium">
                            We're sorry, but the application encountered an unexpected error.
                        </p>
                        <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl mb-8 border border-red-100 dark:border-red-500/20">
                            <code className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                                {this.state.error?.toString() || "Unknown Error"}
                            </code>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                className="shadow-lg shadow-red-500/20 bg-red-600 hover:bg-red-700 text-white"
                            >
                                <RefreshCcw size={18} className="mr-2" />
                                Reload Page
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/'}
                                className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                            >
                                <Home size={18} className="mr-2" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
