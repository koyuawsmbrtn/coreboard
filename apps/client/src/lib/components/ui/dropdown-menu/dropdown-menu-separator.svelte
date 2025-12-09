<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = DropdownMenuPrimitive.SeparatorProps;

	let { ref = $bindable(null), class: className, ...restProps }: $$Props = $props();
</script>

<DropdownMenuPrimitive.Separator
	bind:ref
	class={cn("-mx-1 my-1 h-px bg-muted", className)}
	{...restProps}
/>
