<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = DropdownMenuPrimitive.ItemProps;

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: $$Props = $props();

	// If you want to support 'inset', define it separately or remove its usage below
	let inset = false;
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</DropdownMenuPrimitive.Item>
