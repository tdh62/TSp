/**
 * 通用功能
 * Copyright @tdh
 *
 * 通用模块应最先被导入
 */

/**
 * 解析 JSON 字符串
 * @param s
 * @returns {any}
 */
function str_to_json(s){
    return eval(s)
}

/**
 * 对象转为 JSON 字符串
 * @param j
 * @returns {string}
 */
function json_to_str(j){
    if (typeof(j) === "object"){
        return JSON.stringify(j)
    }else if(typeof(j) === "string"){
        return j
    }else{
        return ""
    }
}

/**
 * Base64 编码
 * @param s 字符串
 * @returns {string} 编码结果
 */
function b64encode(s){
    return window.btoa(s)
}

/**
 * Base64 解码
 * @param s 字符串
 * @returns {string} 解码结果
 */
function b64decode(s){
    return window.atob(s)
}

/**
 * 文件 Base64 编码
 * @param f 待编码文件
 */
function file_b64encode(f){
    return (new FileReader()).readAsDataURL(f)
}


/**
 * binaryBase64 计算
 *
 * // From tencent cloud API documents
 * @param str 待编码数据
 * @returns {string} Base64 编码后的数据
 */
const binaryBase64 = function (str) {
    let i, len, char, res = '';
    for (i = 0, len = str.length / 2; i < len; i++) {
        char = parseInt(str[i * 2] + str[i * 2 + 1], 16);
        res += String.fromCharCode(char);
    }
    return btoa(res);
};

/**
 * 获取 GET 请求中的参数
 * @param variable 参数名
 * @return {string|null} 请求内容
 */
function getQueryVariable(variable)
{
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i=0; i<vars.length; i++) {
        const pair = vars[i].split("=");
        if(pair[0] === variable){
            return pair[1];
        }
    }
    return null;
}

/**
 * 更改页面标题
 * @param s 标题
 */
function change_title(s){
    document.title = s
}

/**
 * 更改页面 URL 而不触发刷新
 * @param s 新链接
 */
function change_url_without_refresh(s){
    history.pushState({}, '', s)
}

/**
 * AES 加密
 * @param s 带加密内容
 * @param k 密码
 * @return {string} 加密结果
 */
function AES_encrypt(s,k){
    return AESJS.AES.encrypt(JSON.stringify(s), k).toString();
}

/**
 * AES 解密
 * @param s 带解密内容
 * @param k 密码
 * @return {string} 解密结果
 */
function AES_decrypt(s,k){
    return str_to_json(AESJS.AES.decrypt(s.toString(), k).toString(AESJS.enc.Utf8));
}

/**
 * 设置 Mate 里的描述内容
 * @param s 描述内容
 */
function setDescription(s){
    document.querySelector('meta[name="description"]').setAttribute("content", s);
}

/**
 * 设置 Mate 里的描述内容
 * @param s 描述内容
 */
function setKeyWords(s){
    document.querySelector('meta[name="keywords"]').setAttribute("content", s);
}