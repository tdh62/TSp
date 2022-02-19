
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

            // 还有更多文章?
            return this.total_page>this.now_page?"":"disabled"
        }
    },
    mounted(){

        if (this.load_from_class === ""){
            // 加载全部文章
            reads_remote("/article/article0.json",(r)=>{
                this.total_page = r.pages
                if (r.datas.length > 0) {
                    r.datas.forEach((t) => {
                        this.all_article.push(t)
                    })
                }
                else{
                    this.loading = false
                    this.article_title = "没有找到文章哎"
                }
            },true,(e)=>{alert("加载失败，请刷新重试");console.error(e)})

        }
        else{
            // 加载分类文章


            }
    },
    methods:{
        show_art(aid){
            window.location.href = "/article.html?aid=" + aid
        },
        getd(ts){
            const t = new Date(ts)
            return t.getFullYear() + "-" + t.getMonth().toString().padStart(2,'0') + "-" + t.getDay().toString().padStart(2,'0')
        },
        load_more(){
            if (this.now_page >= this.total_page){
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
            }
        }

    }
})
mainapp.use(ElementPlus)