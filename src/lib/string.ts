export function SafeString(input: string): string {
  input = input.replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/;/g, '\\;')
    .replace(/\x00/g, '\\x00')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  
  return `"${input}"`
}