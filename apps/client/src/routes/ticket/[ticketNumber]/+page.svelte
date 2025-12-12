<script lang="ts">
	import { authClient } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { onMount } from 'svelte';
	import { MessageSquare, Clock, AlertCircle } from '@lucide/svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { marked } from 'marked';

	let { data }: { data: PageData } = $props();
	
	let user = $state<any>(null);
	let newComment = $state('');
	let isSubmitting = $state(false);

	onMount(async () => {
		const session = await authClient.getSession();
		user = session.data?.user;
	});

	function formatDate(dateString: string) {
		if (!dateString) return 'Unknown date';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return 'Invalid date';
			return new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}).format(date);
		} catch (e) {
			return 'Invalid date';
		}
	}

	function parseMarkdown(text: string): string {
		if (!text) return '';
		return marked.parse(text, { async: false }) as string;
	}

    function getPriorityColor(priority: number) {
        if (priority === 1) return 'bg-red-500';
        if (priority === 2) return 'bg-orange-500';
        if (priority === 3) return 'bg-yellow-500';
        if (priority === 4) return 'bg-blue-500';
        if (priority === 0) return 'bg-gray-500';
        return 'bg-gray-500';
    }

    function getPriorityLabel(priority: number) {
        if (priority === 0) return 'No Priority';
        if (priority === 1) return 'Urgent';
        if (priority === 2) return 'High';
        if (priority === 3) return 'Medium';
        if (priority === 4) return 'Low';
        return 'Unknown';
    }
	function handleResult(event: CustomEvent) {
		(async () => {
			const { result, update } = event.detail;
			if (result.type === 'failure') {
				alert(result.data?.error || 'Failed to post comment');
			}
			await update();
			newComment = '';
			isSubmitting = false;
		})();
	}
</script>

<svelte:head>
	<title>Ticket #{data.ticket.ticketNumber} - Support</title>
	<meta name="description" content="View your support ticket details and status" />
</svelte:head>

<main class="container mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Ticket #{data.ticket.ticketNumber}</h1>
			<p class="text-sm text-muted-foreground mt-1">
				Created {formatDate(data.ticket.createdAt)}
			</p>
		</div>
		<Badge variant="outline" class="text-sm">
			{data.issue.state}
		</Badge>
	</div>

	<!-- Issue Details -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center justify-between">
				<span>{data.issue.title}</span>
				<div class="{getPriorityColor(data.issue.priority)} text-white rounded-md p-1.5 text-xs">
					{getPriorityLabel(data.issue.priority)}
				</div>
			</CardTitle>
			<CardDescription>
				<Clock class="inline h-3 w-3 mr-1" />
				Last updated {formatDate(data.issue.updatedAt)}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="prose prose-sm dark:prose-invert max-w-none">
				{@html parseMarkdown(data.issue.description || 'No description provided')}
			</div>
		</CardContent>
	</Card>

	<!-- Comments Section -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<MessageSquare class="h-5 w-5" />
				Comments ({data.comments.length})
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if data.comments.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					<MessageSquare class="h-12 w-12 mx-auto mb-2 opacity-50" />
					<p>No comments yet</p>
				</div>
			{:else}
				{#each data.comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) as comment}
					<div class="border-l-2 border-primary pl-4 py-2">
						<div class="flex items-baseline justify-between mb-1">
							<span class="font-semibold text-sm">
								{comment.user?.displayName === "support" ? "You" : comment.user?.name || 'Support Team'}
							</span>
							<span class="text-xs text-muted-foreground">
								{formatDate(comment.createdAt)}
							</span>
						</div>
						<div class="prose prose-sm dark:prose-invert max-w-none">
							{@html parseMarkdown(comment.body)}
						</div>
					</div>
				{/each}
			{/if}

			<!-- Add Comment Form -->
			{#if data.issue.state !== 'Done' && data.issue.state !== 'Canceled' && data.issue.state !== 'Duplicate'}
				<div class="pt-4 border-t">
					<form method="POST" action="?/addComment"
						use:enhance={(formData) => {
							isSubmitting = true;
							return async ({ result, update }) => {
								if (result.type === 'failure') {
									alert(result.data?.error || 'Failed to post comment');
								}
								await update();
								newComment = '';
								isSubmitting = false;
							};
						}}>
						<input type="hidden" name="userName" value={user?.name || user?.email || 'Guest'} />
						<div class="space-y-2">
							<label for="comment" class="text-sm font-medium">Add a comment</label>
							<textarea
								id="comment"
								name="comment"
								bind:value={newComment}
								class="w-full rounded-lg border-2 border-border p-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
								placeholder="Write your comment here..."
								required
							></textarea>
							<Button type="submit" disabled={isSubmitting || !newComment.trim()} class="w-full sm:w-auto">
								{isSubmitting ? 'Posting...' : 'Post Comment'}
							</Button>
						</div>
					</form>
				</div>
			{:else}
				<div class="pt-4 border-t text-center py-4 text-muted-foreground">
					<p class="text-sm">This ticket is closed. Comments are no longer allowed.</p>
				</div>
			{/if}
		</CardContent>
	</Card>

	<div class="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
		<AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
		<p>
			Comments you post here will be added. Support team members will be notified
			and can respond directly.
		</p>
	</div>
</main>
