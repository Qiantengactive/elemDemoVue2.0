/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
    /*window.location 对象所包含的属性
        属性	描述
        hash	从井号(#) 开始的 URL（锚）
        host	主机名和当前 URL 的端口号
        hostname	当前 URL 的主机名
        href	完整的 URL
        pathname	当前 URL 的路径部分
        port	当前 URL 的端口号
        protocol	当前 URL 的协议
        search	从问号(?) 开始的 URL（查询部分
     */
    let url = window.location.search
    let obj = {}
    let reg = /[?&][^?&]+=[^?&]+/g
    //^ 有或者没有
    //[]表示匹配的字符在[]中，并且只能出现一次
    //. 代表任意字符，
    // +代表匹配一个或更多字符，
    // ？代表非贪婪匹配
    let arr = url.match(reg)
    // ['?id=12345', '&a=b']
    if(arr){
        arr.forEach(objItem=>{
            let tempArr = objItem.substring(1).split('=')
            let key = decodeURIComponent(tempArr[0])
            let value = decodeURIComponent(tempArr[1])
            obj[key] = val
        })
    }
    return obj
}