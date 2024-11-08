export function SafeString(input: string): string {
  input = input.replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/;/g, '\\;')
    .replace(/\f/g, '\\f')
    .replace(/\t/g, '\\t')
    .replace(/\x00/g, '\\x00')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u0008/g, '\\b');
  
  return `"${input}"`
}