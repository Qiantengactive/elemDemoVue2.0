export function saveToLocal(id, key, value) {
    let seller = window.location.__seller__
    if (!seller) {
        seller = {}
        seller[id] = {}
    } else {
        // json字符串需要解析
        seller = JSON.parse(seller)
        if (!seller[id]) {
            seller[id] = {}
        }
    }
    seller[id][key] = value
    // localStorage只能存储字符串,需要转成json字符串
    window.localStorage.__seller__ = JSON.stringify(seller)
}
// 读取三个参数,seller的id,之前存储的key,和一个默认值
export function loadFromLocal(id, key, def) {
    let seller = window.localStorage.__seller__
    // 读取不到返回默认值
    if (!seller) {
        return def
    }
    seller = JSON.parse(seller)[id]
    if (!seller) {
        return def
    }
    let ret = seller[key]
    return ret || def
}
