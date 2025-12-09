import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 12;
	const offset = (page - 1) * pageSize;

	if (!query.trim()) {
		return {
			query: '',
			articles: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				pageSize,
				totalArticles: 0,
			},
			meta: {
				title: 'Search - Knowledgebase',
				description: 'Search our knowledgebase',
			},
		};
	}

	try {
		const searchQuery = `{
			"articles": *[
				_type == "article" && (
					title match $searchTerm ||
					excerpt match $searchTerm ||
					pt::text(body) match $searchTerm
				)
			] | order(publishedAt desc) [$offset...$end] {
				_id,
				title,
				slug,
				excerpt,
				coverImage,
				category->{
					name,
					slug,
					color
				},
				tags[]->{
					name,
					slug
				},
				publishedAt,
				estimatedReadTime,
				difficulty
			},
			"totalArticles": count(*[
				_type == "article" && (
					title match $searchTerm ||
					excerpt match $searchTerm ||
					pt::text(body) match $searchTerm
				)
			])
		}`;

		const searchTerm = `*${query}*`;
		const data = await serverClient.fetch(searchQuery, { searchTerm, offset, end: offset + pageSize });

		const totalPages = Math.ceil(data.totalArticles / pageSize);

		return {
			query,
			articles: data.articles || [],
			pagination: {
				currentPage: page,
				totalPages,
				pageSize,
				totalArticles: data.totalArticles,
			},
			meta: {
				title: `Search: ${query} - Knowledgebase`,
				description: `Search results for "${query}"`,
			},
		};
	} catch (err) {
		console.error('Error searching articles:', err);
		throw error(500, 'Failed to search articles');
	}
};
