import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { highlight, languages } from 'prismjs';
import loadLanguages from 'prismjs/components/';

export const marked = new Marked(
    markedHighlight({
        highlight(code, language) {
            loadLanguages([language]);

            return highlight(code, languages[language], language);
        }
    })
);
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
