
mainapp = Vue.createApp({
    data(){
        return {
            "loading":true,
            "all_article":[],
            "aclass_list":[{
                cid: '0',
                cname: '默认分类',
            }],
            "aclass_dict":{"0":"默认分类"},
            "total_page":1,
            "now_page":1,
            "load_from_class":"",
            "article_title":"所有文章",
        }
    },
    computed:{
        "font_size_fix"(){
            const ft = read_from_local("font_size_fix")
            return ft?ft:"1em"
        },
        "has_more_art"(){
            // TODO:控制自动加载
            if (!this.scroll_to_refresh){
                return false
            }
            // 还有更多文章?
            return this.total_page>this.now_page?"":"disabled"
        },
        "admin_login"(){
            return remoteStorage.get_login_status()
        },
        "scroll_to_refresh"(){
            return read_from_local("scroll_to_refresh") === "true"
        }
    },
    mounted(){
        // 加载分类
        reads_remote("/class/class.json",(r)=>{
            this.aclass_list = r
            r.forEach((d)=>{this.aclass_dict[d.cid] = d.cname})
        },true,(e)=>{console.error(e);alert("分类加载失败")})

        // 加载全部文章
        reads_remote("/article/article0.json",(r)=>{
            this.all_article = []
            this.total_page = r.pages

            const idd = Object.keys(r.datas);
            if (idd.length > 0) {
                // for i in
                idd.reverse()
                for (let i = 0; i < idd.length; i++) {
                    this.all_article.push(r.datas[idd[i]])
                }
                this.loading = false
            }
            else{
                this.loading = false
                this.article_title = "没有找到文章哎"
            }
        },true,(e)=>{alert("加载失败，请刷新重试");console.error(e)})
    },
    methods:{
        page_change(p){
            if (this.scroll_to_refresh){
                return
            }
            this.now_page = p
            this.loading = true
            this.all_article = []
            if (p === this.total_page){
                // 第一页额外加载一页的内容
                reads_remote("/article/article0.json",(r)=>{
                    const idd = Object.keys(r.datas);
                    if (idd.length > 0) {
                        // for i in
                        idd.reverse()
                        for (let i = 0; i<idd.length; i++){
                            this.all_article.push(r.datas[idd[i]])
                        }
                    }
                },true,(e)=>{console.error(e)})
            }

            reads_remote("/article/article" + (this.total_page - p) + ".json",(r)=>{
                const idd = Object.keys(r.datas);
                if (idd.length > 0) {
                    // for i in
                    idd.reverse()
                    for (let i = 0; i<idd.length; i++){
                        this.all_article.push(r.datas[idd[i]])
                    }
                }
                this.loading = false
            },true,(e)=>{console.error(e)})

            this.now_page++
            this.article_title = "第" + p + "页"
        },
        show_art(aid){
            window.location.href = "/article.html?aid=" + aid
        },
        edit_art(aid){
            window.location.href = "/admin/article/upload.html?aid=" + aid
        },
        new_art(aid){
            window.location.href = "/admin/article/upload.html"
        },
        getd(ts){
            const t = new Date(ts)
            return t.getFullYear() + "-" + t.getMonth().toString().padStart(2,'0') + "-" + t.getDay().toString().padStart(2,'0')
        },
        load_more(){
            if (this.total_page<=1){
                return
            }
            if (this.now_page >= this.total_page || this.scroll_to_refresh === false){
                console.log("没有更多了")
            }
            else{
                reads_remote("/article/article" + (this.total_page - this.now_page) + ".json",(r)=>{
                    const idd = Object.keys(r.datas);
                    if (idd.length > 0) {
                        // for i in
                        idd.reverse()
                        for (let i = 0; i<idd.length; i++){
                            this.all_article.push(r.datas[idd[i]])
                        }
                    }
                },true,(e)=>{console.error(e)})
                this.now_page++
                this.article_title = "所有文章"
            }
        }

    }
})
mainapp.use(ElementPlus)