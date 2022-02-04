
upapp = Vue.createApp({
    data(){
        return {
            "tips":"请稍后",
            "tipscolor":"#ffffff",
            "aid":"",  // 文章 ID
            "atitle":"",  // 文章标题
            "author":"",  // 作者
            "pubtime":new Date(),  // 发布时间
            "class":"",  // 文章分类
            "tags":"",  // 标签
            "spimg":"",  // 特色图像
            "staticlink":"",  // 固定链接
            "keyword":"",  // SEO 关键字
            "describe":"",  // SEO 描述
            "cc1":"",  // 备用字段 1
            "cc2":"",  // 备用字段 2
            "cc3":"",  // 备用字段 3
            "artinfo":"", // 文章内容
        }
    },
    computed:{

    },
    methods:{
        save_cg(){
            this.artinfo = $("#artinfos")[0].value
            save_to_local("article",this.artinfo)
            this.tips = "自动保存于 " + (new Date).toLocaleTimeString()
            this.tipscolor = "red"
            setTimeout(() =>{
                v_app.tipscolor = "#7b7b7b"
            },2500)
        },
        load_cg(){
            this.artinfo = read_from_local("article")
            if (this.artinfo == null){
                MDEdit.clear()
                return
            }
            $("#artinfos")[0].value = this.artinfo
            MDEdit.clear()
            MDEdit.appendMarkdown(this.artinfo)

        }
    },

})

upapp.use(ElementPlus)