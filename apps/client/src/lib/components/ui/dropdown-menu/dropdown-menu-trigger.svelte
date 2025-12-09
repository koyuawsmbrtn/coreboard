<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = DropdownMenuPrimitive.TriggerProps;

	let { ref = $bindable(null), class: className, children, ...restProps }: $$Props = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref class={cn(className)} {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Trigger>
