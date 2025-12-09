<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import type { BlockContent } from '$lib/sanity.types';
	import SanityImage from './blocks/sanity-image.svelte';
	import SanityFile from './blocks/sanity-file.svelte';
	import SanityButton from './blocks/sanity-button.svelte';
	import Callout from './blocks/callout.svelte';
	import LinkMark from './blocks/link-mark.svelte';
	import Heading from './blocks/heading.svelte';
	import Blockquote from './blocks/blockquote.svelte';
	import Paragraph from './blocks/paragraph.svelte';

	let { body }: { body: BlockContent } = $props();
</script>

<div
	class="prose prose-lg prose-strong:font-bold
	prose-em:italic prose-code:bg-muted
	prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-a:text-primary
	prose-a:hover:underline prose-ul:list-disc
	prose-ul:ml-6 prose-ul:space-y-2 prose-ol:list-decimal
	prose-ol:ml-6 prose-ol:space-y-2 prose-li:leading-relaxed
	max-w-none"
>
	<PortableText
		value={body}
		components={{
			types: {
				callout: Callout,
				image: SanityImage,
				imageWithAlt: SanityImage,
				file: SanityFile,
				button: SanityButton
			},
			block: {
				h1: Heading,
				h2: Heading,
				h3: Heading,
				h4: Heading,
				h5: Heading,
				h6: Heading,
				blockquote: Blockquote,
				normal: Paragraph
			},
			marks: {
				link: LinkMark
			}
		}}
	/>
</div>
