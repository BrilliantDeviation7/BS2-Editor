import hotkeys from 'hotkeys-js';

hotkeys.filter = (event) => {
	const target = event.target || event.srcElement;
	const { tagName } = target;

	if (target.classList.contains('cm-content')) {
		return true;
	}

	if (
		target.isContentEditable ||
		((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly)
	) {
		return false;
	}

	return true;
};

export default hotkeys;
