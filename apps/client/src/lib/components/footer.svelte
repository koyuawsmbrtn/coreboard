<script lang="ts">
	import type { Settings } from '$lib/sanity.types';
	import Logo from './logo.svelte';
	import { version } from '$app/environment';

	let { settings }: { settings: Settings } = $props();
</script>

<footer class="bg-white border-t">
	<div class="container mx-auto px-4 py-6">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<Logo {settings} height={24} />
			
			<div class="text-center md:text-right">
				<p class="text-sm text-muted-foreground">
					{settings.footer?.replace('{YEAR}', new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} All rights reserved.`}
				</p>
				<p class="text-sm text-muted-foreground">
					Coreboard v{version}
				</p>
			</div>
		</div>
	</div>
</footer>
