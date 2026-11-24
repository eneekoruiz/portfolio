/** Keep connected scripts intact; grapheme clusters include combining marks. */
const connected = /[\p{Script=Arabic}\p{Script=Devanagari}]/u;
const cjk =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const segmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

export function kineticGroups(text: string, wrap: boolean) {
  const joined = connected.test(text);
  const graphemes = (value: string) =>
    segmenter
      ? Array.from(segmenter.segment(value), (item) => item.segment)
      : Array.from(value.normalize("NFC"));
  if (joined)
    return text
      .split(/(\s+)/u)
      .filter(Boolean)
      .map((word) => [word]);
  if (cjk.test(text)) return graphemes(text).map((char) => [char]);
  if (!wrap && !/\s/u.test(text)) return [graphemes(text)];
  return text.split(/(\s+)/u).filter(Boolean).map(graphemes);
}
