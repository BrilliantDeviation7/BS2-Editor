<script>
	// import { onMount } from 'svelte';
	// import CodeMirror from 'codemirror';
	// import 'codemirror/mode/javascript/javascript.js';
	// import 'codemirror/addon/search/searchcursor.js';
	// import 'codemirror/addon/dialog/dialog.js';
	// import 'codemirror/addon/dialog/dialog.css';
	// import 'codemirror/addon/search/search.js';
	// import 'codemirror/addon/selection/mark-selection.js';
	// import 'codemirror/lib/codemirror.css';
	// // import '../assets/theme/parallax.css'; // Assuming this is the theme CSS file
	// import pbasic from './pbasic'; // Assuming this is a custom mode or addon for CodeMirror
	// pbasic(CodeMirror)

	// onMount(() => {
	//   console.log(CodeMirror)

	// 	const cm = new CodeMirror(null, {
	// 		mode: 'pbasic',
	// 		theme: 'parallax',
	// 		lineNumbers: true
	// 	});

	// 	cm.setOption('styleSelectedText', true);
	// 	cm.setOption('tabSize', 2);
	// 	cm.setOption('extraKeys', {
	// 		'Ctrl-Up': false,
	// 		'Ctrl-Down': false,
	// 		Tab: false,
	// 		'Shift-Tab': false,
	// 		'Ctrl-T': false
	// 	});
	// });

	import { basicSetup, EditorView } from 'codemirror';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let fileName;
	export let content = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n";

	let element;
	// Learned from line 184 of https://github.com/plutoniumm/sveltemirror/blob/main/src/lib/CodeMirror.svelte
	// use bind:this and set parent to "element" below

	import { pbasic } from './pbasic';
	import { StreamLanguage } from '@codemirror/language';

	import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
	import { Tag, tags } from '@lezer/highlight';

	import '../../assets/parallax.css';

	export let editor = null;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	onMount(() => {
		// https://codemirror.net/examples/styling/
		let theme = EditorView.theme(
			{
				'&': {
					width: '100%',
					maxWidth: '100%',
					height: '100%',
					color: '#DCDCAA',
					backgroundColor: '#1f1f1f'
				},
				'&.cm-selectionLayer .cm-selectionBackground, ::selection': {
					backgroundColor: 'red'
				},
				'.cm-cursor': {
					backgroundColor: 'rgb(168, 168, 168)'
				},
				'.cm-content': {
					caretColor: '#0e9'
				}
			},
			{ dark: true }
		);

		// https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/7
		// const customTags = {
		// 	etInstruction: Tag.define(),
		// 	etVariable: Tag.define()
		// };

		const styleTags = [
			'etDirective',
			'etTargetModule',
			'etIOFormatter',
			'etVariable',
			'etConstant',
			'etCCDirective',
			'etInstruction'
		];
		const customTags = styleTags.reduce((acc, name) => {
			acc[name] = Tag.define();
			return acc;
		}, {});

		Object.assign(tags, customTags);

		// MISTAKE WAS NOT EXCLUDING @lezer/highlight in vite.config.js BRUH
		// also I shoudl have used tags imported from lezer/highlight, not created let tags = {}

		const customHighlightStyle = HighlightStyle.define([
			// { tag: tags['etInstruction'], color: '#5C6E74' },
			// { tag: tags['etVariable'], color: '#DD4A68' },
			{ tag: tags.etDirective, color: '#008080' },
			{ tag: tags.etTargetModule, color: '#008080' },
			{ tag: tags.etIOFormatter, color: '#2781ff' },
			{ tag: tags.etVariable, color: '#217edf' },
			{ tag: tags.etConstant, color: '#9CDCFE' },
			{ tag: tags.etCCDirective, color: 'rgb(255, 85, 85)' },
			{ tag: tags.etInstruction, color: '#C586C0' },
			// { tag: tags.number, color: '#b5cea8' },
			// { tag: tags.variableName, color: '#4ec9b0' },
			{ tag: tags.comment, color: '#6a9955' }
		]);

		// const myHighlightStyle = HighlightStyle.define([
		// 	{ tag: 'etInstruction', color: 'red' }
		// 	// { tag: tags.etInstruction, color: '#f5d', fontStyle: 'italic' }
		// ]);
		editor = new EditorView({
			doc: content,
			extensions: [
				basicSetup,
				theme,
				syntaxHighlighting(customHighlightStyle),
				new StreamLanguage(pbasic),
				EditorView.updateListener.of((update) => {
					// https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/8
					if (update.docChanged) {
						dispatch('docChanged');
					}
				})
			],
			parent: element
		});
	});
</script>

<div class="relative h-full w-full overflow-hidden rounded-md border text-xl" bind:this={element}>
	<p
		in:slide={{ axis: 'x', duration: 500 }}
		class="absolute right-0 z-10 rounded-bl-md bg-white px-2 py-1 font-mono text-sm text-black"
	>
		{fileName ? `${fileName}.bs2` : 'untitled1'}
	</p>
</div>

<!-- TODO: save selection from before saving to preserve selection -->
<!-- TODO: save previous file ID to keep same file open after renaming (this could be fixed by using IDs instead of name) -->
