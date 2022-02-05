/**
 * 腾讯云存储(COS)模块
 * Copyright @tdh
 */

/**
 * 存储使用
 *
 * 本地会话存储：
 * * AccessID: 腾讯云 Access ID
 * * AccessKey: 腾讯云 Access Key
 *
 */

class TencentCOS{
    set_user_name(s){
        return this.setAccessID(s)
    }

    set_password(s){
        return this.setAccessKey(s)
    }

    clear_user_name(s){
        delete_from_local("AccessID")
    }

    clear_password(s){
        delete_from_local("AccessKey")
    }

    //save_text_to_remote

    /**
     * 设置 AccessID
     * @param s AccessID 字符串
     */
    setAccessID(s) {
        save_to_local("AccessID",s)
    }

    setAccessKey(s) {
        save_to_local("AccessKey",s)
    }

    /**
     * 腾讯 COS 数据转字符串
     *
     * From Tencent COS documnets
     */
    obj2str(obj) {
        let i, key, val;
        const list = [];
        const keyList = this.getObjectKeys(obj);
        for (i = 0; i < keyList.length; i++) {
            key = keyList[i];
            val = (obj[key] === undefined || obj[key] === null) ? '' : ('' + obj[key]);
            key = this.camSafeUrlEncode(key).toLowerCase();
            val = this.camSafeUrlEncode(val) || '';
            list.push(key + '=' + val)
        }
        return list.join('&');
    }

    /**
     * From Tencent COS API documents
     * URL 编码
     */
    camSafeUrlEncode(str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    }

    /**
     * From Tencent COS API documents
     */
    getObjectKeys(obj, forKey) {
        const list = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                list.push(forKey ? this.camSafeUrlEncode(key).toLowerCase() : key);
            }
        }
        return list.sort(function (a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            return a === b ? 0 : (a > b ? 1 : -1);
        });
    }

    /**
     * 生成腾讯云签名所需的时间字符串
     * @return {string}
     */
    cos_time_string(){
        // COS 时间字符串
        let start_time = Math.round(new Date().getTime() / 1000);
        let end_time = start_time + upload_timeout;
        return start_time + ';' + end_time;
    }

    /**
     * 腾讯云 PUT 方法签名
     * @param fpath 路径
     * @param hd 请求头
     * @return {(*|string)[]} 签名结果，时间字符串
     */
    cos_put_sign(fpath,hd){
        // COS PUT 签名
        let timestring = this.cos_time_string()
        const signKey = CryptoJS.HmacSHA1(timestring, read_from_local("AccessKey")).toString();
        const formatString = ["put", fpath, this.obj2str(null), this.obj2str(hd), ''].join('\n');
        const stringToSign = ['sha1', timestring, CryptoJS.SHA1(formatString).toString(), ''].join('\n');
        return [CryptoJS.HmacSHA1(stringToSign, signKey).toString(),timestring]
    }

    /**
     * 腾讯云 POST 方法签名
     * @param timestring 时间字符串
     * @param Policy 策略
     * @return {string} 签名结果
     */
    cos_post_sign(timestring,Policy){
        // COS POST 签名
        const signKey = CryptoJS.HmacSHA1(timestring, read_from_local("AccessKey")).toString();
        const StringToSign = CryptoJS.SHA1(JSON.stringify(Policy)).toString()
        return CryptoJS.HmacSHA1(StringToSign, signKey).toString()
    }

    /**
     * 保存 Json 数据到腾讯云 COS
     * @param target_path 目标保存路径
     * @param json_string 需要保存的数据
     * @param content_type 数据类型
     * @param callback 回调
     * @return {string} 资源 URL
     */
    save_text_to_remote(target_path, json_string, content_type = "application/json",callback = null){
        const hd = {
            "Cache-Control":"no-cache",
            "Content-Type":content_type,
        }
        let rUrl = ""
        let sign,timestring
        hd["Content-MD5"] = binaryBase64(CryptoJS.MD5(json_string).toString());
        [sign,timestring] =this.cos_put_sign(target_path,hd)
        hd['Authorization'] = [
            'q-sign-algorithm=sha1',
            'q-ak=' + read_from_local("AccessID"),
            'q-sign-time=' + timestring,
            'q-key-time=' + timestring,
            'q-header-list=' + this.getObjectKeys(hd).join(';').toLowerCase(),
            'q-url-param-list=' + this.getObjectKeys(null).join(';').toLowerCase(),
            'q-signature=' + sign
        ].join('&');
        rUrl = COS_URL + target_path

        // 执行请求
        let config ={
            headers: hd,
        }
        axios.put(rUrl,json_string,config).then(function (response) {
            // console.log(response);
            callback(response)
        }).catch(function (error) {
            console.log(error);
        })

        return rUrl
    }

}
const remoteStorage = new TencentCOS()
