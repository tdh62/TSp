/**
 * 文章阅读页面
 */

const aapp = Vue.createApp({
    data(){
        return {
            "article_id":null,
            "article_link":null,
            "scrtimer":null,
            "scrollnum":0,
            "loading":true,
        }
    },
    computed:{
        "aid":{
            get(){
                return this.article_id
            },
            set(v){
                this.article_id = v
                this.show_art(COS_URL + "/article/" + this.aid + ".md")
            }
        },
        "alink":{
            get(){return this.article_link},
            set(v){
                this.article_link = v
                this.show_art(v)
            }
        },
        "artheight"(){return document.body.scrollHeight - 210}

    },
    methods:{
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
    }

})

aapp.use(ElementPlus)