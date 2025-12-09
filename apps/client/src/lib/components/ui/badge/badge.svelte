<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { badgeVariants, type Props } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = Props & HTMLAttributes<HTMLSpanElement>;

	// svelte-ignore non_reactive_update
	let className: $$Props['class'] = undefined;
	export { className as class };

	let { variant = 'default', children, ...restProps }: { variant?: $$Props['variant'], children?: Snippet } & Record<string, any> = $props();
</script>

<span class={cn(badgeVariants({ variant, className }))} {...restProps}>
	{@render children?.()}
</span>
