import type { Actions, PageServerLoad } from './$types';
import { serverClient } from '$lib/server/sanity';
import { LinearClient } from '@linear/sdk';
import { prisma } from '$lib/prisma';
import { Resend } from 'resend';
import { LINEAR_API_KEY, RESEND_API_KEY, EMAIL_FROM } from '$env/static/private';
import { PUBLIC_ORIGIN_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';

const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
const resend = new Resend(RESEND_API_KEY);

export const load: PageServerLoad = async () => {
	const query = `*[_type == "supportQuestion" && active == true] | order(order asc) {
		_id,
		question,
		order,
		type,
		options,
		placeholder,
		acceptedFileTypes,
		maxFileSize,
		required
	}`;

	const questions = await serverClient.fetch(query);

	return {
		questions: questions || []
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const userEmail = formData.get('user') as string;
			const userId = formData.get('userId') as string | null;

			// Build issue description from answers and handle file uploads
			let description = '';
			const linearAttachments: { name: string; url: string }[] = [];

			for (const [key, value] of formData.entries()) {
				if (key !== 'user' && key !== 'userId') {
					const stringValue = value as string;
					
					// Check if this is a base64 encoded file
					try {
						const fileData = JSON.parse(stringValue);
						if (fileData.name && fileData.data) {
							// It's a file with base64 data
							description += `**${key}**: ${fileData.name}:\n\n![${fileData.name}](${fileData.data})\n\n`;
							linearAttachments.push({ name: fileData.name, url: fileData.data });
						} else {
							// Regular answer
							description += `**${key}**: ${stringValue}\n\n`;
						}
					} catch {
						// Not JSON, treat as regular answer
						description += `**${key}**: ${stringValue}\n\n`;
					}
				}
			}

			// Get Support team
			const teams = await linearClient.teams();
			const supportTeam = teams.nodes.find(team => team.name === 'Support');
			
			if (!supportTeam) {
				return fail(500, { error: 'Support team not found in Linear' });
			}

			// Get or create "authed" label
			const labels = await supportTeam.labels();
			let authedLabel = labels.nodes.find(label => label.name === 'authed');

			// Create Linear issue
			const issuePayload = await linearClient.createIssue({
				teamId: supportTeam.id,
				title: `New support request`,
				description: `**Email:** ${userEmail}\n\n`+description,
				labelIds: authedLabel ? [authedLabel.id] : []
			});

			const issue = await issuePayload.issue;
			if (!issue) {
				return fail(500, { error: 'Failed to create Linear issue' });
			}

			// Create ticket in database
			const ticket = await prisma.ticket.create({
				data: {
					linearId: issue.id,
					userId: userId || undefined
				}
			});

			// Send email notification
			await resend.emails.send({
				from: EMAIL_FROM,
				to: userEmail,
				subject: `Support Ticket Created - #${ticket.ticketNumber}`,
				html: `
					<h2>Your support ticket has been created</h2>
					<p>Ticket Number: <strong>${ticket.ticketNumber}</strong></p>
					<p>You can track your ticket here:</p>
					<a href="${PUBLIC_ORIGIN_URL}/ticket/${ticket.ticketNumber}">${PUBLIC_ORIGIN_URL}/ticket/${ticket.ticketNumber}</a>
					<p>We'll respond to your request as soon as possible.</p>
				`
			});

			return {
				success: true,
				ticketNumber: ticket.ticketNumber
			};
		} catch (error) {
			console.error('Error creating support ticket:', error);
			return fail(500, { error: 'Failed to create support ticket' });
		}
	}
};
