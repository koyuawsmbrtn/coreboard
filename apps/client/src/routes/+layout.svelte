<script lang="ts">
	import { VisualEditing } from '@sanity/visual-editing/svelte';
	import { LiveMode } from '@sanity/svelte-loader';
	import { client } from '$lib/sanity';
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import Navbar, { type NavigationItem } from '$lib/components/navbar.svelte';
	let { children, data } = $props();
</script>

<svelte:head>
	<title>{data.settings?.title || 'Website'}</title>
	<meta name="description" content={data.settings?.description || ''} />
	<meta property="og:title" content={data.settings?.longTitle || data.settings?.title || ''} />
	<meta property="og:description" content={data.settings?.description || ''} />
	<meta name="twitter:title" content={data.settings?.longTitle || data.settings?.title || ''} />
	<meta name="twitter:description" content={data.settings?.description || ''} />
	<meta name="robots" content="index, follow" />
	{#if data.logo}
		<link rel="icon" href={data.logo.url} />
		<link rel="apple-touch-icon" href={data.logo.url} />
	{/if}
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="scroll-smooth font-sans antialiased">
	<Navbar settings={data.settings} items={data.navigation} />
	<main id="main-content" tabindex="-1" class="min-h-[calc(100vh-11.3rem)] md:min-h-[calc(100vh-9.05rem)] focus:outline-none">
		{@render children()}
	</main>
	{#if data.settings}
		<Footer settings={data.settings} />
	{/if}
	{#if data.preview}
		<VisualEditing />
		<LiveMode {client} />
	{/if}
</div>
