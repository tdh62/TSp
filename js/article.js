/**
 * 文章阅读页面
 */

const aapp = Vue.createApp({
    data(){
        return {
            "article_id":null,
            "article_link":null,
            "article_info":{
                "author":"",
                "tags":"",
                "aclass":"",
                "pubtime":"0",
                "description":"",
                "keywords":"",
            },
            "scrtimer":null,
            "scrollnum":0,
            "loading":true,
            "wait_password":false,
            "artpassword":"",
            "aclass_list":[{
                cid: '0',
                cname: '默认分类',
            }],
            "mdlist":[]
        }
    },
    computed:{
        "pubtime":{
            get(){
                const dd = new Date(this.article_info.pubtime)
                return dd.getFullYear() + "-" + dd.getMonth() + "-" + dd.getDate()
            }
        },
        "admin_login"(){
            return remoteStorage.get_login_status()
        },
        mdtips:{
            get(){
                let l = reads("mdlist","local","string",true)
                if (l !== null){
                    return l[Math.round(Math.random()*(l.length-1))]
                }
                else{
                    return "嘿，很高兴见到你"
                }
            }
        },
        "classnames":{
            get(){
                let a
                this.aclass_list.forEach((r)=>{
                    if (r.cid === this.article_info.aclass){
                        a = r.cname
                    }
                })
                return a
            }

        },
        "aid":{
            get(){
                return this.article_id
            },
            set(v){
                this.article_id = v
                this.load_art(this.article_id)
            }
        },
        "alink":{
            get(){return this.article_link},
            set(v){
                this.article_link = v
                this.show_art(v)
            }
        },
        "artheight"(){return document.body.scrollHeight - 180},
        "font_size_fix"(){
            const ft = read_from_local("font_size_fix")
            return ft?ft:"1em"
        },
        "hide_menu"(){
            return parseFloat(this.font_size_fix.replace("em","")) <= 1.3
        },


    },
    methods:{
        edit_art(aid){
            if (this.article_link!=null){
                window.location.href = "/admin/article/upload.html?type=static&link=" + this.article_link
            }
            else{
                window.location.href = "/admin/article/upload.html?aid=" + this.aid
            }
        },
        load_art(aid){
            // 获取文章信息并加载
            reads_remote("/article/" + aid + ".json",(r)=>{
                this.article_info = r
                if (r.password_protected){
                    // 密码保护
                    this.wait_password = true
                    this.loading = false
                }
                else{
                    this.show_art(COS_URL + "/article/" + aid + ".md")
                }
            },true,(e)=>{alert("文章加载失败，请刷新重试");console.error(e)})
        },
        load_art_with_password(){
            // 读取加密文章
            this.loading = true
            this.wait_password = false
            let _this = this
            reads_remote("/article/" + this.aid + ".md",(r)=>{
                MDView = editormd.markdownToHTML("mdview", {
                    markdown: AES_decrypt(r,_this.artpassword),
                    // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                    htmlDecode: "style,script,iframe",  // you can filter tags decode
                    // toc             : true,
                    tocContainer    : "#article_aside", // 自定义 ToC 容器层
                    tocm: true,    // Using [TOCM]
                    emoji: true,
                    taskList: true,
                    tex: true,  // 默认不解析
                    flowChart: true,  // 默认不解析
                    sequenceDiagram: true,  // 默认不解析
                })
                _this.loading = false
            },false,(e)=>{console.error(e);alert("读取失败")})
        },
        show_art(u){
            // 从 u 获取MarkDown 并显示
            let _this = this
            axios.get(u).then((r)=>{
                MDView = editormd.markdownToHTML("mdview", {
                    markdown: r.data,
                    // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                    htmlDecode: "style,script,iframe",  // you can filter tags decode
                    // toc             : true,
                    tocContainer    : "#article_aside", // 自定义 ToC 容器层
                    tocm: true,    // Using [TOCM]
                    emoji: true,
                    taskList: true,
                    tex: true,  // 默认不解析
                    flowChart: true,  // 默认不解析
                    sequenceDiagram: true,  // 默认不解析
                })
                setDescription(this.article_info.description)
                setKeyWords(this.article_info.keywords)
                _this.loading = false
            }).catch((e)=>{alert("加载失败，请重试");console.log(e)})
        },
        load_aid(){
            // 从请求页面读取文章 ID
            let aid = getQueryVariable("id")
            if (aid == null){
                aid = getQueryVariable("aid")
                if (aid == null){
                    aid = getQueryVariable("i")
                }
            }
            this.aid = aid
        },
        load_static(lnk){
            // 加载固定链接
            this.alink = lnk
        },
        scroll_to_top(){
            // 滚动到指定行数
            this.scrollnum = document.documentElement.scrollTop
            this._scrollToTop()
        },
        _scrollToTop() {
            // 执行返回顶部
            let _this = this
            _this.scrtimer = requestAnimationFrame(function fn() {
                if (_this.scrollnum > 5000) {
                    _this.scrollnum -= 800;
                    document.documentElement.scrollTop = _this.scrollnum;
                    _this.scrtimer = requestAnimationFrame(fn);
                } else if (_this.scrollnum > 1000) {
                    _this.scrollnum -= 250;
                    document.documentElement.scrollTop = _this.scrollnum;
                    _this.scrtimer = requestAnimationFrame(fn);
                } else if (_this.scrollnum > 300) {
                    _this.scrollnum -= 75;
                    document.documentElement.scrollTop = _this.scrollnum;
                    _this.scrtimer = requestAnimationFrame(fn);
                } else if (_this.scrollnum > 0) {
                    _this.scrollnum -= 50;
                    document.documentElement.scrollTop = _this.scrollnum;
                    _this.scrtimer = requestAnimationFrame(fn);
                } else {
                    cancelAnimationFrame(_this.scrtimer);
                }
            });
        }
    },
    mounted(){
        let _this = this
        reads_remote("/class/class.json",(r)=>{
            _this.aclass_list = r
        },true,(e)=>{console.error(e);alert("分类加载失败")})
    }

})

aapp.use(ElementPlus)