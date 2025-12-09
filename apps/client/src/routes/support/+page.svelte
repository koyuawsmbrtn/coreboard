<script lang="ts">
	import { authClient } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, CheckCircle2, LogIn, SkipForward } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	let currentStep = $state(0);
	let user = $state<any>(null);
	let answers = $state<Record<string, any>>({});
	let files = $state<Record<string, File | null>>({});
	let submitted = $state(false);

	const steps = ['login', ...data.questions.map((_: any, i: any) => `question-${i}`), 'complete'];

	onMount(async () => {
		const session = await authClient.getSession();
		user = session.data?.user;
		if (user) {
			currentStep = 1; // Skip login if already logged in
		}
	});

	function handleLogin() {
		location.href = `https://accounts.iisu.network/auth?redirect=${encodeURIComponent(location.origin + '/callback')}`;
	}

	function skipLogin() {
		currentStep = 1;
	}

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
			// Skip login step if going back and user is logged in
			if (currentStep === 0 && user) {
				currentStep = 1;
			}
		}
	}

	function selectOption(questionIndex: number, value: string) {
		const questionId = data.questions[questionIndex]._id;
		answers[questionId] = value;
	}

	function handleTextInput(questionId: string, value: string) {
		answers[questionId] = value;
	}

	function handleFileUpload(questionId: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const question = data.questions.find((q: any) => q._id === questionId);
			const maxSize = (question?.maxFileSize || 5) * 1024 * 1024; // Convert MB to bytes
			
			if (file.size > maxSize) {
				alert(`File size must be less than ${question?.maxFileSize || 5}MB`);
				input.value = '';
                return;
            }
            files[questionId] = file;
        }
    }

	async function submitSupport() {
		// Here you would typically send the data to your backend
		// For file uploads, you would need to use FormData
		const formData = new FormData();
		formData.append('user', user?.email || 'anonymous');
		
		// Add text answers
		Object.keys(answers).forEach(key => {
			if (!files[key]) {
				formData.append(key, answers[key]);
			}
		});
		
		// Add files
		Object.keys(files).forEach(key => {
			if (files[key]) {
				formData.append(key, files[key]!);
			}
		});
		
		console.log('Support request submitted:', {
			user: user?.email || 'anonymous',
			answers,
			files: Object.keys(files).filter(k => files[k])
		});
		
		submitted = true;
		nextStep();
	}

    function canProceed() {
		if (currentStep === 0) return false; // Login step, must use buttons
		if (currentStep === steps.length - 1) return false; // Complete step
		
		const questionIndex = currentStep - 1;
		const question = data.questions[questionIndex];
		
		if (question?.required) {
			return !!answers[question._id];
		}
		
		return true;
	}

	function getCurrentQuestion() {
		if (currentStep === 0 || currentStep === steps.length - 1) return null;
		return data.questions[currentStep - 1];
	}

	$effect(() => {
		const question = getCurrentQuestion();
		if (question && !question.required && currentStep > 0 && currentStep < steps.length - 1) {
			// Auto-enable next for non-required questions
		}
	});
</script>

<svelte:head>
	<title>Support Wizard - Get Help</title>
	<meta name="description" content="Get personalized support by answering a few questions" />
</svelte:head>

<main class="container mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-8">
	<div class="text-center">
		<h1 class="text-4xl font-bold mb-2">Support Wizard</h1>
		<p class="text-muted-foreground">Let us help you find the right solution</p>
	</div>

	<!-- Progress indicator -->
	<div class="w-full max-w-2xl mx-auto">
		<div class="mb-4 flex justify-between text-sm">
			<span class="text-muted-foreground">
				{#if currentStep === 0}
					Getting Started
				{:else if currentStep === steps.length - 1}
					Complete
				{:else}
					Question {currentStep} of {data.questions.length}
				{/if}
			</span>
			<span class="font-medium">
				{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete
			</span>
		</div>
		<div class="relative h-2 w-full overflow-hidden rounded-full bg-muted">
			<div
				class="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out"
				style="width: {(currentStep / (steps.length - 1)) * 100}%"
			></div>
		</div>
	</div>

	<!-- Step Content -->
	<Card class="w-full">
		{#if currentStep === 0}
			<!-- Login Step -->
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<LogIn class="h-5 w-5" />
					Sign In for Better Support
				</CardTitle>
				<CardDescription>
					Signing in helps us provide personalized assistance and track your support history
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				{#if user}
					<div class="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm">
						<p class="font-medium text-green-800 dark:text-green-300">
							You're signed in as {user.name || user.email}
						</p>
					</div>
				{:else}
					<div class="space-y-3">
						<p class="text-sm text-muted-foreground">
							Benefits of signing in:
						</p>
						<ul class="space-y-2 text-sm text-muted-foreground">
							<li class="flex items-start gap-2">
								<CheckCircle2 class="h-4 w-4 mt-0.5 text-primary" />
								<span>Track your support tickets</span>
							</li>
							<li class="flex items-start gap-2">
								<CheckCircle2 class="h-4 w-4 mt-0.5 text-primary" />
								<span>Help supporters identify you</span>
							</li>
							<li class="flex items-start gap-2">
								<CheckCircle2 class="h-4 w-4 mt-0.5 text-primary" />
								<span>Faster response times</span>
							</li>
						</ul>
					</div>
				{/if}
			</CardContent>
			<CardFooter class="flex gap-2">
				{#if user}
					<Button onclick={nextStep} class="flex-1">
						Continue
						<ChevronRight class="ml-2 h-4 w-4" />
					</Button>
				{:else}
					<Button variant="outline" onclick={skipLogin} class="flex-1">
						<SkipForward class="mr-2 h-4 w-4" />
						Skip for now
					</Button>
					<Button onclick={handleLogin} class="flex-1">
						<LogIn class="mr-2 h-4 w-4" />
						Sign In
					</Button>
				{/if}
			</CardFooter>
		{:else if currentStep === steps.length - 1}
			<!-- Complete Step -->
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<CheckCircle2 class="h-5 w-5 text-green-600" />
					Support Request Submitted
				</CardTitle>
				<CardDescription>
					Thank you for providing the information. We'll get back to you soon!
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
					<h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">Your Responses:</h3>
					<div class="space-y-2 text-sm">
						{#each data.questions as question}
							{#if answers[question._id]}
								<div>
									<p class="font-medium text-green-700 dark:text-green-400">{question.question}</p>
									<p class="text-green-600 dark:text-green-500">
										{#if question.type === 'multiple-choice'}
											{question.options?.find((opt: { value: any; }) => opt.value === answers[question._id])?.label || answers[question._id]}
										{:else if question.type === 'file'}
											📎 {files[question._id]?.name || answers[question._id]}
										{:else}
											{answers[question._id]}
										{/if}
									</p>
								</div>
							{/if}
						{/each}
					</div>
				</div>
				{#if user}
					<p class="text-sm text-muted-foreground">
						We'll send updates to <strong>{user.email}</strong>
					</p>
				{:else}
					<p class="text-sm text-muted-foreground">
						To track this request, please sign in or check back here later.
					</p>
				{/if}
			</CardContent>
			<CardFooter>
				<Button onclick={() => location.href = '/support'} class="w-full">
					Back to support page
				</Button>
			</CardFooter>
		{:else}
			<!-- Question Steps -->
			{@const question = getCurrentQuestion()}
			{#if question}
				<CardHeader>
					<CardTitle>
						Question {currentStep} of {data.questions.length}
					</CardTitle>
					<CardDescription>
						{question.question}
						{#if !question.required}
							<span class="text-xs italic">(Optional)</span>
						{/if}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{#if question.type === 'multiple-choice'}
						<div class="space-y-2">
							{#each question.options || [] as option}
								<button
									class="w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary hover:bg-accent {answers[question._id] === option.value
										? 'border-primary bg-accent'
										: 'border-border'}"
									onclick={() => selectOption(currentStep - 1, option.value)}
								>
									<div class="flex items-center gap-3">
										<div
											class="h-4 w-4 rounded-full border-2 transition-all {answers[question._id] === option.value
												? 'border-primary bg-primary'
												: 'border-muted-foreground'}"
										>
											{#if answers[question._id] === option.value}
												<div class="h-full w-full rounded-full bg-white scale-50"></div>
											{/if}
										</div>
										<span class="font-medium">{option.label}</span>
									</div>
								</button>
							{/each}
						</div>
					{:else if question.type === 'text'}
						<input
							type="text"
							class="w-full rounded-lg border-2 border-border p-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							placeholder={question.placeholder || 'Enter your answer...'}
							value={answers[question._id] || ''}
							oninput={(e) => handleTextInput(question._id, e.currentTarget.value)}
						/>
					{:else if question.type === 'textarea'}
						<textarea
							class="w-full rounded-lg border-2 border-border p-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
							placeholder={question.placeholder || 'Enter your detailed response...'}
							value={answers[question._id] || ''}
							oninput={(e) => handleTextInput(question._id, e.currentTarget.value)}
						></textarea>
					{:else if question.type === 'file'}
						<div class="space-y-3">
							<div class="rounded-lg border-2 border-dashed border-border p-6 text-center">
								<input
									type="file"
									id="file-{question._id}"
									class="hidden"
									accept={question.acceptedFileTypes || '*'}
									onchange={(e) => handleFileUpload(question._id, e)}
								/>
								<label
									for="file-{question._id}"
									class="cursor-pointer flex flex-col items-center gap-2"
								>
									<div class="rounded-full bg-muted p-3">
										<svg
											class="h-6 w-6 text-muted-foreground"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											/>
										</svg>
									</div>
									<div>
										<p class="text-sm font-medium">
											Click to upload or drag and drop
										</p>
										<p class="text-xs text-muted-foreground">
											{question.acceptedFileTypes || 'Any file type'} (Max {question.maxFileSize || 5}MB)
										</p>
									</div>
								</label>
							</div>
							{#if files[question._id]}
								<div class="flex items-center gap-2 rounded-lg bg-accent p-3">
									<CheckCircle2 class="h-4 w-4 text-green-600" />
									<span class="text-sm font-medium flex-1">{files[question._id]?.name}</span>
									<button
										class="text-sm text-muted-foreground hover:text-foreground"
										onclick={() => {
											files[question._id] = null;
											answers[question._id] = '';
											const input = document.getElementById(`file-${question._id}`) as HTMLInputElement;
											if (input) input.value = '';
										}}
									>
										Remove
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</CardContent>
				<CardFooter class="flex gap-2">
					<Button variant="outline" onclick={prevStep} disabled={currentStep === 1 && !user}>
						<ChevronLeft class="mr-2 h-4 w-4" />
						Back
					</Button>
					{#if currentStep === data.questions.length}
						<Button
							onclick={submitSupport}
							disabled={question.required && !answers[question._id]}
							class="flex-1"
						>
							Submit Support Request
							<CheckCircle2 class="ml-2 h-4 w-4" />
						</Button>
					{:else}
						<Button
							onclick={nextStep}
							disabled={question.required && !answers[question._id]}
							class="flex-1"
						>
							Next
							<ChevronRight class="ml-2 h-4 w-4" />
						</Button>
					{/if}
				</CardFooter>
			{/if}
		{/if}
	</Card>
</main>
