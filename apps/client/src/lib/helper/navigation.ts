import type { NavigationItem } from '$lib/components/navbar.svelte';
import type { Navbar } from '$lib/sanity.types';
import { serverClient } from '$lib/server/sanity';
import { deconstructLink } from './link';

interface PageResult {
	_id: string;
	_type: string;
	title: string;
	slug: {
		current: string;
	};
}

export async function fetchNavigation(): Promise<NavigationItem[]> {
	try {
		const navbar = await serverClient.fetch<Navbar>(`
			*[_type == "navbar"][0]{
				_id,
				_type,
				title,
				links[]{
					_key,
					text,
					link,
					sublinks[]{
						_key,
						type,
						text,
						link,
						pageType,
						tagFilter->{
							_id,
							title,
							slug
						},
						tagPageType
					}
				}
			}
		`);

		if (!navbar?.links || navbar.links.length === 0) {
			// Return fallback navigation when no navbar document exists
			return [
				{ name: 'Home', url: '/' },
				{ name: 'About', url: '/about' },
				{ name: 'Contact', url: '/contact' }
			];
		}

		const navigationItems: NavigationItem[] = [];

		for (const link of navbar.links) {
			if (!link.text) continue;

			const deconstructedLink = await deconstructLink(link.link);

			const navigationItem: NavigationItem = {
				name: link.text,
				url: deconstructedLink?.href || '#'
			};

			// Process sublinks if they exist
			if (link.sublinks && link.sublinks.length > 0) {
				const subitems = [];

				for (const sublink of link.sublinks) {
					switch (sublink.type) {
						case 'manual': {
							if (sublink.text && sublink.link) {
								const deconstructedSublink = await deconstructLink(sublink.link);
								if (deconstructedSublink?.href) {
									subitems.push({
										name: sublink.text,
										url: deconstructedSublink.href
									});
								}
							}
							break;
						}

						case 'auto': {
							const autoPages = await fetchAutoPages(sublink.pageType || 'custom');
							for (const page of autoPages) {
								const pageUrl =
									page._type === 'custom'
										? `/${page.slug.current}`
										: `/${page._type}/${page.slug.current}`;

								subitems.push({
									name: page.title,
									url: pageUrl
								});
							}
							break;
						}

						case 'tag': {
							if (sublink.tagFilter?._ref && sublink.tagPageType) {
								const tagPages = await fetchPagesByTag(sublink.tagFilter._ref, sublink.tagPageType);
								for (const page of tagPages) {
									const pageUrl =
										page._type === 'custom'
											? `/${page.slug.current}`
											: `/${page._type}/${page.slug.current}`;

									subitems.push({
										name: page.title,
										url: pageUrl
									});
								}
							}
							break;
						}
					}
				}

				if (subitems.length > 0) {
					navigationItem.subitems = subitems;
				}
			}

			navigationItems.push(navigationItem);
		}

		return navigationItems;
	} catch (error) {
		console.error('Failed to fetch navigation:', error);
		return [];
	}
}

async function fetchAutoPages(pageType: string): Promise<PageResult[]> {
	const query = `*[_type == $pageType && defined(slug.current)] | order(_createdAt desc)[0...5]{
		_id,
		_type,
		title,
		slug
	}`;

	try {
		return await serverClient.fetch<PageResult[]>(query, { pageType });
	} catch (error) {
		console.error(`Failed to fetch auto pages for type ${pageType}:`, error);
		return [];
	}
}

async function fetchPagesByTag(tagId: string, pageType: string): Promise<PageResult[]> {
	const query = `*[_type == $pageType && defined(slug.current) && $tagId in tags[]._ref] | order(_createdAt desc)[0...5]{
		_id,
		_type,
		title,
		slug
	}`;

	try {
		return await serverClient.fetch<PageResult[]>(query, { tagId, pageType });
	} catch (error) {
		console.error(`Failed to fetch pages by tag ${tagId} for type ${pageType}:`, error);
		return [];
	}
}

// Cache the navigation data for better performance
let navigationCache: NavigationItem[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedNavigation(): Promise<NavigationItem[]> {
	const now = Date.now();

	if (navigationCache && now - cacheTimestamp < CACHE_DURATION) {
		return navigationCache;
	}

	navigationCache = await fetchNavigation();
	cacheTimestamp = now;

	return navigationCache;
}
