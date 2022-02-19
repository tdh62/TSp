const upload_timeout = 30; // 上传云存储超时时间

//---------------------------测试用---------------------------------

const useRemoteStorage = "COS"

// 腾讯云 COS
const COS_URL = "https://tsp-1252066102.cos.ap-guangzhou.myqcloud.com";

const Resent_Article_Number = 20  // 最近文章存多少
const Article_Prepage_Number = 2  // 文章单页存多少

const site_base_files = [
    "/about.html",
    "/index.html",
    "/article.html",
    "/footer.html",
    "/setting.html",
    "/article-index.html",
    "/admin"
]  // 避免覆盖的内容
