import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import type { Custom } from '$lib/sanity.types';
import { error } from '@sveltejs/kit';

const CUSTOM_QUERY = `*[_type == "custom" && slug.current == $slug][0]{
	_id,
	_type,
	_createdAt,
	_updatedAt,
	_rev,
	title,
	slug,
	tags,
	publishedAt,
	body,

}`;

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(404, 'Slug not found');
	}

	try {
		const custom: Custom = await serverClient.fetch(CUSTOM_QUERY, { slug });

		if (!custom) {
			throw error(404, 'Page not found');
		}

		// Extract description from first block
		let description: string | undefined;
		if (!description && custom.body && Array.isArray(custom.body)) {
			const firstBlock = custom.body[0];
			if (
				firstBlock &&
				firstBlock._type === 'block' &&
				'children' in firstBlock &&
				Array.isArray(firstBlock.children)
			) {
				description = firstBlock.children
					.filter((child: any) => child.text)
					.map((child: any) => child.text)
					.join(' ')
					.slice(0, 160);
			}
		}

		return {
			custom,
			meta: {
				title: custom.title,
				description,
				url: `/${custom.slug?.current}`,
				publishedAt: custom.publishedAt,
				tags: custom.tags
			}
		};
	} catch (err) {
		console.error('Error fetching custom page:', err);
		throw error(500, 'Failed to load page');
	}
};
