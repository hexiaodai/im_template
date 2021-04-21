/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 验证文件是否为视频
export function isVideoSuffix(filename) {
  let flag = false
  let reg = /\.[^\.]+$/;
  let matches = reg.exec(filename);
  let fileSuffix = matches[0].toLowerCase();
  const videoType = [".mp4"];
  if (videoType.includes(fileSuffix)) {
    flag = true
  }
  return flag
}

// 验证文件是否为图片
export function isImgSuffix(filename) {
  let flag = false
  let reg = /\.[^\.]+$/;
  let matches = reg.exec(filename);
  let fileSuffix = matches[0].toLowerCase();
  const imgType = [".jpg", ".png", ".gif", ".jpeg"];
  if (imgType.includes(fileSuffix)) {
    flag = true
  }
  return flag
}

// 验证文件后缀是否在数组内
export function validSuffix(filename, suffixs) {
  suffixs = suffixs || []
  let flag = false
  // let reg = /\.[^\.]+$/
  let reg = /[^\.]+$/
  let matches = reg.exec(filename)
  let fileSuffix = matches[0].toLowerCase()
  if (suffixs.includes(fileSuffix)) {
    flag = true
  }
  return flag
}

// 验证store好友是否存在
export function validFriend(list, email) {
  if (!list || !email) return false
  const friend = list[email]
  return (friend && friend.user) ? true : false
}

// 验证store群是否存在
export function validCommunity(list, id) {
  if (!list || !id) return false
  const comm = list[id]
  return (comm && comm.info) ? true : false
}