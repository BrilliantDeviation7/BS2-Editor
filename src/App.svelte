<script>
	import '@fontsource-variable/manrope';
	import '@fontsource/dm-mono';
	import './app.css';
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import LineBreakTransformer from './lib/LineBreakTransformer';
	import Navbar from '$lib/Navbar.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import Editor from '$lib/editor/Editor.svelte';
	import Board from '$lib/Board.svelte';

	let port = null;

	import { onMount } from 'svelte';

	let directoryHandle;
	let currentFileHandle = null;
	let renameTargetFileHandle = null;

	import { code, unsavedChanges, currentFileName } from '$lib/stores';

	import { examples } from '$lib/examples';

	const defaultContent = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n";
	$code = defaultContent;

	const acceptedFileExtension = '.bs2';

	async function createFile(contents, openAfter = true) {
		if (
			openAfter &&
			$unsavedChanges &&
			!confirm('You have unsaved changes in this file. Discard these changes?')
		) {
			return;
		}

		const options = {
			id: 'openText',
			startIn: directoryHandle,
			suggestedName: 'untitled',
			types: [
				{
					accept: {
						'text/plain': [acceptedFileExtension, '.txt']
					}
				}
			]
		};

		const handle = await window.showSaveFilePicker(options);

		if (contents) {
			await writeFile(handle, contents);
		} else {
			await writeFile(handle, defaultContent);
		}

		if (openAfter) {
			openFile(handle);
		}

		refreshDirectory();
	}

	async function saveFile() {
		if (currentFileHandle) {
			writeFile(currentFileHandle, editor.state.doc.toString());
			$unsavedChanges = false;
		} else {
			createFile(editor.state.doc.toString());
		}
	}

	function validFileName(str) {
		return /^[a-zA-Z0-9_-]+$/.test(str);
	}

	async function renameFile(name) {
		await renameTargetFileHandle.move(name + acceptedFileExtension);
		refreshDirectory();
		currentFileHandle = renameTargetFileHandle;
		$currentFileName = currentFileHandle.name;
	}

	async function deleteFile(event) {
		if (confirm('This action cannot be undone. Delete this file?')) {
			await event.detail.fileHandle.remove();
			refreshDirectory();
			$unsavedChanges = false;
			currentFileHandle = null;
			$currentFileName = 'untitled';
			editor.setState(EditorState.create({ doc: defaultContent, extensions }));
		}
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
	let dialogType = 'create';

	let dialogs = {
		rename: {
			title: 'Rename file',
			description: 'Only alphanumeric characters, underscores, and hyphens are allowed.',
			action: renameFile
		}
	};

	// TODO: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access#storing_file_handles_or_directory_handles_in_indexeddb

	async function openFile(handle) {
		const file = await handle.getFile();
		const contents = await file.text();
		currentFileHandle = handle;
		editor.setState(EditorState.create({ doc: contents, extensions }));
		$unsavedChanges = false;
		$currentFileName = handle.name;
		$code = contents;
	}

	async function writeFile(fileHandle, contents) {
		const writable = await fileHandle.createWritable();
		await writable.write(contents);
		await writable.close();
	}

	let fileHandles = [];

	async function openDirectory() {
		directoryHandle = await window.showDirectoryPicker({
			mode: 'readwrite'
		});
	}

	async function refreshDirectory() {
		if (!directoryHandle) return;

		let newFileHandles = [];
		for await (const entry of directoryHandle.values()) {
			if (
				entry.kind === 'file' &&
				(entry.name.endsWith(acceptedFileExtension) ||
					entry.name.endsWith('.txt') ||
					!entry.name.includes('.'))
			) {
				newFileHandles.push(entry);
			}
		}
		fileHandles = newFileHandles;
	}

	$: if (directoryHandle) {
		refreshDirectory();
	}

	import { extensions } from '$lib/editor/extensions';
	import { EditorState } from '@codemirror/state';

	import hotkeys from '$lib/hotkeysFilter';

	onMount(() => {
		hotkeys('ctrl+alt+n', () => {
			createFile();
			return false;
		});
		hotkeys('ctrl+o', () => {
			openDirectory();
			return false;
		});
		hotkeys('ctrl+s', () => {
			saveFile();
			return false;
		});
	});
</script>

<ModeWatcher />
<Toaster richColors position="bottom-center" />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{dialogs[dialogType].title}</Dialog.Title>
			<Dialog.Description>{dialogs[dialogType].description}</Dialog.Description>
		</Dialog.Header>

		<form
			class="grid gap-4"
			on:submit|preventDefault={() => {
				dialogs[dialogType].action(dialogFileNameInput);
				dialogOpen = false;
			}}
		>
			<div class="relative">
				<Input type="text" bind:value={dialogFileNameInput} />
				<p class="absolute right-3 top-2 select-none font-bold opacity-75">
					{acceptedFileExtension}
				</p>
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={!validFileName(dialogFileNameInput)}
					>{dialogs[dialogType].title}</Button
				>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<div class="flex h-screen flex-col gap-3 p-3">
	<Navbar
		on:untitledFile={() => {
			if (
				$unsavedChanges &&
				!confirm('You have unsaved changes in this file. Discard these changes?')
			) {
				return;
			}

			$unsavedChanges = false;
			currentFileHandle = null;
			$currentFileName = 'untitled';
			editor.setState(EditorState.create({ doc: defaultContent, extensions }));
			$code = defaultContent;
		}}
		on:createFile={() => {
			createFile();
		}}
		on:openDirectory={openDirectory}
		on:save={saveFile}
		on:saveAs={() => {
			createFile(editor.state.doc.toString(), false);
		}}
		on:exampleFile={(event) => {
			if (
				$unsavedChanges &&
				!confirm('You have unsaved changes in this file. Discard these changes?')
			) {
				return;
			}

			$unsavedChanges = false;
			currentFileHandle = null;
			$currentFileName = event.detail.file;

			const content = examples[event.detail.category][event.detail.file];
			editor.setState(EditorState.create({ doc: content, extensions }));
			$code = content;
		}}
	/>

	<main class="flex min-h-0 grow gap-3">
		<Sidebar
			{currentFileHandle}
			{directoryHandle}
			{fileHandles}
			on:openDirectory={openDirectory}
			on:refreshDirectory={refreshDirectory}
			on:openFile={async (event) => {
				const fileHandle = event.detail.fileHandle;
				if (!$unsavedChanges) {
					openFile(fileHandle);
				} else if (
					(!currentFileHandle || currentFileHandle.name !== fileHandle.name) &&
					confirm('You have unsaved changes in this file. Discard these changes?')
				) {
					openFile(fileHandle);
				}
			}}
			on:createFile={() => {
				createFile();
			}}
			on:delete={deleteFile}
			on:rename={(event) => {
				renameTargetFileHandle = event.detail.fileHandle;
				dialogType = 'rename';
				dialogOpen = true;
			}}
		/>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane minSize={20}>
				<Editor content={defaultContent} bind:editor />
			</Resizable.Pane>
			<Resizable.Handle withHandle class="my-2" />
			<Resizable.Pane class="flex flex-col" defaultSize={15} minSize={10}>
				<Board />
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</main>
</div>
