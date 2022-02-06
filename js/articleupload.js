upapp = Vue.createApp({
    data(){
        return {
            "_new_article":false,
            "page_title":"编辑文章",
            "tips":"请稍后",
            "tipscolor":"#ffffff",
            "aid":"",  // 文章 ID
            "atitle":"",  // 文章标题
            "author":"",  // 作者
            "pubtimer":new Date(),  // 发布时间
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

            "autosave_interval":null, // 自动保存

            // "static_btn_type":"primary",  // 固定链接按钮类型
            // "static_setting":false,
            // "static_deleting":false,
            // "del_static_btn_type":"danger", // 删除固定链接类型
        }
    },
    computed:{
        "pubtime":{
            get(){
                return new Date(this.pubtimer)
            },
            set(v){
                this.pubtimer = new Date(v)
            }
        },
        new_article:{
            get(){return this._new_article},
            set(v){
                this._new_article = v
                if (v){
                    this.page_title = "发布新文章"
                }
                else{
                    this.page_title = "编辑文章"
                }
            }

        }
    },
    methods:{
        save_cg(){
            // 保存草稿
            this.artinfo = $("#artinfos")[0].value
            save_to_local("cg_aid",this.aid)
            save_to_local("cg_atitle",this.atitle)
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

            save_to_local("new_article",this.new_article)
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
            this.atitle = read_from_local("cg_atitle")
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
            this.new_article = read_from_local("new_article")
        },
        delete_cg(){
            // 删除草稿
            delete_from_local("cg_aid")
            delete_from_local("cg_atitle")
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
        save_article(){
            this.save_cg()
            const tdata = {
                "aid":this.aid,  // 文章 ID
                "atitle":this.atitle,  // 文章标题
                "author":this.author,  // 作者
                "pubtime":this.pubtimer.getTime(),  // 发布时间
                "aclass":this.aclass,  // 文章分类
                "tags":this.tags,  // 标签
                "spimg":this.spimg,  // 特色图像
                // "staticlink":"",  // 固定链接
                "keyword":this.keyword,  // SEO 关键字
                "describe":this.describe,  // SEO 描述
                "cc1":this.cc1,  // 备用字段 1
                "cc2":this.cc2,  // 备用字段 2
                "cc3":this.cc3,  // 备用字段 3
            }
            saves_remote("/article/" + this.aid + ".json",tdata)  // 保存元数据
            saves_remote("/article/" + this.aid + ".md",this.artinfo,"text/x-markdown")  // 保存文章内容
            const sdata = tdata
            delete sdata['keyword']
            delete sdata['describe']
            reads_remote("/articles.json",(article_list)=>{
                article_list[this.aid.toString()] = sdata
                saves_remote("/articles.json",article_list)
            },true) // 保存文章到列表
            clearInterval(this.autosave_interval)
            // TODO: 根据分类更细分类列表
            alert("保存成功")
        },
        load_art(aid){
            // 读取文章
            this.aid = aid
            reads_remote("/article/" + this.aid + ".json",(tdata)=>{
                this.atitle = tdata.atitle
                this.author = tdata.author
                this.pubtime =tdata.pubtime
                this.tags =tdata.tags
                this.spimg =tdata.spimg
                    // this.statictdata
                this.keyword =tdata.keyword
                this.describe =tdata.describe
                this.cc1 = tdata.cc1
                this.cc2 = tdata.cc2
                this.cc3 = tdata.cc3
                this.tips = "正在加载文章，请稍后"
                // 先加载数据再读取文章
                reads_remote("/article/" + this.aid + ".md",(md)=>{
                    // 写入文章
                    this.artinfo = md.data
                    MDEdit.clear()
                    MDEdit.appendMarkdown(this.artinfo)
                    this.tips = "加载完成"
                },false,()=>{alert("文章内容读取失败，请刷新重试")})

            },true,()=>{alert("文章数据读取失败，请检查网络连接并刷新重试")})
            $("#artinfos")[0].value = this.artinfo


        }

    },
    mounted(){

    }

})

upapp.use(ElementPlus)