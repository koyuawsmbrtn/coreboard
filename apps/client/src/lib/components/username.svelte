<script lang="ts">
    import { authClient, getBadges } from "$lib/auth";
	import { onMount } from "svelte";

    export let name: string;
    export let badges: string[] = [];
    
    onMount(async () => {
        const session = await authClient.getSession();
        const user = session?.data?.user;
        if (user && user.name) {
            name = user.name;
        }
        if (user && getBadges) {
            badges = await getBadges();
        }
    });
</script>

<span>
    {name}
    {#if badges.includes("VERIFIED")}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-blue-500 inline"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path></svg>
    {/if}
    {#if badges.includes("EARLY_SUPPORTER")}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="w-5 h-5 inline"><defs><linearGradient id="early-adopter-gradient" gradientTransform="rotate(45)"><stop offset="0%" stop-color="#3B82F6"></stop><stop offset="100%" stop-color="#6366F1"></stop></linearGradient></defs><path fill="url(#early-adopter-gradient)" d="M560 128C573.2 128 580.7 143.1 572.8 153.6L544 192L544 368C544 447.5 479.5 512 400 512L288 512L241.7 558.3C231.3 568.7 215.2 570.7 202.6 563.1L105.5 504.9C88.5 494.7 90.5 469.4 108.9 462L224 416C87.8 375.1 71.5 233.8 86 159.7C89.6 141.9 109.3 135.4 125.3 144.2L384 288L384 208C384 163.8 419.8 128 464 128L560 128zM464 184C450.7 184 440 194.7 440 208C440 221.3 450.7 232 464 232C477.3 232 488 221.3 488 208C488 194.7 477.3 184 464 184zM246.5 54.4C258.9 40.7 279.8 45.5 289 61.5L345.4 159.8C339.6 174.2 336.2 189.9 336 206.3L202.1 132C212.2 100.4 229.1 73.6 246.5 54.4z"></path></svg>
    {/if}
    {#if badges.includes("BUG_HUNTER")}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-500 inline"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"/></svg>
    {/if}
    {#if badges.includes("CREATOR")}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-red-600 inline"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/></svg>
    {/if}
</span>