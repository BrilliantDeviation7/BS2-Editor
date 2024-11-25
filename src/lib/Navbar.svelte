<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { toggleMode } from 'mode-watcher';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import ClipboardCopy from 'lucide-svelte/icons/clipboard-copy';

	let selectedBoard = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let infoDialogOpen = false;
	let dialogType = 'createFile';

	let dialogs = {
		about: {
			title: 'About',
			description:
				'The BS2 Editor is maintained by Kevin Zhu and built with Vite + Svelte, Tailwind CSS, and shadcn-svelte. The compilation and flash functionality is based on the open-source Skewax IDE. To report a bug or request a feature, message brilliantdeviation7 on Discord.'
		}
	};

	import { examples } from '$lib/examples';
</script>

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
			<Menubar.Trigger class="font-bold italic tabular-nums">BS2 Editor v0.6.1</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						dialogType = 'about';
						infoDialogOpen = true;
					}}>About</Menubar.Item
				>
				<Menubar.Item
					href="https://github.com/BrilliantDeviation7/BS2-Editor"
					target="_blank"
					rel="noreferrer">GitHub</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						dispatch('untitledFile');
					}}
				>
					New Untitled File
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						dispatch('createFile');
					}}
				>
					New File...
					<Menubar.Shortcut>Ctrl+Alt+N</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					on:click={() => {
						dispatch('openDirectory');
					}}
				>
					Open Folder...
					<Menubar.Shortcut>Ctrl+O</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					on:click={() => {
						dispatch('save');
					}}
				>
					Save
					<Menubar.Shortcut>Ctrl+S</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						dispatch('saveAs');
					}}>Save As...</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Item
					on:click={() => {
						dispatch('copyFiles');
					}}
				>
					Copy All Files
					<Menubar.Shortcut>
						<ClipboardCopy />
					</Menubar.Shortcut>
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Examples</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Sub>
					<Menubar.SubTrigger>Control</Menubar.SubTrigger>
					<Menubar.SubContent>
						{#each Object.keys(examples.control) as file}
							<Menubar.Item
								on:click={() => {
									dispatch('exampleFile', { category: 'control', file });
								}}>{file}</Menubar.Item
							>
						{/each}
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Sub>
					<Menubar.SubTrigger>Data & I/O</Menubar.SubTrigger>
					<Menubar.SubContent>
						{#each Object.keys(examples.data) as file}
							<Menubar.Item
								on:click={() => {
									dispatch('exampleFile', { category: 'data', file });
								}}>{file}</Menubar.Item
							>
						{/each}
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Sub>
					<Menubar.SubTrigger>BS2</Menubar.SubTrigger>
					<Menubar.SubContent>
						{#each Object.keys(examples.bs2) as file}
							<Menubar.Item
								on:click={() => {
									dispatch('exampleFile', { category: 'bs2', file });
								}}>{file}</Menubar.Item
							>
						{/each}
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Sub>
					<Menubar.SubTrigger>Other</Menubar.SubTrigger>
					<Menubar.SubContent>
						{#each Object.keys(examples.other) as file}
							<Menubar.Item
								on:click={() => {
									dispatch('exampleFile', { category: 'other', file });
								}}>{file}</Menubar.Item
							>
						{/each}
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
