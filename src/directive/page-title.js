const title = process.env.VUE_APP_TITLE || 'Random Theatre'
const pageTitle = {
  inserted (el, binding) {
    // binding参数是只读的，因而使用dataset来传参
    document.title = `${el.dataset.title} | ${title}`
    console.log(el.dataset.title)
  }
}
export default pageTitle
