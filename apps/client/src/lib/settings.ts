import { serverClient } from './server/sanity';

export async function fetchSettings(prop?: string | undefined) {
	const settings = await serverClient.fetch(`*[_type == "settings"][0]{
		${
			prop ||
			`title,
			 longTitle,
			 footer,
			 description,
			  logo,
			  favicon`
		}
	  }`);
	return settings;
}
