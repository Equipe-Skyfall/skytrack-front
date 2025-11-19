import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for environments where they're missing (jsdom/node)
// Node's util provides TextEncoder/TextDecoder in newer versions
try {
	// @ts-ignore
	if (typeof TextEncoder === 'undefined') {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { TextEncoder, TextDecoder } = require('util');
		// @ts-ignore
		global.TextEncoder = TextEncoder;
		// @ts-ignore
		global.TextDecoder = TextDecoder;
	}
} catch (e) {
	// ignore if require fails
}
