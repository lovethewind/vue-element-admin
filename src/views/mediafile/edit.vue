<template>
  <media-file-detail :is-edit="true" />
</template>

<script>
import MediaFileDetail from './components/MediaFileDetail'

export default {
  name: 'MediaFileEdit',
  components: { MediaFileDetail }
}
</script>

