export const capitalize = (str: string): string => {
  const firstChar = str.charAt(0)
  return firstChar + str.slice(1)
}
