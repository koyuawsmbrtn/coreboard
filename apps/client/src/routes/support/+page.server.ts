import type { PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';

export const load: PageServerLoad = async () => {
	const query = `*[_type == "supportQuestion" && active == true] | order(order asc) {
		_id,
		question,
		order,
		type,
		options,
		placeholder,
		acceptedFileTypes,
		maxFileSize,
		required
	}`;

	const questions = await serverClient.fetch(query);

	return {
		questions: questions || []
	};
};
