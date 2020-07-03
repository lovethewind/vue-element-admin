<template>
  <banner-detail :is-edit="true" />
</template>

<script>
import BannerDetail from './components/BannerDetail'

export default {
  name: 'BannerEdit',
  components: { BannerDetail }
}
</script>

