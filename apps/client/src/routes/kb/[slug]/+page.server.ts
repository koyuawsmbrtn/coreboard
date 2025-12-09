import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	try {
		const query = `{
			"article": *[_type == "article" && slug.current == $slug][0] {
				_id,
				_createdAt,
				_updatedAt,
				title,
				slug,
				excerpt,
				coverImage,
				body,
				category->{
					_id,
					name,
					slug,
					color
				},
				tags[]->{
					_id,
					name,
					slug
				},
				author,
				publishedAt,
				updatedAt,
				difficulty,
				estimatedReadTime,
				relatedArticles[]->{
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
					estimatedReadTime
				}
			},
			"categoryArticles": *[_type == "article" && category._ref == *[_type == "article" && slug.current == $slug][0].category._ref && slug.current != $slug] | order(publishedAt desc) [0...3] {
				_id,
				title,
				slug,
				excerpt,
				coverImage,
				estimatedReadTime
			}
		}`;

		const data = await serverClient.fetch(query, { slug });

		if (!data.article) {
			throw error(404, 'Article not found');
		}

		const article = data.article;

		return {
			article,
			categoryArticles: data.categoryArticles || [],
			meta: {
				title: article.title,
				description: article.excerpt || '',
				publishedAt: article.publishedAt || article._createdAt,
				updatedAt: article.updatedAt || article._updatedAt,
				author: article.author,
				tags: article.tags?.map((t: any) => t.name) || [],
				url: `/kb/${slug}`,
			},
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error('Error loading article:', err);
		throw error(500, 'Failed to load article');
	}
};
