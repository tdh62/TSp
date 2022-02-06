/**
 * 文章阅读页面
 */

const aapp = Vue.createApp({
    data(){
        return {
            "article_id":1,
        }
    },
    computed:{
        "aid":{
            get(){
                return this.article_id
            },
            set(v){
                this.article_id = v
                axios.get(COS_URL + "/article/" + this.aid + ".md").then((r)=>{
                    MDView = editormd.markdownToHTML("mdview", {
                        markdown: r.data,
                        // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                        htmlDecode: "style,script,iframe",  // you can filter tags decode
                        // toc             : false,
                        tocm: true,    // Using [TOCM]
                        emoji: true,
                        taskList: true,
                        tex: true,  // 默认不解析
                        flowChart: true,  // 默认不解析
                        sequenceDiagram: true,  // 默认不解析
                    });
                }).catch((e)=>{alert("加载失败，请重试");console.log(e)})
            }
        }

    },
    methods:{
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
        }
    }

})

aapp.use(ElementPlus)