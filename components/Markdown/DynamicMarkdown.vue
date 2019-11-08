<script lang="js">
  import InlineCode from './InlineCode.vue'
  import hljs from 'highlight.js/lib/highlight'
  import javascript from 'highlight.js/lib/languages/javascript'
  import json from 'highlight.js/lib/languages/json'
  import cpp from 'highlight.js/lib/languages/cpp'
  import css from 'highlight.js/lib/languages/css'
  import xml from 'highlight.js/lib/languages/xml'
  import cmake from 'highlight.js/lib/languages/cmake'
  import makefile from 'highlight.js/lib/languages/makefile'
  import bash from 'highlight.js/lib/languages/bash'
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('makefile', makefile)
  hljs.registerLanguage('cmake', cmake)
  hljs.registerLanguage('cpp', cpp)
  hljs.registerLanguage('bash', bash)
  import 'highlight.js/styles/a11y-light.css'

  export default {
    props: ["renderFunc", "staticRenderFuncs", "extraComponent"],

    components: {
      InlineCode
    },

    computed: {
      initHighlightJs () {
        let targets = document.querySelectorAll('code')
        targets.forEach((target) => {
          hljs.highlightBlock(target)
        })
      },
      extraComponentLoader () {
        if (!this.extraComponent) {
          return null
        }
        return () => import(`~/components/blog/${this.extraComponent}.vue`)
      }
    },

    mounted() {
      this.initHighlightJs
    },

    render (createElement) {
      return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
    },

    created () {
      this.templateRender = new Function(this.renderFunc)()
      this.$options.staticRenderFns = new Function(this.staticRenderFuncs)()
    }
  }
</script>