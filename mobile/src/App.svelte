<script>
    import { onDestroy } from "svelte";

    let isPlaying = $state(false);
    let errorMessage = $state("");

    let audioContext = null;
    let mediaStream = null;
    let sourceNode = null;

    async function startLoopback() {
        errorMessage = "";

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioCtx();

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            sourceNode = audioContext.createMediaStreamSource(mediaStream);
            sourceNode.connect(audioContext.destination);

            isPlaying = true;
        } catch (err) {
            console.error("Microphone loopback error:", err);
            if (
                err.name === "NotAllowedError" ||
                err.name === "PermissionDeniedError"
            ) {
                errorMessage = "Microphone permission was denied.";
            } else {
                errorMessage = err.message || "Failed to access microphone.";
            }
            stopLoopback();
        }
    }

    function stopLoopback() {
        if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        isPlaying = false;
    }

    function toggleLoopback() {
        if (isPlaying) {
            stopLoopback();
        } else {
            startLoopback();
        }
    }

    onDestroy(() => {
        stopLoopback();
    });
</script>

<div class="flex flex-col items-center gap-4 p-6 font-sans">
  <h2 class="text-lg font-semibold">Microphone Monitor</h2>

  <button
    class="px-6 py-3 text-base font-semibold rounded-lg border-none text-white cursor-pointer transition-colors duration-200 {isPlaying ? 'bg-red-500' : 'bg-blue-500'}"
    onclick={toggleLoopback}
  >
    {isPlaying ? "Stop Feedback" : "Start Mic Feedback"}
  </button>

  {#if isPlaying}
    <div class="flex items-center gap-2 text-sm text-green-500">
      <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
      Listening & Outputting Live
    </div>
  {/if}

  {#if errorMessage}
    <p class="text-red-500 text-sm">{errorMessage}</p>
  {/if}
</div>
