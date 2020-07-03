import defaultSettings from '@/settings'

const title = defaultSettings.title || '乐学后台管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
