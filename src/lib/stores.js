import { writable } from 'svelte/store';

export const accessControl = writable(0);

export const code = writable('');

export const unsavedChanges = writable(false);

export const currentFileName = writable('untitled');
