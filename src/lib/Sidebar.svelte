<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import * as Dialog from '$lib/components/ui/dialog';

	import { db } from './db';
	import { liveQuery } from 'dexie';

	let files = liveQuery(() => db.files.toArray());

	let currentFileName = '';
	async function addFile() {
		try {
			const id = await db.files.add({
				name: currentFileName
			});

			status = `File ${currentFileName} successfully added. Got id ${id}`;

			currentFileName = 'SSSSSSS';
		} catch (error) {
			status = `Failed to add ${currentFileName}: ${error}`;
		}
	}
</script>

<ScrollArea class="h-full w-48 rounded-md border">
	<h4
		class="sticky top-0 w-full p-2.5 font-bold leading-none shadow-lg shadow-stone-400/10 backdrop-blur-md"
	>
		Files
		<button on:click={addFile}>+ ADD FILE</button>
		<Dialog.Root>
			<Dialog.Trigger>Open</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	</h4>

	{#if $files}
		{#each $files as file (file.id)}
			<Separator />
			<a href="/" class="block p-2 text-sm transition-colors duration-100 hover:bg-[#2a2d2e]">
				{file.name}
			</a>
		{/each}
	{/if}
</ScrollArea>

<!-- TODO: switch to SVelteKit for SPA to use links to go to specific file -->
