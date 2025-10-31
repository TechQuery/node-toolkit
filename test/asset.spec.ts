import { makeMarkdownTable } from '../source/asset';

describe('Asset files', () => {
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
