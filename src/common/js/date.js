export function formatDate(date, fmt) {
    // 在es6下导出一个函数
    // 对一个或多个y进行匹配,匹配到就进行年的替换(年有四位,所以需要特殊处理)
    let o = {
        'M+': date.getMonth() + 1, // js的月是从0开始算,所以要加1
        'd+': date.getData(),
        'h+': data.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    //对月,日,时,分,秒进行匹配替换(这些都是两位,可以一起处理)
    for (let k in o) {
        if (new RegExp('(${k})').test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            )
        }
    }
    return fmt
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}
