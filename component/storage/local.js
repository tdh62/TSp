/**
 * 存储模块
 * Copyright @tdh
 */

// 本地长期存储
/**
 * 保存数据到本地
 * @param s 数据名称
 * @param k 数据内容
 */
function save_to_local(s,k){
    localStorage.setItem(s,k)
}

/**
 * 从本地读取数据
 * @param s 数据名称
 * @returns {string} 数据内容
 */
function read_from_local(s){
    return localStorage.getItem(s)
}

/**
 * 从本地删除数据
 * @param s 数据名称
 */
function delete_from_local(s){
    localStorage.removeItem(s)
}

/**
 * 清空本地存储的数据
 */
function clear_local_saves(){
    localStorage.clear()
}

// 本地回话存储
/**
 * 保存数据到回话
 * @param s 数据名称
 * @param k 数据内容
 */
function save_to_session(s,k){
    sessionStorage.setItem(s,k)
}

/**
 * 从会话读取数据
 * @param s 数据名称
 * @returns {string} 数据内容
 */
function read_from_session(s){
    return sessionStorage.getItem(s)
}

/**
 * 从会话删除数据
 * @param s 数据名称
 */
function delete_from_session(s){
    sessionStorage.removeItem(s)
}

/**
 * 清空会话存储的数据
 */
function clear_session_saves(){
    sessionStorage.clear()
}

// Cookies
// From w3c

/**
 * 设置 Cookie
 * @param c_name 名称
 * @param c_value 内容
 * @param ex_days 过期时间（天）
 */
function save_to_cookie(c_name, c_value, ex_days = 30) {
    const d = new Date();
    d.setTime(d.getTime() + (ex_days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = c_name + "=" + c_value + "; " + expires;
}

/**
 * 获取 Cookie 内容
 * @param c_name 名称
 * @returns {string} Cookie 内容
 */
function read_from_cookie(c_name) {
    const name = c_name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1);
        if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * 从 Cookie 中删除数据
 * @param name 数据名称
 */
function delete_from_cookie(name) {
    save_to_cookie(name, "", -1);
}

/**
 * 清空所有本地存储
 * Cookies 并不会被清空
 */
function clear_all_saves(){
    clear_local_saves()
    clear_session_saves()
}

// 常用操作
/**
 * 存储数据至本地
 *
 * 存储将优先进行字符串转换
 *
 * @param s 数据名
 * @param k 数据内容
 * @param target 存储目标（local,cookie,session）
 * @param formats 编码格式（string,base64）
 */
function saves(s,k,target="session",formats = "string"){
    if (typeof k === "object"){
        // 转换对象到 JSON 字符串
        k = json_to_str(k)
    }
    if (formats === "base64"){
        // 处理 Base64 编码
        k = b64encode(k)
    }
    if (target === "session"){
        save_to_session(s,k)
    }else if (target === "local"){
        save_to_local(s,k)
    }else if (target === "cookie"){
        save_to_cookie(s,k)
    }else{
        console.error("!!!在使用本地存储时错误地指定了目标!!!")
    }
}

/**
 * 从本地存储读取数据
 * @param s 数据名
 * @param target 存储目标（local,cookie,session）
 * @param formats 编码格式（string,base64）
 * @param toobj 转换 JSON
 * @return {object} 解析结果
 */
function reads(s,target="session",formats = "string",toobj = false){
    let k = ""
    if (target === "session"){
        k = read_from_session(s)
    }else if (target === "local"){
        k = read_from_local(s)
    }else if (target === "cookie"){
        k = read_from_cookie(s)
    }else{
        console.error("!!!在使用本地存储时错误地指定了目标!!!")
    }
    if (formats === "base64"){
        // 处理 Base64 编码
        k = b64dncode(k)
    }
    if (toobj){
        // 转换对象到 JSON 字符串
        k = str_to_json(k)
    }
    return k
}