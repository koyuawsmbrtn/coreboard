<script lang="ts">
	let { children } = $props();
</script>

<blockquote
	class="my-6 rounded-r-lg border-l-4 border-primary bg-muted/30 py-4 pl-6 text-lg text-muted-foreground italic"
>
	{@render children()}
</blockquote>
