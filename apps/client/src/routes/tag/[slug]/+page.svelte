<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import CoverImage from '$lib/components/cover-image.svelte';
	import { formatDate } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ChevronRight, ChevronLeft, Clock, ArrowLeft, Tag } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const { tag, articles, pagination, meta } = data;

	function createPageUrl(pageNum: number): string {
		const url = new URL($page.url);
		if (pageNum === 1) {
			url.searchParams.delete('page');
		} else {
			url.searchParams.set('page', pageNum.toString());
		}
		return url.pathname + url.search;
	}

	function getVisiblePages(): (number | 'ellipsis')[] {
		const { currentPage, totalPages } = pagination;
		const pages: (number | 'ellipsis')[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage <= 4) {
				for (let i = 2; i <= 5; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 3) {
				pages.push('ellipsis');
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push('ellipsis');
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			}
		}

		return pages;
	}

	function navigateToArticle(slug: string | undefined) {
		if (slug) {
			goto(`/${slug}`);
		}
	}

	function getDifficultyColor(difficulty: string): string {
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
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>

<main class="container mx-auto min-h-screen p-8">
	<!-- Back Button -->
	<div class="mb-6">
		<Button variant="ghost" onclick={() => goto('/')} class="gap-2">
			<ArrowLeft class="h-4 w-4" />
			Back to Knowledgebase
		</Button>
	</div>

	<!-- Breadcrumbs -->
	<nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
		<a href="/" class="hover:text-foreground">Knowledgebase</a>
		<ChevronRight class="h-4 w-4" />
		<span class="text-foreground">Tag: {tag.name}</span>
	</nav>

	<!-- Tag Header -->
	<header class="mb-8">
		<div class="flex items-center gap-3 mb-4">
			<Tag class="h-8 w-8" />
			<h1 class="text-4xl font-bold">{tag.name}</h1>
		</div>
		<p class="text-muted-foreground">
			{pagination.totalArticles} {pagination.totalArticles === 1 ? 'article' : 'articles'} tagged with "{tag.name}"
		</p>
	</header>

	<!-- Articles Grid -->
	{#if articles.length > 0}
		<section class="mb-8">
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each articles as article}
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
							<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
							{#if article.tags && article.tags.length > 1}
								<div class="mt-3 flex flex-wrap gap-1">
									{#each article.tags.filter((t: typeof article.tags[0]) => t.slug?.current !== tag.slug?.current).slice(0, 3) as otherTag}
										<Badge variant="secondary" class="text-xs">
											{otherTag.name}
										</Badge>
									{/each}
								</div>
							{/if}
						</CardContent>
					</Card>
				{/each}
			</div>
		</section>

		<!-- Pagination -->
		{#if pagination.totalPages > 1}
			<nav class="flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={pagination.currentPage === 1}
					onclick={() => goto(createPageUrl(pagination.currentPage - 1))}
				>
					<ChevronLeft class="h-4 w-4" />
					Previous
				</Button>

				{#each getVisiblePages() as pageItem}
					{#if pageItem === 'ellipsis'}
						<span class="px-2">...</span>
					{:else}
						<Button
							variant={pageItem === pagination.currentPage ? 'default' : 'outline'}
							size="sm"
							onclick={() => goto(createPageUrl(pageItem))}
						>
							{pageItem}
						</Button>
					{/if}
				{/each}

				<Button
					variant="outline"
					size="sm"
					disabled={pagination.currentPage === pagination.totalPages}
					onclick={() => goto(createPageUrl(pagination.currentPage + 1))}
				>
					Next
					<ChevronRight class="h-4 w-4" />
				</Button>
			</nav>
		{/if}
	{:else}
		<div class="text-center py-12">
			<p class="text-lg text-muted-foreground">No articles found with this tag.</p>
		</div>
	{/if}
</main>
