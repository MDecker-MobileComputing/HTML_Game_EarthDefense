# Agent Instructions

## Code Formatting

- After every opening curly brace (`{`), add a new line before the next statement, but before an closing curly brace there must not be an empty line.
- For completely empty curly brace pairs (for example, an empty argument list of a function), add no line breaks.#
- After every opening parenthesis (`(`), add a space, and before every closing parenthesis (`)`, add a space. Completely empty parenthesis pairs (`()`) do not need spaces.

- These rules apply to JavaScript code.

## Code Order

- In a JavaScript file, all constants and variables must be declared before the first function (for example, `window.addEventListener(...)`).
- `window.addEventListener(...)` should always be the first function in the script.

## Code Comments

- Each function in JavaScript must have a block comment in the `/* ... */` format explaining what it does. Do not use single-line comments (`// ...`) for this purpose.
- Before each block comment there should be two empty lines.
