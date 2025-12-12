import type { PageServerLoad, Actions } from './$types';
import { LinearClient } from '@linear/sdk';
import { prisma } from '$lib/prisma';
import { LINEAR_API_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';

const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });

export const load: PageServerLoad = async ({ params }) => {
	const { ticketNumber } = params;

	// Find ticket in database
	const ticket = await prisma.ticket.findUnique({
		where: { ticketNumber }
	});

	if (!ticket || !ticket.linearId) {
		throw error(404, 'Ticket not found');
	}

	// Fetch issue details from Linear
	let issue;
	try {
		issue = await linearClient.issue(ticket.linearId);
		if (!issue) {
			throw error(404, 'Ticket not found or has been deleted');
		}
	} catch (err) {
		console.error('Error fetching Linear issue:', err);
		throw error(404, 'Ticket not found or has been deleted');
	}

	const comments = await issue.comments();
	const issueState = await issue.state;

	// Resolve all comment users
	const resolvedComments = await Promise.all(
		comments.nodes.map(async (comment) => {
			const user = comment.user ? await comment.user : null;
			return {
				id: comment.id,
				body: comment.body,
				createdAt: comment.createdAt ? new Date(comment.createdAt).toISOString() : new Date().toISOString(),
				user: user ? {
					name: user.name,
					displayName: user.displayName
				} : null
			};
		})
	);

	const stateName = issueState?.name || 'Unknown';
	const isClosed = ['done', 'canceled', 'cancelled', 'duplicate'].includes(stateName.toLowerCase());

	return {
		ticket: {
			ticketNumber: ticket.ticketNumber,
			createdAt: ticket.createdAt.toISOString()
		},
		issue: {
			id: issue.id,
			title: issue.title,
			description: issue.description,
			state: stateName,
			priority: issue.priority || 0,
			createdAt: issue.createdAt ? new Date(issue.createdAt).toISOString() : new Date().toISOString(),
			updatedAt: issue.updatedAt ? new Date(issue.updatedAt).toISOString() : new Date().toISOString(),
			isClosed
		},
		comments: resolvedComments
	};
};

export const actions: Actions = {
	addComment: async ({ request, params }) => {
		try {
			const { ticketNumber } = params;
			const formData = await request.formData();
			const commentBody = formData.get('comment') as string;
			const userName = formData.get('userName') as string;

			if (!commentBody || commentBody.trim() === '') {
				return fail(400, { error: 'Comment cannot be empty' });
			}

			// Find ticket
			const ticket = await prisma.ticket.findUnique({
				where: { ticketNumber }
			});

			if (!ticket || !ticket.linearId) {
				return fail(404, { error: 'Ticket not found' });
			}

			// Check if issue is closed
			const issue = await linearClient.issue(ticket.linearId);
			const issueState = await issue.state;
			const stateName = issueState?.name || '';
			const isClosed = ['done', 'canceled', 'cancelled', 'duplicate'].includes(stateName.toLowerCase());

			if (isClosed) {
				return fail(403, { error: 'Cannot add comments to closed tickets' });
			}
			
			await linearClient.createComment({
				issueId: ticket.linearId,
				body: commentBody
			});

			return { success: true };
		} catch (error) {
			console.error('Error adding comment:', error);
			return fail(500, { error: 'Failed to add comment' });
		}
	}
};
