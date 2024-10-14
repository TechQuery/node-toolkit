import { makeMarkdownTable, marked } from '../source/asset';

describe('Asset files', () => {
    it('should parse Markdown files with Code Highlight', () => {
        const code = marked.parse(
            `
\`\`\`html
<html></html>
\`\`\`
        `
        );
        expect(code).toBe(
            `<pre><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre>`
        );
    });

    it('should render an Object Array to a Markdown table', () => {
        const code = makeMarkdownTable([
            { June: '6', forth: '4' },
            { June: '六', forth: '四' }
        ]);

        expect(code).toBe(
            `
| June | forth |
|:---:|:---:|
| 6 | 4 |
| 六 | 四 |`.trim()
        );
    });
});
