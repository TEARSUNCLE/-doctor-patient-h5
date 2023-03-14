/** 身份证信息脱敏 */
export const Desensitize = (str: string, start: number, end: number) => {
  const temp = str.slice(start, end)
  return str.replace(temp, '******')
}