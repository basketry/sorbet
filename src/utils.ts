export function from(lines: Iterable<string>): string {
  return Array.from(lines).join('\n');
}

let indentCount = 0;
const indentation = '  ';

export type Contents =
  | string
  | Iterable<string>
  | (() => string | Iterable<string>);

/**
 * Emits a code block with the supplied contents. The first line is emitted,
 * then the contents are intended, then the block is terminated with `end`
 * on its own line.
 */
export function* block(line: string, contents: Contents): Iterable<string> {
  yield line;
  yield* indent(contents);
  yield 'end';
}
export type BlockFunction = typeof block;

/** Indents the supplied contents. Indentation is preserved between calls. */
export function* indent(contents: Contents): Iterable<string> {
  try {
    indentCount++;
    for (const line of iter(contents)) {
      yield line.trim().length
        ? `${indentation.repeat(indentCount)}${line.trim()}`
        : '';
    }
  } finally {
    indentCount--;
  }
}
export type IndentFunction = typeof indent;

/** Unindents the supplied contents if the current indentation is > 0. Indentation is preserved between calls. */
export function* unindent(contents: Contents): Iterable<string> {
  const changeIndent = indentCount > 0;
  try {
    if (changeIndent) indentCount--;
    for (const line of iter(contents)) {
      yield line.trim().length
        ? `${indentation.repeat(indentCount)}${line.trim()}`
        : '';
    }
  } finally {
    if (changeIndent) indentCount++;
  }
}
export type UnindentFunction = typeof unindent;

/** Comments the supplied contents. Empty lines are preserved. */
export function* comment(contents?: Contents): Iterable<string> {
  if (!contents) {
    yield '#';
  } else {
    for (const line of iter(contents)) {
      yield line.length ? `# ${line}` : '#';
    }
  }
}
export type CommentFunction = typeof comment;

/** Converts `Contents` into an `Iterable<string>` */
function iter(contents: Contents): Iterable<string> {
  function arr(value: string | Iterable<string>): Iterable<string> {
    return typeof value === 'string' ? [value] : value;
  }

  return typeof contents === 'function' ? arr(contents()) : arr(contents);
}

export type Formatter = {
  block: BlockFunction;
  comment: CommentFunction;
  indent: IndentFunction;
  unindent: UnindentFunction;
};
export const formatter: Formatter = {
  block,
  comment,
  indent,
  unindent,
};
