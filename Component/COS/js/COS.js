function camSafeUrlEncode(str) {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

function getObjectKeys(obj, forKey) {
    const list = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            list.push(forKey ? camSafeUrlEncode(key).toLowerCase() : key);
        }
    }
    return list.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a === b ? 0 : (a > b ? 1 : -1);
    });
}

const obj2str = function (obj) {
    let i, key, val;
    const list = [];
    const keyList = getObjectKeys(obj);
    for (i = 0; i < keyList.length; i++) {
        key = keyList[i];
        val = (obj[key] === undefined || obj[key] === null) ? '' : ('' + obj[key]);
        key = camSafeUrlEncode(key).toLowerCase();
        val = camSafeUrlEncode(val) || '';
        list.push(key + '=' + val)
    }
    return list.join('&');
};

const binaryBase64 = function (str) {
    let i, len, char, res = '';
    for (i = 0, len = str.length / 2; i < len; i++) {
        char = parseInt(str[i * 2] + str[i * 2 + 1], 16);
        res += String.fromCharCode(char);
    }
    return btoa(res);
};

function tt() {
    /*
    进行 PUT 请求测试
     */
    let target_path = $("#target_path").val();

    let start_time = Math.round(new Date().getTime() / 1000);
    let end_time = start_time + upload_timeout;
    let timestring = start_time + ';' + end_time;

    let pds = $("#upload_json_test").val();

    let COS_SECRET_ID = $("#access_id").val();
    let COS_SECRET_KEY = $("#access_key").val();

    let msg_md5 = binaryBase64(CryptoJS.MD5(pds).toString());
    let hds = {
        // "Host": COS_URL,
        "Content-MD5": msg_md5,
    };

    const qSignAlgorithm = 'sha1';
    const qAk = COS_SECRET_ID;
    const qHeaderList = getObjectKeys(hds).join(';').toLowerCase();
    const qUrlParamList = getObjectKeys(null).join(';').toLowerCase();
    const signKey = CryptoJS.HmacSHA1(timestring, COS_SECRET_KEY).toString();
    const formatString = ["put", target_path, obj2str(null), obj2str(hds), ''].join('\n');
    const stringToSign = ['sha1', timestring, CryptoJS.SHA1(formatString).toString(), ''].join('\n');
    const qSignature = CryptoJS.HmacSHA1(stringToSign, signKey).toString();
    hds['Authorization'] = [
        'q-sign-algorithm=' + qSignAlgorithm,
        'q-ak=' + qAk,
        'q-sign-time=' + timestring,
        'q-key-time=' + timestring,
        'q-header-list=' + qHeaderList,
        'q-url-param-list=' + qUrlParamList,
        'q-signature=' + qSignature
    ].join('&');
    
    $.ajax(
        {
            type: "PUT",
            url: "https://" + COS_URL + target_path,
            data: pds,
            headers: hds,
            success: function (req_text,req_result,req_response) {
                alert(req_result);
            },
            error: function (err_data) {
                alert(err_data);
            },
            dataType: "text",
        }
    )



}

