let index = 0;

export function step<T>(
    title: string,
    logic: (index: number, title: string, end: boolean) => T,
    reset?: boolean
): T {
    title = ` ${++index}. ${title}`;

    console.info(`\n${title}\n ${'-'.repeat(title.length - 1)}`);

    const result = logic(index, title, reset);

    if (reset) index = 0;

    return result;
}
