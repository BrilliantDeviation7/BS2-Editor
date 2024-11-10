<script>
	import { EditorView } from '@codemirror/view';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let content = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n";

	let element;
	// Learned from line 184 of https://github.com/plutoniumm/sveltemirror/blob/main/src/lib/CodeMirror.svelte
	// use bind:this and set parent to "element" below

	import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
	import { Tag, tags } from '@lezer/highlight';

	export let editor = null;

	import { extensions } from './extensions';

	onMount(() => {
		editor = new EditorView({
			doc: content,
			extensions,
			parent: element
		});
	});

	import { currentFileName, unsavedChanges } from '$lib/stores';
</script>

<div class="relative h-full overflow-hidden rounded-md border">
	<div class="h-full text-xl" bind:this={element} />

	{#key $currentFileName}
		<p
			in:slide={{ axis: 'x', duration: 500 }}
			class="absolute right-0 top-0 text-nowrap rounded-bl-md bg-white px-2 py-1 font-mono text-sm text-black"
		>
			{$currentFileName + ($unsavedChanges ? '*' : '')}
		</p>
	{/key}
</div>
