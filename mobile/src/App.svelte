<script lang="ts">
    import { SplashScreen } from "@capacitor/splash-screen";
    import { onMount } from "svelte";

    let count = $state(0);

    function increment() {
        count += 1;
    }

    onMount(async () => {
        await SplashScreen.hide();
    });
</script>

<main class="font-sans text-center p-8">
    <h1>Hello from Svelte!</h1>

    <p>Clicks: {count}</p>
    <button class="px-4 py-2 text-base cursor-pointer" onclick={increment}>
        Click me
    </button>
</main>
