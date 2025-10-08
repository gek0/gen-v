import React, { useState, useCallback } from 'react';
import { generateVideo } from './services/geminiService';

// --- UI Helper Components ---

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <svg
            className="animate-spin h-10 w-10 text-cyan-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        <p className="text-lg text-gray-300 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
            Video generation can take several minutes. Please be patient.
        </p>
    </div>
);

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => (
    <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in">
        <video src={src} controls autoPlay loop muted className="w-full h-auto" />
        <div className="p-4 text-center">
            <a
                href={src}
                download="generated-video.mp4"
                className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
                Download Video
            </a>
        </div>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="w-full max-w-2xl p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg shadow-lg">
        <p className="font-bold">An Error Occurred</p>
        <p className="text-sm mt-1">{message}</p>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
    const initialPrompt =
        'a cinematic shot of a labrador retriever from FPV perspective, running down the road to the sunset. 5 second shot at maximum';
    const [apiKey, setApiKey] = useState<string>('');
    const [prompt, setPrompt] = useState<string>(initialPrompt);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const handleGenerateClick = useCallback(async () => {
        if (!prompt.trim() || !apiKey.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingMessage('Warming up the studio...');

        try {
            const url = await generateVideo(prompt, apiKey, (message) => {
                setLoadingMessage(message);
            });
            setVideoUrl(url);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, apiKey, isLoading]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
                <header className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
                        Cinematic Video Generator
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Bring your creative vision to life with AI-powered video generation.
                    </p>
                </header>

                <main className="w-full max-w-2xl p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="api-key-input" className="text-lg font-semibold text-gray-300">
                            API Key
                        </label>
                        <input
                            id="api-key-input"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API Key"
                            type="text"
                            className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                            disabled={isLoading}
                        />

                        <label htmlFor="prompt-input" className="text-lg font-semibold text-gray-300">
                            Describe your scene
                        </label>
                        <textarea
                            id="prompt-input"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A majestic eagle soaring over snow-capped mountains"
                            className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none"
                            rows={4}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerateClick}
                            disabled={isLoading || !prompt.trim() || !apiKey.trim()}
                            className="w-full py-3 px-6 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/50"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                'Generate Video'
                            )}
                        </button>
                    </div>
                </main>

                <section className="w-full max-w-2xl min-h-[300px] flex items-center justify-center">
                    {isLoading && <LoadingIndicator message={loadingMessage} />}
                    {error && <ErrorMessage message={error} />}
                    {videoUrl && !isLoading && <VideoPlayer src={videoUrl} />}
                    {!isLoading && !error && !videoUrl && (
                        <div className="text-center text-gray-500">
                            <p>Your generated video will appear here.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default App;