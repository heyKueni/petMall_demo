function timeoutCheck(arr) {
  if (arr.length) {
    let dateNow = Date.parse(new Date())
    let dateDb = arr[0].createTime
    if (dateNow - dateDb <= 1800000) {
    }
  }

  return true
}
