import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';

export const load: PageServerLoad = async ({ params, url }) => {
	const { slug } = params;
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 12;
	const offset = (page - 1) * pageSize;

	try {
		// First get the category
		const categoryQuery = `*[_type == "category" && slug.current == $slug][0]`;
		const category = await serverClient.fetch(categoryQuery, { slug });
		
		if (!category) {
			console.log('Category not found for slug:', slug);
		} else {
			console.log('Found category:', category._id, category.name);
		}

		// Get all articles to debug
		const allArticlesQuery = `*[_type == "article"] { _id, title, category }`;
		const allArticles = await serverClient.fetch(allArticlesQuery);
		console.log('All articles:', allArticles);

		const query = `{
			"category": *[_type == "category" && slug.current == $slug][0] {
				_id,
				name,
				slug,
				description,
				icon,
				color,
				"subcategories": *[_type == "category" && parent._ref == ^._id || parent._ref == "drafts." + ^._id] | order(order asc, name asc) {
					_id,
					name,
					slug,
					description,
					icon,
					color,
					"articleCount": count(*[_type == "article" && (category._ref == ^._id || category._ref == "drafts." + ^._id)])
				}
			},
			"categoryId": *[_type == "category" && slug.current == $slug][0]._id,
			"articles": *[_type == "article" && (category._ref in [*[_type == "category" && slug.current == $slug][0]._id, "drafts." + *[_type == "category" && slug.current == $slug][0]._id] || category._ref == string::split(*[_type == "category" && slug.current == $slug][0]._id, "drafts.")[1])] | order(publishedAt desc) [$offset...$end] {
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
				difficulty,
				tags[]->{
					name,
					slug
				}
			},
			"totalArticles": count(*[_type == "article" && (category._ref in [*[_type == "category" && slug.current == $slug][0]._id, "drafts." + *[_type == "category" && slug.current == $slug][0]._id] || category._ref == string::split(*[_type == "category" && slug.current == $slug][0]._id, "drafts.")[1])])
		}`;

		const data = await serverClient.fetch(query, { slug, offset, end: offset + pageSize });
		console.log('Query result - articles:', data.articles?.length, 'total:', data.totalArticles);

		if (!data.category) {
			return {
				category: {
					name: 'Category Not Found',
					slug: { current: slug },
					subcategories: [],
				},
				articles: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					pageSize,
					totalArticles: 0,
				},
				meta: {
					title: 'Category Not Found',
					description: '',
				},
			};
		}

		const totalPages = Math.ceil(data.totalArticles / pageSize);

		return {
			category: data.category,
			articles: data.articles || [],
			pagination: {
				currentPage: page,
				totalPages,
				pageSize,
				totalArticles: data.totalArticles,
			},
			meta: {
				title: `${data.category.name} - Knowledgebase`,
				description: data.category.description || `Browse ${data.category.name} articles`,
			},
		};
	} catch (err: any) {
		console.error('Error loading category:', err);
		return {
			category: {
				name: 'Error Loading Category',
				slug: { current: slug },
				subcategories: [],
			},
			articles: [],
			pagination: {
				currentPage: page,
				totalPages: 0,
				pageSize,
				totalArticles: 0,
			},
			meta: {
				title: 'Error Loading Category',
				description: '',
			},
		};
	}
};
