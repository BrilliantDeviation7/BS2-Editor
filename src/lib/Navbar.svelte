<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { toggleMode } from 'mode-watcher';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	let selectedBoard = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let infoDialogOpen = false;
	let dialogType = 'createFile';

	let dialogs = {
		about: {
			title: 'About',
			description: 'The BS2 Editor is built and maintained by Kevin Zhu.'
		},
		help: {
			title: 'Help',
			description: 'To report a bug or request a feature, message brilliantdeviation7 on Discord.'
		}
	};
</script>

<!-- TODO: add EXAMPLES tab which creates TEMPORARY example file (but still allows you to upload the program) -->

<Dialog.Root bind:open={infoDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{dialogs[dialogType].title}</Dialog.Title>
			<Dialog.Description>{dialogs[dialogType].description}</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<nav class="flex gap-2">
	<Menubar.Root class="grow">
		<Menubar.Menu>
			<Menubar.Trigger class="font-bold">BS2 Editor v0.1.3</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						dialogType = 'about';
						infoDialogOpen = true;
					}}>About</Menubar.Item
				>
				<Menubar.Item
					on:click={() => {
						dialogType = 'help';
						infoDialogOpen = true;
					}}>Help</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Board</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					Upload to Board
					<Menubar.Shortcut>⌘R</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />

				<!-- <Menubar.RadioGroup value={selectedBoard}>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'andy';
						}}
						value="andy">Andy</Menubar.RadioItem
					>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'benoit';
						}}
						value="benoit">Benoit</Menubar.RadioItem
					>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'Luis';
						}}
						value="Luis">Luis</Menubar.RadioItem
					>
				</Menubar.RadioGroup> -->
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						dispatch('createFile');
					}}
				>
					New File
					<Menubar.Shortcut>⌘T</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						dispatch('saveFile');
					}}>Save</Menubar.Item
				>
				<Menubar.Item
					on:click={() => {
						dispatch('downloadFile');
					}}>Save As...</Menubar.Item
				>
				<Menubar.Item
					on:click={() => {
						dispatch('renameFile');
					}}>Rename File</Menubar.Item
				>
				<Menubar.Item
					on:click={() => {
						dispatch('deleteFile');
					}}>Delete File</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Sub>
					<Menubar.SubTrigger>Examples</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>Example 1</Menubar.Item>
						<Menubar.Item>Example 2</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Edit</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>Format</Menubar.Item>
				<Menubar.Sub>
					<Menubar.SubTrigger>Snippets</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>IF...THEN...ELSE</Menubar.Item>
						<Menubar.Item>DO LOOP</Menubar.Item>
						<Menubar.Item>FOR _ = _ to _ ... NEXT</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<Button on:click={toggleMode} variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</nav>
