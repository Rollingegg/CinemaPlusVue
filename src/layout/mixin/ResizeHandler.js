import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  beforeMount () {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted () {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('toggleDevice', 'mobile')
    }
  },
  methods: {
    $_isMobile () {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop')
      }
    }
  }
}
