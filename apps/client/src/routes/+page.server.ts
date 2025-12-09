import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const query = `{
			"knowledgebase": *[_type == "knowledgebase" && _id == "knowledgebase"][0] {
				title,
				heroTitle,
				heroSubtitle,
				searchPlaceholder,
				showFeaturedArticles,
				featuredArticlesTitle,
				showCategories,
				categoriesTitle
			},
			"featuredArticles": *[_type == "article" && featured == true] | order(publishedAt desc) [0...6] {
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
				publishedAt,
				estimatedReadTime,
				difficulty
			},
			"categories": *[_type == "category" && !defined(parent)] | order(order asc, name asc) {
				_id,
				name,
				slug,
				description,
				icon,
				color,
				featured,
				"articleCount": count(*[_type == "article" && references(^._id)])
			}
		}`;

		const data = await serverClient.fetch(query);

		return {
			knowledgebase: data.knowledgebase,
			featuredArticles: data.featuredArticles || [],
			categories: data.categories || [],
			meta: {
				title: data.knowledgebase?.title || 'Knowledgebase',
				description: data.knowledgebase?.heroSubtitle || 'Browse our knowledgebase',
			},
		};
	} catch (err) {
		console.error('Error loading knowledgebase:', err);
		throw error(500, 'Failed to load knowledgebase');
	}
};
