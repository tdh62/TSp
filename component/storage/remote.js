/**
 * 远程存储模块
 * Copyright @tdh
 */

/**
 * 设置 Access ID 和 Access Key
 * @param u AccessID
 * @param p AccessKey
 */
function set_login(u,p){
    remoteStorage.set_user_name(u)
    remoteStorage.set_password(p)
    save_to_session("logined","1")
}

/**
 * 清空 Session 内的登录信息
 */
function clear_login(){
    remoteStorage.clear_user_name()
    remoteStorage.clear_password()
    delete_from_session("logined")
}

/**
 * 返回登录状态
 * @return {boolean}
 */
function check_login(){
    return read_from_session("logined") === "1"
}

/**
 * 从远端读取一个值
 * @param s 名称
 * @param callback 成功回调（接受字符串）
 * @param failureCallback 失败回调（接受失败信息）
 */
function read_from_remote(s,callback,failureCallback){
    axios.get(COS_URL + "/settings/" + s + ".txt").then(function (r){callback(r.data.data)}).catch(failureCallback)
}

/**
 * 在远端存储一个值
 * @param s 名称
 * @param k 内容
 * @param callback 成功回调
 */
function save_to_remote(s,k,callback=function (v){}){
    remoteStorage.save_text_to_remote("/settings/" + s + ".txt","{\"data\":\"" + k + "\"}","text/plain",callback)
}


// 常用操作
/**
 * 存储数据至远端
 *
 * @param path 数据路径
 * @param k 数据内容
 * @param content_type 数据类型（默认JSON）
 * @param callback 成功回调
 */
function saves_remote(path,k,content_type = "application/json",callback=function (v){}){
    // console.log(typeof k)
    if (typeof k === "object"){
        // 转换对象到 JSON 字符串
        k = json_to_str(k)
    }
    remoteStorage.save_text_to_remote(path,k,content_type,callback)
}

/**
 * 读取远端数据
 *
 * @param path 数据路径
 * @param callback 回调
 * @param toobj 转换 JSON
 * @param errCallback 失败回调
 */
function reads_remote(path,callback,toobj = false,errCallback = (r)=>{console.warn(r)}){
    axios.get(COS_URL + path).then((r)=>{
        if (toobj){
            callback(str_to_json(r.data))
        }else{
            callback(r.data)
        }
    }).catch(errCallback)
}
