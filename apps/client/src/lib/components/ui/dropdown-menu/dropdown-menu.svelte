<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		children,
		closeOnItemClick = true,
		...restProps
	} = $props();
</script>

<DropdownMenuPrimitive.Root {...restProps}>
	{@render children?.({ closeOnItemClick })}
</DropdownMenuPrimitive.Root>
