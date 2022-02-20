
mainapp = Vue.createApp({
    data(){
        return {
            "loading":true,
            "recent_article":[],
            "aclass_list":[{
                cid: '0',
                cname: '默认分类',
            }],
            "aclass_dict":{"0":"默认分类"}
        }
    },
    computed:{
        "font_size_fix"(){
            const ft = read_from_local("font_size_fix")
            return ft?ft:"1em"
        }
    },
    mounted(){
        reads_remote("/recent-articles.json",(r)=>{
            this.recent_article = r
            reads_remote("/class/class.json",(r)=>{
                this.aclass_list = r
                r.forEach((d)=>{this.aclass_dict[d.cid] = d.cname})
                this.loading = false
            },true,(e)=>{console.error(e);alert("分类加载失败")})
        },true,(e)=>{alert("加载失败，请刷新重试");console.error(e)})
    },
    methods:{
        show_art(aid){
            window.location.href = "/article.html?aid=" + aid
        },
        getd(ts){
            const t = new Date(ts)
            return t.getFullYear() + "-" + t.getMonth().toString().padStart(2,'0') + "-" + t.getDate().toString().padStart(2,'0')
        },
        all_articles(){
            document.location = "/all-article.html"
        }
    }
})
mainapp.use(ElementPlus)