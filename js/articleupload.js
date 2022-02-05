
upapp = Vue.createApp({
    data(){
        return {
            "tips":"请稍后",
            "tipscolor":"#ffffff",
            "aid":"",  // 文章 ID
            "atitle":"",  // 文章标题
            "author":"",  // 作者
            "pubtime":new Date(),  // 发布时间
            "aclass":"",  // 文章分类
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
            save_to_local("cg_aid",this.aid)
            save_to_local("article",this.artinfo)
            this.tips = "草稿已保存（每 5 分钟将自动保存）： " + (new Date).toLocaleTimeString()
            this.tipscolor = "red"
            setTimeout(() =>{
                v_app.tipscolor = "#7b7b7b"
            },2500)
        },
        load_cg(init=false){
            this.artinfo = read_from_local("article")
            if (this.artinfo == null){
                if (init){
                    // 无草稿，获取新文章 ID
                    read_from_remote("next-article",function (nid){
                        v_app.aid = nid
                        save_to_remote("next-article",parseInt(nid)+1)
                    },(e)=>{console.log(e)})
                }
                else{
                    MDEdit.clear()
                }
                return
            }
            this.aid = read_from_local("cg_aid")
            $("#artinfos")[0].value = this.artinfo
            MDEdit.clear()
            MDEdit.appendMarkdown(this.artinfo)
            this.tips = "发现保存的草稿，已自动读取，点击此处 <a href='' onclick='delete_from_local(\"article\");MDEdit.clear();" +
                "v_app.tips=\"删掉了\";return false;'>删除并清空</a>"

            v_app.tipscolor = "#7b7b7b"


        }
    },
    mounted(){

    }

})

upapp.use(ElementPlus)