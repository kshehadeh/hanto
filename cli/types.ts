export function isIterator(variable: unknown): variable is Iterator<unknown> {
    return (
        variable !== null &&
        typeof variable === 'object' &&
        typeof (variable as { [Symbol.iterator]: unknown })[Symbol.iterator] ===
            'function' &&
        typeof (variable as Iterator<unknown>).next === 'function'
    );
}

export function isIteratorEmpty(iterator: Iterator<unknown>): boolean {
    return 'length' in iterator
        ? iterator.length === 0
        : iterator.next().done || false;
}
