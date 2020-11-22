const title = process.env.VUE_APP_TITLE || 'Random Theatre'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} | ${title}`
  }
  return `${title}`
}
