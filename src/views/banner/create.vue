<template>
  <banner-detail :is-edit="false" />
</template>

<script>
import BannerDetail from './components/BannerDetail'

export default {
  name: 'BannerCreate',
  components: { BannerDetail }
}
</script>

