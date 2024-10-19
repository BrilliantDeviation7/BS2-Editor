<script>
	import { FilePlus } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator';

	import { db } from './db';
	import { liveQuery } from 'dexie';

	let files = liveQuery(() => db.files.toArray());

	export let currentFileId = null;

	export let unsavedChanges = false;

	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="relative w-48 overflow-hidden rounded-md border">
	<button
		class="absolute right-0 flex rounded-bl-md border-b border-l bg-background p-1 font-mono"
		on:click={() => {
			dispatch('createFile');
		}}
	>
		<!-- TODO: prevent this dialog if current file has unsaved changes -->
		<FilePlus class="size-5" />
	</button>

	<div class="h-full overflow-x-hidden overflow-y-scroll">
		{#if $files}
			{#each $files as file (file.id)}
				<button
					title={file.name + '.bs2'}
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
				<Separator class="last:hidden" />
				<!-- TODO: add close button so we can return to temp file -->
			{/each}
		{/if}
	</div>
</div>
