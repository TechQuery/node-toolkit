export function makeMarkdownTable(data: Record<string, string>[]) {
    const keys = Object.keys(data[0]);

    const header = `| ${keys.join(' | ')} |`,
        body = data
            .map(item => `| ${keys.map(key => item[key]).join(' | ')} |`)
            .join('\n');

    return `${header}
|:${keys.map(() => `---`).join(':|:')}:|
${body}`;
}
