<script>
	import '@fontsource-variable/manrope';
	import '@fontsource/dm-mono';
	import './app.css';
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import { onMount } from 'svelte';
	import LineBreakTransformer from './lib/LineBreakTransformer';
	import Navbar from '$lib/Navbar.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import Editor from '$lib/editor/Editor.svelte';
	import Board from '$lib/Board.svelte';

	let port = null;

	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { createEventDispatcher } from 'svelte';

	import { toast } from 'svelte-sonner';

	let currentFileId = null;
	let unsavedChanges = false;

	import { code } from '$lib/stores';

	const defaultContent = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n";

	$: currentFile = currentFileId ? liveQuery(() => db.files.get(currentFileId)) : null;
	$: if ($currentFile) {
		$code = $currentFile.content;
	} else {
		$code = defaultContent;
	}

	async function createFile(name) {
		if (name.length < 1) {
			toast.error('File name cannot be empty!');
			return;
		}

		try {
			const id = await db.files.add({
				name,
				content: defaultContent
			});
			currentFileId = id;
			toast.success(`Successfully created ${name}.bs2`);
		} catch (error) {
			console.log(error);
			if (error.name === 'ConstraintError') {
				toast.error('A file with the same name already exists!');
			}
		}
	}

	async function saveFile() {
		if (currentFileId && $currentFile) {
			await db.files.update($currentFile.id, {
				content: editor.state.doc.toString()
			});

			toast.success('File saved successfully!');
			unsavedChanges = false;
		}
	}

	async function renameFile(name) {
		if (currentFileId && $currentFile) {
			const content = editor.state.doc.toString();

			await db.files.update($currentFile.id, {
				name,
				content
			});
		}
	}

	async function deleteFile() {
		if (currentFileId && $currentFile) {
			if (confirm('Delete this file? This action cannot be undone.')) {
				await db.files.delete(currentFileId);
				currentFileId = null;
				unsavedChanges = false;
			}
		} else {
			toast.warning('No file selected!');
		}
	}

	async function downloadFile() {
		const content = editor.state.doc.toString();

		const blob = new Blob([content], { type: 'text/plain' });

		const a = document.createElement('a');

		a.href = URL.createObjectURL(blob);

		a.download = $currentFile?.name ? $currentFile.name + '.bs2' : 'untitled.bs2';

		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	let editor = null;

	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	import * as Resizable from '$lib/components/ui/resizable';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let dialogFileNameInput = '';
	let dialogOpen = false;

	let dialogType = 'createFile';

	let dialogs = {
		create: {
			title: 'Create a new file',
			description: 'Only alphanumeric characters, underscores, and hyphens are allowed.',
			action: createFile
		},
		rename: {
			title: 'Rename file',
			description: 'Only alphanumeric characters, underscores, and hyphens are allowed.',
			action: renameFile
		}
	};
</script>

<ModeWatcher />
<Toaster richColors position="bottom-center" />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{dialogs[dialogType].title}</Dialog.Title>
			<Dialog.Description>{dialogs[dialogType].description}</Dialog.Description>
		</Dialog.Header>
		<Input type="text" bind:value={dialogFileNameInput} />

		<!-- Make it so you can press enter using <form> and then on:submit controlled usage -->
		<!-- https://www.bits-ui.com/docs/components/dialog#controlled-usage -->
		<Dialog.Footer>
			<Button
				on:click={() => {
					dialogs[dialogType].action(dialogFileNameInput);
					dialogOpen = false;
				}}>{dialogs[dialogType].title}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="flex h-screen flex-col gap-3 p-3">
	<Navbar
		on:saveFile={saveFile}
		on:renameFile={() => {
			dialogType = 'rename';
			dialogOpen = true;
		}}
		on:deleteFile={deleteFile}
		on:createFile={() => {
			dialogType = 'create';
			dialogOpen = true;
		}}
		on:downloadFile={downloadFile}
	/>

	<main class="flex min-h-0 grow gap-3">
		<Sidebar
			{unsavedChanges}
			{currentFileId}
			on:openFile={(event) => {
				if (!unsavedChanges) {
					currentFileId = event.detail.id;
				} else if (
					currentFileId !== event.detail.id &&
					confirm('You have unsaved changes in this file. Discard these changes?')
				) {
					currentFileId = event.detail.id;
					unsavedChanges = false;
				}
			}}
			on:createFile={() => {
				dialogType = 'create';
				dialogOpen = true;
			}}
		/>
		<!-- PASS $currentFile straight into Editor component and let editor component handle it. -->
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane class="min-h-32">
				{#key $currentFile}
					<Editor
						fileName={$currentFile?.name}
						content={$currentFile?.content}
						bind:editor
						on:docChanged={() => {
							unsavedChanges = true;
							$code = editor.state.doc.toString();
						}}
					/>
				{/key}
			</Resizable.Pane>
			<Resizable.Handle withHandle class="my-2" />
			<Resizable.Pane class="flex min-h-32 flex-col md:min-h-20" defaultSize={10}>
				<Board />
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</main>
</div>
