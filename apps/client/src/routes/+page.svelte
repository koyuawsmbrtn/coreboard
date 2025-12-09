<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import CoverImage from '$lib/components/cover-image.svelte';
	import { formatDate } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { Search, BookOpen, Clock, TrendingUp } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
	let searchQuery = $state('');

	const { knowledgebase, featuredArticles, categories, meta } = data;

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/kb/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function navigateToArticle(slug: string | undefined) {
		if (slug) {
			goto(`/kb/${slug}`);
		}
	}

	function navigateToCategory(slug: string | undefined) {
		if (slug) {
			goto(`/kb/category/${slug}`);
		}
	}

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
</script>

<svelte:head>
	<meta name="description" content={meta.description} />
</svelte:head>

<main class="container mx-auto min-h-screen p-8">
	<!-- Hero Section -->
	<section class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold md:text-5xl">
			{knowledgebase?.heroTitle || 'Knowledgebase'}
		</h1>
		<p class="mb-8 text-lg text-muted-foreground">
			{knowledgebase?.heroSubtitle || 'Find answers and learn with our comprehensive guides'}
		</p>

		<!-- Search Bar -->
		<form onsubmit={handleSearch} class="mx-auto max-w-2xl">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					bind:value={searchQuery}
					placeholder={knowledgebase?.searchPlaceholder || 'Search for articles...'}
					class="pl-10 pr-4 py-6 text-lg"
				/>
				<Button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2">
					Search
				</Button>
			</div>
		</form>
	</section>

	<!-- Featured Articles -->
	{#if knowledgebase?.showFeaturedArticles && featuredArticles.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold flex items-center gap-2">
				<TrendingUp class="h-6 w-6" />
				{knowledgebase?.featuredArticlesTitle || 'Featured Articles'}
			</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each featuredArticles as article}
					<Card class="cursor-pointer transition-shadow hover:shadow-lg" onclick={() => navigateToArticle(article.slug?.current)}>
						{#if article.coverImage?.asset}
							<div class="overflow-hidden rounded-t-lg">
								<CoverImage image={article.coverImage} class="h-48 w-full object-cover" />
							</div>
						{/if}
						<CardHeader>
							<div class="mb-2 flex flex-wrap items-center gap-2">
								{#if article.category}
									<Badge style="background-color: {article.category.color?.value || '#6b7280'}">
										{article.category.name}
									</Badge>
								{/if}
								{#if article.difficulty}
									<Badge variant="outline" class={getDifficultyColor(article.difficulty)}>
										{article.difficulty}
									</Badge>
								{/if}
							</div>
							<CardTitle class="line-clamp-2">{article.title}</CardTitle>
							{#if article.excerpt}
								<CardDescription class="line-clamp-2">{article.excerpt}</CardDescription>
							{/if}
						</CardHeader>
						<CardContent>
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								{#if article.estimatedReadTime}
									<div class="flex items-center gap-1">
										<Clock class="h-4 w-4" />
										<span>{article.estimatedReadTime} min</span>
									</div>
								{/if}
								{#if article.publishedAt}
									<span>{formatDate(new Date(article.publishedAt))}</span>
								{/if}
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Categories Grid -->
	{#if knowledgebase?.showCategories && categories.length > 0}
		<section>
			<h2 class="mb-6 text-2xl font-bold flex items-center gap-2">
				<BookOpen class="h-6 w-6" />
				{knowledgebase?.categoriesTitle || 'Browse by Category'}
			</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each categories as category}
					<Card
						class="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
						onclick={() => navigateToCategory(category.slug?.current)}
					>
						<CardHeader>
							<div class="mb-3 flex items-center gap-3">
								{#if category.icon?.asset}
									<div class="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
										<CoverImage image={category.icon} class="h-full w-full object-cover" />
									</div>
								{:else if category.color}
									<div
										class="h-12 w-12 rounded-lg flex-shrink-0"
										style="background-color: {category.color?.value || '#6b7280'}"
									></div>
								{/if}
								<div class="flex-1 min-w-0">
									<CardTitle class="text-lg line-clamp-1">{category.name}</CardTitle>
									{#if category.articleCount > 0}
										<p class="text-sm text-muted-foreground">
											{category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
										</p>
									{/if}
								</div>
							</div>
							{#if category.description}
								<CardDescription class="line-clamp-2">{category.description}</CardDescription>
							{/if}
						</CardHeader>
					</Card>
				{/each}
			</div>
		</section>
	{/if}
</main>
