<script lang="ts">
    import { onMount } from 'svelte';

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            localStorage.setItem('auth_token', code);
            window.location.href = '/';
        }
    });
</script>