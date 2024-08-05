import logoAvatar from '../assets/logo-avatar.webp'

export function getAvatar(avatar: string | string[], url: string) {
  if (avatar == undefined || avatar == null || avatar == 'null' || avatar == 'default') {
    return logoAvatar
  }
  if (url) {
    return url + avatar
  }
  if (!avatar.includes('/storage/profile/')) {
    return import.meta.env.VITE_APP_YUDHISTIRA_ASSET_URL + '/uploads/avatars/' + avatar
  } else {
    return import.meta.env.VITE_APP_ASSET_URL + avatar
  }
}

export function getAsset(path: string | string[]) {
  if (path != null) {
    if (path[0] != '/') {
      return import.meta.env.VITE_APP_ASSET_URL + '/' + path
    } else {
      return import.meta.env.VITE_APP_ASSET_URL + path
    }
  } else {
    return '#'
  }
}

export function getCsv(path: string, file_name: string) {
  if (path != null) {
    const base_url = import.meta.env.VITE_APP_ASSET_URL
    return base_url + '/download-csv' + '?path=' + path + '&file_name=' + file_name
  } else {
    return '#'
  }
}
