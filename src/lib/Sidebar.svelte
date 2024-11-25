<script>
	import FolderInput from 'lucide-svelte/icons/folder-input';
	import FolderSync from 'lucide-svelte/icons/folder-sync';
	import FilePlus from 'lucide-svelte/icons/file-plus';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { Separator } from '$lib/components/ui/separator';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let directoryHandle;
	export let fileHandles;
	export let currentFileHandle;

	import { unsavedChanges } from '$lib/stores';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

{#if directoryHandle && fileHandles}
	<div class="relative flex w-48 flex-col overflow-hidden rounded-md border">
		<h2
			class="mr-auto w-full overflow-hidden text-ellipsis text-nowrap px-2 py-1 text-sm font-bold"
		>
			{directoryHandle.name}
		</h2>
		<div class="flex justify-end border-b shadow-sm">
			<button
				title="Open directory"
				class="p-1 hover:bg-accent"
				on:click={() => {
					dispatch('openDirectory');
				}}
			>
				<FolderInput class="size-5" />
			</button>
			<button
				title="Refresh directory"
				class="p-1 hover:bg-accent"
				on:click={() => {
					dispatch('refreshDirectory');
				}}
			>
				<FolderSync class="size-5" />
			</button>
			<button
				title="Create new file"
				class="p-1 hover:bg-accent"
				on:click={() => {
					dispatch('createFile');
				}}
			>
				<FilePlus class="size-5" />
			</button>
		</div>

		<div class="h-full overflow-x-hidden overflow-y-scroll font-mono">
			{#each fileHandles as fileHandle}
				<div class="relative">
					<button
						title={fileHandle.name}
						on:click={() => {
							dispatch('openFile', { fileHandle });
						}}
						class="w-full overflow-hidden text-ellipsis p-2 pr-6 text-left text-sm transition-colors duration-100 {currentFileHandle?.name ===
						fileHandle.name
							? 'bg-stone-200 dark:bg-[#3d3f42]'
							: 'hover:bg-stone-100 dark:hover:bg-[#2a2d2e]'}"
					>
						{fileHandle.name +
							($unsavedChanges && currentFileHandle?.name === fileHandle.name ? '*' : '')}
					</button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="absolute right-1 top-2 rounded-sm p-0.5 hover:bg-accent">
							<EllipsisVertical class="size-4" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Item
									on:click={() => {
										dispatch('rename', { fileHandle });
									}}>Rename</DropdownMenu.Item
								>
								<DropdownMenu.Item
									on:click={() => {
										dispatch('delete', { fileHandle });
									}}>Delete</DropdownMenu.Item
								>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
				<Separator class="last:hidden" />
			{/each}
		</div>
	</div>
{:else if !('showOpenFilePicker' in self)}
	<p class="flex w-48 items-center rounded-md border p-4">
		The File System Access API is not available in this browser.
	</p>
{:else}
	<div class="flex w-48 items-center overflow-hidden rounded-md border p-2">
		<Button
			class="w-full"
			on:click={() => {
				dispatch('openDirectory');
			}}>Open Directory</Button
		>
	</div>
{/if}
