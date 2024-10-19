<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';

	import { FilePlus } from 'lucide-svelte';

	import { db } from './db';
	import { liveQuery } from 'dexie';

	let files = liveQuery(() => db.files.toArray());

	export let currentFileId = null;

	export let unsavedChanges = false;

	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<ScrollArea class="h-full w-48 rounded-md border">
	<h4
		class="sticky top-0 flex w-full items-center justify-between p-2.5 font-bold leading-none shadow-lg shadow-stone-400/10 backdrop-blur-md"
	>
		Files
		<!-- TODO: prevent this dialog if current file has unsaved changes -->
		<button
			class="transition-transform hover:scale-110"
			on:click={() => {
				dispatch('createFile');
			}}><FilePlus class="size-5" /></button
		>
	</h4>

	{#if $files}
		{#each $files as file (file.id)}
			<Separator />
			<!-- <a href="/" class="block p-2 text-sm transition-colors duration-100 hover:bg-[#2a2d2e]">
				{file.name}
			</a> -->
			<button
				on:click={() => {
					dispatch('openFile', { id: file.id });
				}}
				class="block w-full p-2 text-left text-sm transition-colors duration-100 hover:bg-stone-100 dark:hover:bg-[#2a2d2e] {currentFileId ===
				file.id
					? 'bg-stone-200 dark:bg-[#3d3f42]'
					: ''}"
			>
				{file.name + '.bs2' + (unsavedChanges && file.id === currentFileId ? '*' : '')}
			</button>
			<!-- TODO: add close button so we can return to temp file -->
		{/each}
	{/if}
</ScrollArea>

<!-- TODO: switch to SVelteKit for SPA to use links to go to specific file -->
