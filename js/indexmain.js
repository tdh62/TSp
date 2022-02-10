
mainapp = Vue.createApp({
    data(){
        return {
            "loading":true,
            "banner_list" : ["data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="]
        }
    },
    computed:{
        "index_image"(){
            return this.banner_list[Math.round(Math.random()*(this.banner_list.length-1))]
        },
        "font_size_fix"(){
            const ft = read_from_local("font_size_fix")
            return ft?ft:"1em"
        }
    },
    mounted(){

        // 从 u 获取MarkDown 并显示
        let _this = this
        reads_remote("/index.md",(r)=>{
            MDView = editormd.markdownToHTML("index-main", {
                markdown: r,
                // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                htmlDecode: "style,script,iframe",  // you can filter tags decode
                // toc             : true,
                // tocContainer    : "#article_aside", // 自定义 ToC 容器层
                // tocm: true,    // Using [TOCM]
                emoji: true,
                taskList: true,
                tex: true,  // 默认不解析
                flowChart: true,  // 默认不解析
                sequenceDiagram: true,  // 默认不解析
            })
        },false,(e)=>{console.log(e);alert("加载失败，请刷新重试")})

        reads_remote("/settings/banner.txt",(r)=>{
            if (r.length > 0 ){
                this.banner_list = r
            }
        },true,(e)=>{console.error(e)})
        this.loading = false
    }
})
mainapp.use(ElementPlus)