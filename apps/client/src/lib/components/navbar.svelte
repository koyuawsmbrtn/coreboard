<script module lang="ts">
	export interface NavigationSubItem {
		name: string;
		url: string;
	}

	export interface NavigationItem {
		name: string;
		url?: string;
		subitems?: NavigationSubItem[];
	}
</script>

<script lang="ts">
	import {
		NavigationMenuContent,
		NavigationMenuItem,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuRoot,
		NavigationMenuTrigger
	} from '$lib/components/ui/navigation-menu';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { Settings } from '$lib/sanity.types';
	import Logo from './logo.svelte';
	import { MoreHorizontal, ChevronRight, User, LogIn, LogOut, Cog } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Button from './ui/button/button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { authClient } from '$lib/auth';
	import Username from './username.svelte';

	interface Props {
		settings?: Settings;
		items?: NavigationItem[];
	}

	let { settings, items = [] }: Props = $props();

	let activeIndex = $state(0);
	let navigationList: HTMLElement;
	let mobileMenuOpen = $state(false);
	let expandedSubmenu = $state<string | null>(null);
	let user = $state<any>(null);

	onMount(async () => {
		const session = await authClient.getSession();
		user = session.data?.user;
		setTimeout(updateIndicator, 200);
	});

	const indicatorPosition = tweened(
		{ left: 0, width: 0 },
		{
			duration: 300,
			easing: cubicOut
		}
	);

	$effect(() => {
		const currentPath = $page.url.pathname;
		let newActiveIndex = -1;

		items?.forEach((item, index) => {
			if (item.url === currentPath) {
				newActiveIndex = index;
			} else if (item.subitems) {
				const hasActiveSubitem = item.subitems.some(
					(subitem) => currentPath === subitem.url || currentPath.startsWith(subitem.url + '/')
				);
				if (hasActiveSubitem) {
					newActiveIndex = index;
				}
			}
		});

		if (newActiveIndex !== -1) {
			activeIndex = newActiveIndex;
			tick().then(() => updateIndicator());
		}
	});

	function updateIndicator() {
		if (!navigationList || activeIndex === -1) return;

		const menuItems = navigationList.querySelectorAll('[data-navigation-menu-item]');
		const activeMenuItem = menuItems[activeIndex];

		if (activeMenuItem) {
			const activeButton = activeMenuItem.querySelector('a, button');
			if (activeButton) {
				const listRect = navigationList.getBoundingClientRect();
				const buttonRect = activeButton.getBoundingClientRect();

				indicatorPosition.set({
					left: buttonRect.left - listRect.left,
					width: buttonRect.width
				});
			}
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		expandedSubmenu = null;
	}

	function toggleSubmenu(itemName: string) {
		expandedSubmenu = expandedSubmenu === itemName ? null : itemName;
	}

	const reloadPaths = ['/blog/'];

	function shouldReload(url?: string) {
		if (!url) return false;
		const currentPath = $page.url.pathname;
		
		return reloadPaths.some(path => 
			url.startsWith(path) && currentPath.startsWith(path)
		);
	}

	function handleLogin() {
		location.href = `https://accounts.iisu.network/auth?redirect=${encodeURIComponent(location.origin + '/callback')}`;
	}

	async function handleLogout() {
		await authClient.signOut();
		location.reload();
	}
</script>

<nav class="bg-primary relative z-[50] py-3">
	<div class="container px-4 md:mx-auto md:px-0">
		<div class="relative flex items-center">
			<div class="flex items-center">
				{#if settings}
					<Button variant="ghost" href="/">
						<Logo {settings} class="text-white" />
					</Button>
				{:else}
					<div class="text-lg font-semibold text-white">Logo</div>
				{/if}
				<a
					href="#main-content"
					class="sr-only ml-2 focus:not-sr-only focus:bg-white focus:text-black focus:px-3 focus:py-1 focus:rounded focus:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
				>
					Skip navigation
				</a>
			</div>

			<div class="absolute left-1/2 hidden -translate-x-1/2 transform md:flex">
				<NavigationMenuRoot class="relative z-[50]" viewport={false}>
					<div bind:this={navigationList}>
						<NavigationMenuList class="relative">
							<div
								class="pointer-events-none absolute top-1/2 z-10 h-9 -translate-y-1/2 rounded-md bg-white/10"
								style="left: {$indicatorPosition.left}px; width: {$indicatorPosition.width}px;"
							></div>
							{#each items || [] as item}
								<NavigationMenuItem data-navigation-menu-item>
									{#if item.url && !item.subitems}
										<NavigationMenuLink
											class={cn(
												'relative z-20 text-white transition-colors hover:text-white/80 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20'
											)}
											href={item.url}
											data-sveltekit-reload={shouldReload(item.url) ? true : undefined}
										>
											{item.name}
										</NavigationMenuLink>
									{:else if item.subitems}
										{#if item.url}
											<NavigationMenuTrigger
												class="relative z-20 cursor-pointer px-2 text-white transition-colors hover:text-white/80 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 data-[state=open]:bg-white/10"
											>
												<NavigationMenuLink
													href={item.url}
													class="focus:outline-none"
													data-sveltekit-reload={shouldReload(item.url) ? true : undefined}
												>
													{item.name}
												</NavigationMenuLink>
											</NavigationMenuTrigger>
										{:else}
											<NavigationMenuTrigger
												class="relative z-20 cursor-pointer text-white transition-colors hover:text-white/80 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 data-[state=open]:bg-white/10"
											>
												{item.name}
											</NavigationMenuTrigger>
										{/if}
										<NavigationMenuContent
											class="bg-primary absolute left-1/2 z-[50] mt-2 min-w-max -translate-x-1/2 space-y-1 rounded-md border border-white/20 p-2 shadow-lg"
										>
											{#each item.subitems as subitem}
												<NavigationMenuLink
													href={subitem.url}
													class="block rounded-md px-4 py-2 text-white transition-colors hover:bg-white/10 hover:text-white/80 focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
													data-sveltekit-reload={shouldReload(subitem.url) ? true : undefined}
												>
													{subitem.name}
												</NavigationMenuLink>
											{/each}
										</NavigationMenuContent>
									{/if}
								</NavigationMenuItem>
							{/each}
						</NavigationMenuList>
					</div>
				</NavigationMenuRoot>
			</div>
			
			<!-- Desktop User Menu -->
			<div class="ml-auto hidden md:block">
				<DropdownMenu>
					<DropdownMenuTrigger class="text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md p-2">
						<User size={20} />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" class="w-48">
						{#if user}
							<div class="px-2 py-1.5 text-sm font-medium">
								<Username name={user.name} />
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onclick={() => {
								location.href = 'https://accounts.iisu.network'; // Change this URL to your account settings page
							}} class="cursor-pointer">
								<Cog size={16} class="mr-2" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem onclick={handleLogout} class="cursor-pointer">
								<LogOut size={16} class="mr-2" />
								Log out
							</DropdownMenuItem>
						{:else}
							<DropdownMenuItem onclick={handleLogin} class="cursor-pointer">
								<LogIn size={16} class="mr-2" />
								Log in
							</DropdownMenuItem>
						{/if}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<!-- Mobile Menu Toggle -->
			<div class="ml-2 md:hidden">
				<Sheet bind:open={mobileMenuOpen}>
					<SheetTrigger class="text-white md:hidden" aria-label="Toggle mobile menu">
						<Button variant="ghost" size="icon">
							<MoreHorizontal size={24} />
						</Button>
					</SheetTrigger>
					<SheetContent side="top" class="border-primary bg-primary h-full w-full text-white">
						<SheetHeader class="border-b border-white/20 pb-4">
							<SheetTitle class="flex items-center justify-start">
								{#if settings}
									<Button variant="ghost" class="px-1" href="/">
										<Logo {settings} class="text-white" />
									</Button>
								{:else}
									<div class="text-lg font-semibold">Navigation</div>
								{/if}
							</SheetTitle>
						</SheetHeader>
						<div class="relative flex flex-col space-y-2 pt-6">
							{#each items || [] as item, index}
								{#if item.url && !item.subitems}
									<Button
										href={item.url}
										class={cn(
											'mx-2 block rounded-md px-4 py-2 text-sm transition-colors hover:text-white/80',
											index === activeIndex && 'bg-white/20'
										)}
										onclick={closeMobileMenu}
										data-sveltekit-reload={shouldReload(item.url) ? true : undefined}
									>
										{item.name}
									</Button>
								{:else if item.subitems}
									<div class="space-y-1 px-2">
										<div class="flex items-center">
											{#if item.url}
												<Button
													href={item.url}
													class={cn(
														'flex-1 block rounded-md px-4 py-2 text-left text-sm font-medium transition-colors hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20',
														index === activeIndex && 'bg-white/20'
													)}
													onclick={closeMobileMenu}
													data-sveltekit-reload={shouldReload(item.url) ? true : undefined}
												>
													{item.name}
												</Button>
											{:else}
												<div class="flex-1 px-4 py-2 text-sm font-medium text-white">
													{item.name}
												</div>
											{/if}
											<Button
												class="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
												onclick={() => toggleSubmenu(item.name)}
												aria-expanded={expandedSubmenu === item.name}
												aria-controls={`submenu-${item.name}`}
												aria-label="Extend {item.name} submenu"
												type="button"
											>
												<div
													class="transition-transform duration-300 ease-out {expandedSubmenu ===
													item.name
														? 'rotate-90'
														: 'rotate-0'}"
												>
													<ChevronRight size={16} />
												</div>
											</Button>
										</div>
										{#if expandedSubmenu === item.name}
											<div
												class="space-y-1"
												transition:slide={{ duration: 300, easing: quintOut }}
												id={`submenu-${item.name}`}
												role="group"
											>
												{#each item.subitems as subitem}
													<Button
														href={subitem.url}
														class={cn(
															'mx-2 block rounded-md px-4 py-2 text-sm text-white/80 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20',
															($page.url.pathname === subitem.url || $page.url.pathname.startsWith(subitem.url + '/')) && 'bg-white/20'
														)}
														onclick={closeMobileMenu}
														data-sveltekit-reload={shouldReload(subitem.url) ? true : undefined}
													>
														{subitem.name}
													</Button>
												{/each}
											</div>
										{/if}
									</div>
								{/if}
							{/each}
							
							<!-- Mobile User Section -->
							<div class="border-t border-white/20 mt-4 pt-4 px-4">
								{#if user}
									<div class="mb-2 text-sm font-medium">
										{user.name || 'User'}
									</div>
									<Button
										onclick={handleLogout}
										variant="ghost"
										class="w-full justify-start text-sm"
									>
										<LogOut size={16} class="mr-2" />
										Log out
									</Button>
								{:else}
									<Button
										onclick={handleLogin}
										variant="ghost"
										class="w-full justify-start text-sm"
									>
										<LogIn size={16} class="mr-2" />
										Log in
									</Button>
								{/if}
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</nav>
