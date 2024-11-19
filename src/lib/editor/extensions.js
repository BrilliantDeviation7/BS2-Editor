import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

import { code, unsavedChanges } from '$lib/stores';

let element;
// Learned from line 184 of https://github.com/plutoniumm/sveltemirror/blob/main/src/lib/CodeMirror.svelte
// use bind:this and set parent to "element" below

import { pbasic } from './pbasic';
import { StreamLanguage } from '@codemirror/language';

import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { Tag, tags } from '@lezer/highlight';

import { snippetCompletion, autocompletion } from '@codemirror/autocomplete';

function customCompletions(context) {
	let word = context.matchBefore(/\w*/);
	if (word.from === word.to && !context.explicit) {
		return null;
	}

	return {
		from: word.from,
		options: [
			snippetCompletion('IF ${} THEN\n\t${}\nENDIF', {
				label: 'if',
				type: 'text',
				info: 'IF ... THEN\n\nENDIF'
			}),
			snippetCompletion('IF ${} THEN\n\t${}\nELSE\n\t${}\nENDIF', {
				label: 'if_else',
				type: 'text',
				info: 'IF ... THEN\n\nELSE\n\nENDIF'
			}),
			snippetCompletion('IF ${} THEN\n\t${}\nELSEIF\n\t${}\nELSE\n\t${}\nENDIF', {
				label: 'if_elseif_else',
				type: 'text',
				info: 'IF ... THEN\n\nELSEIF ... THEN\n\nELSE\n\nENDIF'
			}),
			snippetCompletion('FOR ${} = ${} to ${}\n\t${}\nNEXT', {
				label: 'for',
				type: 'text',
				detail: 'FOR...NEXT'
			}),
			snippetCompletion('DO\n\t${}\nLOOP', {
				label: 'do',
				type: 'text',
				detail: 'DO...LOOP'
			})
		]
	};
}

// https://codemirror.net/examples/styling/
let theme = EditorView.theme(
	{
		'&': {
			width: '100%',
			maxWidth: '100%',
			height: '100%',
			backgroundColor: '#1f1f1f'
		},
		'.cm-selectionBackground, ::selection': {
			backgroundColor: '#346493 !important'
		},
		'.cm-cursor': {
			width: '3px',
			backgroundColor: 'rgb(168, 168, 168)'
		},
		'.cm-content': {
			caretColor: '#0e9'
		}
	},
	{ dark: true }
);

// https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/7

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
	{ tag: tags.etDirective, color: '#008080' },
	{ tag: tags.etTargetModule, color: '#008080' },
	{ tag: tags.etIOFormatter, color: '#fbbf24' },
	{ tag: tags.etVariable, color: '#4ec9b0' },
	{ tag: tags.etConstant, color: '#2781ff' },
	{ tag: tags.etCCDirective, color: 'rgb(255, 85, 85)' },
	{ tag: tags.etInstruction, color: '#C586C0' },
	{ tag: tags.number, color: '#b5cea8' },
	{ tag: tags.variableName, color: '#9cdcfe' },
	{ tag: tags.comment, color: '#6a9955' },
	{ tag: tags.string, color: '#ce9178' }
]);

export const extensions = [
	basicSetup,
	keymap.of([indentWithTab]),
	theme,
	syntaxHighlighting(customHighlightStyle),
	new StreamLanguage(pbasic),
	EditorView.updateListener.of((update) => {
		// https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/8
		if (update.docChanged) {
			unsavedChanges.set(true);
			code.set(update.state.doc.toString());
		}
	}),
	autocompletion({
		override: [customCompletions]
	})
];
