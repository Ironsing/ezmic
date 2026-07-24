<script lang="ts">
    let count = $state(0);

    function increment() {
        count += 1;
    }
</script>

<main>
    <h1>Hello from Svelte!</h1>

    <p>Clicks: {count}</p>
    <button onclick={increment}> Click me </button>
</main>

<style>
    main {
        font-family: sans-serif;
        text-align: center;
        padding: 2rem;
    }

    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
    }
</style>
