import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const { slug } = params;
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 12;
	const offset = (page - 1) * pageSize;

	try {
		const query = `{
			"tag": *[_type == "tag" && slug.current == $slug][0] {
				_id,
				name,
				slug
			},
			"articles": *[_type == "article" && references(*[_type == "tag" && slug.current == $slug][0]._id)] | order(publishedAt desc) [$offset...$end] {
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
			"totalArticles": count(*[_type == "article" && references(*[_type == "tag" && slug.current == $slug][0]._id)])
		}`;

		const data = await serverClient.fetch(query, { slug, offset, end: offset + pageSize });

		if (!data.tag) {
			throw error(404, 'Tag not found');
		}

		const totalPages = Math.ceil(data.totalArticles / pageSize);

		return {
			tag: data.tag,
			articles: data.articles || [],
			pagination: {
				currentPage: page,
				totalPages,
				pageSize,
				totalArticles: data.totalArticles,
			},
			meta: {
				title: `${data.tag.name} - Knowledgebase`,
				description: `Articles tagged with ${data.tag.name}`,
			},
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error('Error loading tag:', err);
		throw error(500, 'Failed to load tag');
	}
};
