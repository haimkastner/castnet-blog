<template>
  <footer>
    <div class="footer__info">
      <div class="container footer__info-container">
        <div class="footer__copyright">
          © {{ year }} —
          <span v-html="$t('footer.credits')" />
          <br />
          <br />
          <span>
            |
            <a target="_blank" href="https://www.linkedin.com/in/haim-kastner/" class="ani">
              <span>Linkedin</span>
            </a>
            |
            <a target="_blank" href="https://github.com/haimkastner" class="ani">
              <span>GitHub</span>
            </a>
            |
            <a
              target="_blank"
              :href="local === 'he' ? 'https://blog.castnet.club/feed' : 'https://blog.castnet.club/en/feed'"
              class="ani"
            >
              <span>RSS</span>
            </a>
            |
          </span>
        </div>
        <!-- <a href="#top" class="footer__top-page">
          ^
        </a>-->
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
    local() {
      return this.$i18n.locale;
    }
  }
};
</script>

<style lang="scss">
.footer {
  &__info {
    background-color: $background-secondary;
    padding: 1.5em 0;
  }

  &__info-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: column;

    @media (min-width: $screen-sm) {
      flex-direction: row;
    }
  }

  &__copyright {
    text-align: center;
    margin: auto;
  }

  &__top-page {
    color: $text-negative;
    display: block;
    text-align: center;
    line-height: 1;
    -webkit-transition: 1s;
    -moz-transition: 1s;
    transition: 1s;

    @media (min-width: $screen-sm) {
      text-align: right;
    }
  }
}
</style>

