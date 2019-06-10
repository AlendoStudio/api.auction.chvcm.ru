const isoRegExp = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)",?/g;

export function isoDateReplacer(value: string): string {
  return value.replace(
    isoRegExp,
    (substring, group1) => `${substring} // ${new Date(group1).toString()}`,
  );
}
