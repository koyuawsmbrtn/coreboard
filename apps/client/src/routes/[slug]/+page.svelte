<script lang="ts">
	import type { PageData } from './$types';
	import SanityBlock from '$lib/components/sanity-block.svelte';
	import CoverImage from '$lib/components/cover-image.svelte';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { ChevronRight, Clock, Calendar, User, Tag, BookOpen, ArrowLeft } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const { article, categoryArticles, meta } = data;

	const publishedDate = article.publishedAt
		? new Date(article.publishedAt)
		: new Date(article._createdAt);
	const updatedDate = article.updatedAt ? new Date(article.updatedAt) : null;
	const formattedPublished = formatDate ? formatDate(publishedDate) : publishedDate.toLocaleDateString();
	const formattedUpdated = updatedDate && formatDate ? formatDate(updatedDate) : updatedDate?.toLocaleDateString();

	function getDifficultyColor(difficulty: string | undefined) {
		switch (difficulty) {
			case 'beginner':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'intermediate':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
			case 'advanced':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
		}
	}

	function navigateToArticle(slug: string | undefined) {
		if (slug) {
			goto(`/${slug}`);
		}
	}

	function navigateToCategory(slug: string | undefined) {
		if (slug) {
			goto(`/category/${slug}`);
		}
	}

	function navigateToTag(slug: string | undefined) {
		if (slug) {
			goto(`/tag/${slug}`);
		}
	}
</script>

<svelte:head>
	<title>{meta.title || article.title || 'Article'}</title>
	<meta name="description" content={meta.description || ''} />
	<meta property="og:title" content={meta.title || article.title || ''} />
	<meta property="og:description" content={meta.description || ''} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={meta.url || ''} />
	{#if meta.publishedAt}
		<meta property="article:published_time" content={meta.publishedAt} />
	{/if}
	{#if meta.updatedAt}
		<meta property="article:modified_time" content={meta.updatedAt} />
	{/if}
	{#if meta.author}
		<meta property="article:author" content={meta.author} />
	{/if}
	{#if meta.tags}
		{#each meta.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title || article.title || ''} />
	<meta name="twitter:description" content={meta.description || ''} />
</svelte:head>

<main class="container mx-auto flex min-h-screen max-w-5xl flex-col gap-8 p-8">
	<!-- Back Button -->
	<div>
		<Button variant="ghost" onclick={() => goto('/')} class="gap-2">
			<ArrowLeft class="h-4 w-4" />
			Back to Knowledgebase
		</Button>
	</div>

	<!-- Breadcrumbs -->
	<nav class="flex items-center gap-2 text-sm text-muted-foreground">
		<a href="/" class="hover:text-foreground">Knowledgebase</a>
		{#if article.category}
			<ChevronRight class="h-4 w-4" />
			<button onclick={() => navigateToCategory(article.category.slug?.current)} class="hover:text-foreground">
				{article.category.name}
			</button>
		{/if}
		<ChevronRight class="h-4 w-4" />
		<span class="text-foreground">{article.title}</span>
	</nav>

	<article>
		<!-- Header -->
		<header class="mb-8">
			<div class="mb-4 flex flex-wrap items-center gap-2">
				{#if article.category}
					<Badge
						style="background-color: {article.category.color?.value || '#6b7280'}"
						class="cursor-pointer"
						onclick={() => navigateToCategory(article.category.slug?.current)}
					>
						{article.category.name}
					</Badge>
				{/if}
				{#if article.difficulty}
					<Badge variant="outline" class={getDifficultyColor(article.difficulty)}>
						{article.difficulty}
					</Badge>
				{/if}
			</div>

			<h1 class="mb-4 text-4xl font-bold md:text-5xl">{article.title}</h1>

			{#if article.excerpt}
				<p class="mb-6 text-xl text-muted-foreground break-all">{article.excerpt}</p>
			{/if}

			<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				{#if article.author}
					<div class="flex items-center gap-2">
						<User class="h-4 w-4" />
						<span>{article.author}</span>
					</div>
				{/if}
				{#if article.estimatedReadTime}
					<div class="flex items-center gap-2">
						<Clock class="h-4 w-4" />
						<span>{article.estimatedReadTime} min read</span>
					</div>
				{/if}
				<div class="flex items-center gap-2">
					<Calendar class="h-4 w-4" />
					<span>Published {formattedPublished}</span>
				</div>
				{#if updatedDate && formattedUpdated}
					<div class="flex items-center gap-2">
						<Calendar class="h-4 w-4" />
						<span>Updated {formattedUpdated}</span>
					</div>
				{/if}
			</div>
		</header>

		<!-- Cover Image -->
		{#if article.coverImage?.asset}
			<div class="mb-8 overflow-hidden rounded-lg">
				<CoverImage image={article.coverImage} class="h-64 w-full object-cover md:h-96" />
			</div>
		{/if}

		<!-- Content -->
		<div class="prose prose-lg dark:prose-invert mx-auto mb-8 max-w-none break-all">
			{#if article.body}
				<SanityBlock body={article.body} />
			{/if}
		</div>

		<Separator class="my-8" />

		<!-- Tags -->
		{#if article.tags && article.tags.length > 0}
			<div class="mb-8">
				<h3 class="mb-3 flex items-center gap-2 text-lg font-semibold">
					<Tag class="h-5 w-5" />
					Tags
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each article.tags as tag}
						<Badge
							variant="secondary"
							class="cursor-pointer"
							onclick={() => navigateToTag(tag.slug?.current)}
						>
							{tag.name}
						</Badge>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Related Articles -->
		{#if article.relatedArticles && article.relatedArticles.length > 0}
			<section class="mb-8">
				<h2 class="mb-4 text-2xl font-bold">Related Articles</h2>
				<div class="grid gap-4 md:grid-cols-2">
					{#each article.relatedArticles as related}
						<Card class="cursor-pointer transition-shadow hover:shadow-lg" onclick={() => navigateToArticle(related.slug?.current)}>
							{#if related.coverImage?.asset}
								<div class="overflow-hidden rounded-t-lg">
									<CoverImage image={related.coverImage} class="h-32 w-full object-cover" />
								</div>
							{/if}
							<CardHeader>
								{#if related.category}
									<Badge style="background-color: {related.category.color?.value || '#6b7280'}" class="mb-2 w-fit">
										{related.category.name}
									</Badge>
								{/if}
								<CardTitle class="line-clamp-2 text-lg">{related.title}</CardTitle>
								{#if related.excerpt}
									<CardDescription class="line-clamp-2">{related.excerpt}</CardDescription>
								{/if}
							</CardHeader>
							{#if related.estimatedReadTime}
								<CardContent>
									<div class="flex items-center gap-1 text-sm text-muted-foreground">
										<Clock class="h-4 w-4" />
										<span>{related.estimatedReadTime} min</span>
									</div>
								</CardContent>
							{/if}
						</Card>
					{/each}
				</div>
			</section>
		{/if}

		<!-- More from Category -->
		{#if categoryArticles && categoryArticles.length > 0}
			<section>
				<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold">
					<BookOpen class="h-6 w-6" />
					More from {article.category?.name}
				</h2>
				<div class="grid gap-4 md:grid-cols-3">
					{#each categoryArticles as catArticle}
						<Card class="cursor-pointer transition-shadow hover:shadow-lg" onclick={() => navigateToArticle(catArticle.slug?.current)}>
							{#if catArticle.coverImage?.asset}
								<div class="overflow-hidden rounded-t-lg">
									<CoverImage image={catArticle.coverImage} class="h-32 w-full object-cover" />
								</div>
							{/if}
							<CardHeader>
								<CardTitle class="line-clamp-2 text-base">{catArticle.title}</CardTitle>
								{#if catArticle.excerpt}
									<CardDescription class="line-clamp-2 text-sm">{catArticle.excerpt}</CardDescription>
								{/if}
							</CardHeader>
							{#if catArticle.estimatedReadTime}
								<CardContent>
									<div class="flex items-center gap-1 text-sm text-muted-foreground">
										<Clock class="h-4 w-4" />
										<span>{catArticle.estimatedReadTime} min</span>
									</div>
								</CardContent>
							{/if}
						</Card>
					{/each}
				</div>
			</section>
		{/if}
	</article>
</main>
