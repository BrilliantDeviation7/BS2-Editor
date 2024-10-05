<script>
	import './app.css';
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import { onMount } from 'svelte';
	import LineBreakTransformer from './lib/LineBreakTransformer';
	import Navbar from '$lib/Navbar.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import Editor from '$lib/editor/Editor.svelte';

	onMount(() => {
		if ('serial' in navigator) {
			console.log('Web SERIAL API supported!');
		} else {
			console.log('not supported');
		}
	});

	let port = null;

	async function choosePort() {
		if ('serial' in navigator) {
			try {
				port = await navigator.serial.requestPort();
				console.log(port);

				await port.open({
					baudRate: 9600
				});

				const textDecoder = new TextDecoderStream();
				const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
				const reader = textDecoder.readable
					.pipeThrough(new TransformStream(new LineBreakTransformer()))
					.getReader();

				// Listen to data coming from the serial device.
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						// Allow the serial port to be closed later.
						reader.releaseLock();
						break;
					}
					// value is a string.
					console.log(value);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { createEventDispatcher } from 'svelte';

	import { toast } from 'svelte-sonner';

	let currentFileName = null;
	let unsavedChanges = false;

	$: currentFile = liveQuery(() => db.files.where({ name: currentFileName }).first());

	async function closePort() {}

	const defaultContent = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n";

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
			toast.success(`Successfully created ${name}.bs2`);
			// TODO: switch to "currentFileId" instead of name
		} catch (error) {
			console.log(error);
			if (error.name === 'ConstraintError') {
				toast.error('A file with the same name already exists!');
			}
		}

		currentFileName = name;
	}

	async function saveFile() {
		if (currentFileName && $currentFile) {
			await db.files.update($currentFile.id, {
				content: editor.state.doc.toString()
			});

			toast.success('File saved successfully!');
			unsavedChanges = false;
		}
	}

	async function renameFile(name) {
		if (currentFileName && $currentFile) {
			await db.files.update($currentFile.id, {
				name
			});
		}
	}

	async function deleteFile() {
		if (currentFileName && $currentFile) {
			if (confirm('Delete this file? This action cannot be undone.')) {
				await db.files.delete($currentFile.id);
				currentFileName = null;
			}
		} else {
			toast.warning('No file selected!');
		}
	}

	let editor = null;

	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	import { buttonVariants } from '$lib/components/ui/button';

	import * as Dialog from '$lib/components/ui/dialog';
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
<Toaster richColors />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{dialogs[dialogType].title}</Dialog.Title>
			<Dialog.Description>{dialogs[dialogType].description}</Dialog.Description>
		</Dialog.Header>
		<Input type="text" bind:value={dialogFileNameInput} />

		<!-- Make it so you can press enter using <form> and then on:submit controlled usage -->
		<!-- https://www.bits-ui.com/docs/components/dialog#controlled-usage -->
		<Dialog.Close
			on:click={() => {
				dialogs[dialogType].action(dialogFileNameInput);
			}}
			class={buttonVariants({ variant: 'default' })}
		>
			{dialogs[dialogType].title}
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>

<div class="flex h-screen flex-col gap-3 p-3">
	<Navbar
		on:saveFile={saveFile}
		on:renameFile={() => {
			dialogType = 'rename';
			dialogOpen = true;
			// TODO: renaming a file with unsaved changes will discard changes
		}}
		on:deleteFile={deleteFile}
	/>

	<main class="flex min-h-0 grow gap-3">
		<Sidebar
			{unsavedChanges}
			{currentFileName}
			on:openFile={(event) => {
				if (!unsavedChanges) {
					currentFileName = event.detail.name;
				} else if (
					currentFileName !== event.detail.name &&
					confirm('You have unsaved changes in this file. Discard these changes?')
				) {
					currentFileName = event.detail.name;
					unsavedChanges = false;
				}
			}}
			on:createFile={() => {
				dialogType = 'create';
				dialogOpen = true;
			}}
		/>
		<!-- PASS $currentFile straight into Editor component and let editor component handle it. -->
		{#key $currentFile}
			<Editor
				fileName={currentFileName}
				content={$currentFile?.content}
				bind:editor
				on:docChanged={() => {
					unsavedChanges = true;
				}}
			/>
		{/key}
	</main>
</div>

<!-- {#if port}
	<button on:click={closePort}>CLOSE PORT</button>
{:else}
	<button on:click={choosePort}>Choose port</button>
{/if} -->

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.read-the-docs {
		color: #888;
	}
</style>
