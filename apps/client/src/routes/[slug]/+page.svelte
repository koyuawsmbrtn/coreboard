<script lang="ts">
	import type { PageData } from './$types';
	import SanityBlock from '$lib/components/sanity-block.svelte';

	let { data }: { data: PageData } = $props();

	const { custom, meta } = data;

	const firstWord = custom.title ? custom.title.split(' ')[0] : '';
</script>

<svelte:head>
	<title>{meta.title || custom.title || 'Page'}</title>
	<meta name="description" content={meta.description || ''} />
	<meta property="og:title" content={meta.title || custom.title || ''} />
	<meta property="og:description" content={meta.description || ''} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={meta.url || ''} />
	{#if meta.publishedAt}
		<meta property="article:published_time" content={meta.publishedAt} />
	{/if}
	{#if meta.tags}
		{#each meta.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title || custom.title || ''} />
	<meta name="twitter:description" content={meta.description || ''} />
</svelte:head>

<main class="container mx-auto min-h-screen max-w-3xl md:max-w-4xl p-8 flex flex-col gap-4">
	<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 font-serif">
		{custom.title}
	</h1>

	{#if custom.body}
		<div class="items-start mt-2 mb-8 text-left" style="max-width: 100%;">
			<SanityBlock body={custom.body} />
		</div>
	{/if}
</main>
