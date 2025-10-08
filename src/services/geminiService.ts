import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A helper function to introduce a delay between polling requests
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a video based on a text prompt using the Gemini API.
 * @param prompt The text prompt describing the video to generate.
 * @param onProgress A callback function to report progress updates to the UI.
 * @returns A promise that resolves to a local blob URL for the generated video.
 */
export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
    try {
        onProgress("Initializing video generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });
        onProgress("Operation started. This may take a few minutes...");

        let pollCount = 0;
        while (!operation.done) {
            pollCount++;
            onProgress(`Processing... (Status check ${pollCount})`);
            await sleep(10000); // Wait 10 seconds before checking the status again
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        onProgress("Finalizing video render...");
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Failed to retrieve video download link from the operation response.");
        }

        onProgress("Downloading video data...");
        // The API requires the API key to be appended to the download link for authentication
        const videoUrlWithKey = `${downloadLink}&key=${process.env.API_KEY}`;
        const response = await fetch(videoUrlWithKey);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to download video file: ${response.statusText} - ${errorBody}`);
        }

        onProgress("Creating local video URL...");
        const videoBlob = await response.blob();
        const blobUrl = URL.createObjectURL(videoBlob);

        return blobUrl;
    } catch (error) {
        console.error("Error during video generation:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};