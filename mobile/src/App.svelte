<script lang="ts">
    import { SplashScreen } from "@capacitor/splash-screen";
    import { onDestroy, onMount } from "svelte";

    let isPlaying = $state<boolean>(false);
    let errorMessage = $state<string>("");

    let audioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;

    async function startLoopback(): Promise<void> {
        errorMessage = "";

        try {
            // 1. Request microphone permissions & get audio stream
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false, // Disabling processing gives raw audio output
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            // 2. Initialize modern Web Audio Context
            const AudioCtx =
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof AudioContext;
                    }
                ).webkitAudioContext;
            audioContext = new AudioCtx();

            // iOS WebKit requires AudioContext to be resumed within a user gesture
            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            // 3. Create media source from the microphone stream
            sourceNode = audioContext.createMediaStreamSource(mediaStream);

            // 4. Connect input directly to speaker output
            sourceNode.connect(audioContext.destination);

            isPlaying = true;
        } catch (err: unknown) {
            console.error("Microphone loopback error:", err);

            if (
                err instanceof DOMException &&
                (err.name === "NotAllowedError" ||
                    err.name === "PermissionDeniedError")
            ) {
                errorMessage = "Microphone permission was denied.";
            } else if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = "Failed to access microphone.";
            }

            stopLoopback();
        }
    }

    function stopLoopback(): void {
        if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
        }

        if (mediaStream) {
            mediaStream
                .getTracks()
                .forEach((track: MediaStreamTrack) => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        isPlaying = false;
    }

    function toggleLoopback(): void {
        if (isPlaying) {
            stopLoopback();
        } else {
            startLoopback();
        }
    }

    onMount(async () => {
        await SplashScreen.hide();
    })

    onDestroy(() => {
        stopLoopback();
    });
</script>

<div class="flex flex-col items-center gap-4 p-6 font-sans">
    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">
        Microphone Monitor
    </h2>

    <button
        onclick={toggleLoopback}
        class={`rounded-lg px-6 py-3 text-base font-semibold text-white transition-colors duration-200 active:scale-95 ${
            isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
        {isPlaying ? "Stop Feedback" : "Start Mic Feedback"}
    </button>

    {#if isPlaying}
        <div
            class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
        >
            <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"
            ></span>
            Listening & Outputting Live
        </div>
    {/if}

    {#if errorMessage}
        <p class="text-sm font-medium text-red-500">{errorMessage}</p>
    {/if}
</div>
