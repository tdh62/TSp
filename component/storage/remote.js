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
 */
function save_to_remote(s,k){
    remoteStorage.save_json("/settings/" + s + ".txt","{\"data\":\"" + k + "\"}")
}


