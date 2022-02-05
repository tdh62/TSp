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

            // "static_btn_type":"primary",  // 固定链接按钮类型
            // "static_setting":false,
            // "static_deleting":false,
            // "del_static_btn_type":"danger", // 删除固定链接类型
        }
    },
    computed:{

    },
    methods:{
        save_cg(){
            // 保存草稿
            this.artinfo = $("#artinfos")[0].value
            save_to_local("cg_aid",this.aid)
            save_to_local("cg_author",this.author)
            save_to_local("cg_pubtime",this.pubtime)
            save_to_local("cg_tags",this.tags)
            save_to_local("cg_spimg",this.spimg)
            // save_to_local("cg_staticlink",this.staticlink)
            save_to_local("cg_keyword",this.keyword)
            save_to_local("cg_describe",this.describe)
            save_to_local("cg_cc1",this.cc1)
            save_to_local("cg_cc2",this.cc2)
            save_to_local("cg_cc3",this.cc3)
            save_to_local("cg_article",this.artinfo)
            this.tips = "草稿已保存（每 5 分钟将自动保存）： " + (new Date).toLocaleTimeString()
            this.tipscolor = "red"
            setTimeout(() =>{
                v_app.tipscolor = "#7b7b7b"
            },2500)
        },
        load_cg(init=false){
            // 加载草稿
            this.artinfo = read_from_local("cg_article")
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
            this.author = read_from_local("cg_author")
            this.pubtime = read_from_local("cg_pubtime")
            this.tags = read_from_local("cg_tags")
            this.spimg = read_from_local("cg_spimg")
            // this.staticlink = read_from_local("cg_staticlink")
            this.keyword = read_from_local("cg_keyword")
            this.describe = read_from_local("cg_describe")
            this.cc1 = read_from_local("cg_cc1")
            this.cc2 = read_from_local("cg_cc2")
            this.cc3 = read_from_local("cg_cc3")
            $("#artinfos")[0].value = this.artinfo
            MDEdit.clear()
            MDEdit.appendMarkdown(this.artinfo)
            this.tips = "发现保存的草稿，已自动读取，点击此处 <a href='' onclick='v_app.delete_cg();MDEdit.clear();" +
                "v_app.tips=\"删掉了\";return false;'>删除并清空</a>，请勿同时打开多个编辑窗口"

            v_app.tipscolor = "#7b7b7b"
        },
        delete_cg(){
            // 删除草稿
            delete_from_local("cg_aid")
            delete_from_local("cg_aid")
            delete_from_local("cg_author")
            delete_from_local("cg_pubtime")
            delete_from_local("cg_tags")
            delete_from_local("cg_spimg")
            // delete_from_local("cg_staticlink")
            delete_from_local("cg_keyword")
            delete_from_local("cg_describe")
            delete_from_local("cg_cc1")
            delete_from_local("cg_cc2")
            delete_from_local("cg_cc3")
            delete_from_local("cg_article")
        },

    },
    mounted(){

    }

})

upapp.use(ElementPlus)