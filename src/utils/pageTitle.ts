const title = '优医问诊'

export function getPageTitle(name: string) {
  if (name) {
    return `${title}-${name}`
  }
  return `${title}`
}