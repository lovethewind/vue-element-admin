<template>
  <media-file-detail :is-edit="false" />
</template>

<script>
import MediaFileDetail from './components/MediaFileDetail'

export default {
  name: 'MediaFileCreate',
  components: { MediaFileDetail }
}
</script>

