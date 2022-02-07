upapp = Vue.createApp({
    data(){
        return {
            "page_title":"编辑文章",
            "tips":"请稍后",
            "tipscolor":"#ffffff",
            "newarticle":{
                "_new_article":false,
                "_staticfile":false,  // 固定链接文章
                "_saveto":"md",  // 保存文件的类型
                "aid":"",  // 文章 ID
                "atitle":"",  // 文章标题
                "author":"",  // 作者
                "pubtimer":new Date(),  // 发布时间
                "aclass":"",  // 文章分类
                "tags":"",  // 标签
                "spimg":"",  // 特色图像

                "staticlink":"",  // 固定链接
                "static_link_seted":false,  // 固定链接已设置

                "keyword":"",  // SEO 关键字
                "describe":"",  // SEO 描述
                "cc1":"",  // 备用字段 1
                "cc2":"",  // 备用字段 2
                "cc3":"",  // 备用字段 3

            },
            "artinfo":"", // 文章内容

            "autosave_interval":null, // 自动保存调度
            "static_btn_type":"primary",  // 固定链接按钮类型
            "static_setting":false,  // 正在设置固定链接
            "static_deleting":false,  // 正在删除固定链接
            "del_static_btn_type":"danger", // 删除固定链接类型

        }
    },
    computed:{
        "staticfile":{
            get(){return this.newarticle._staticfile},
            set(v){
                this.newarticle._staticfile = v
                if (!v){
                    this.saveto = "md"
                    if (this.newarticle.aid === ""){
                        this.get_new_aid()
                    }
                }
            }
        },
        "saveto":{
            get(){return this.newarticle._saveto},
            set(v){
                this.newarticle._saveto = v
            }
        },
        "pubtime":{
            get(){
                return new Date(this.newarticle.pubtimer)
            },
            set(v){
                this.newarticle.pubtimer = new Date(v)
            }
        },
        new_article:{
            get(){return this.newarticle._new_article},
            set(v){
                this.newarticle._new_article = v
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
        get_new_aid(){
            // 获取新 ID
            read_from_remote("next-article",function (nid){
                v_app.aid = nid
                save_to_remote("next-article",parseInt(nid)+1)
            },(e)=>{console.log(e)})
        },
        save_cg(){
            // 保存草稿
            this.artinfo = $("#artinfos")[0].value
            save_to_local("new_article",this.newarticle.new_article)

            saves("new_article_cg",this.newarticle,"local","string")

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
                    this.get_new_aid()
                }
                else{
                    MDEdit.clear()
                }
                return
            }
            $("#artinfos")[0].value = this.artinfo
            MDEdit.clear()
            MDEdit.appendMarkdown(this.artinfo)
            if (init){
                this.tips = "发现保存的草稿，已自动读取，点击此处 <a href='' onclick='v_app.delete_cg();MDEdit.clear();" +
                    "v_app.tips=\"删掉了\";return false;'>删除并清空</a>，请勿同时打开多个编辑窗口"
            }
            else{
                this.tips = "读出来啦"
            }

            this.newarticle = JSON.parse(read_from_local("new_article_cg")) // TODO
            v_app.tipscolor = "#7b7b7b"
        },
        delete_cg(){
            // 删除草稿
            delete_from_local("cg_article")
            delete_from_local("new_article_cg")
        },
        save_article(){
            this.newarticle.save_cg()
            if (this.staticfile){
                // 固定链接文章

                // 确保以 / 开头
                if (!this.newarticle.staticlink.startsWith("/")){
                    this.newarticle.staticlink = "/" + this.newarticle.staticlink
                }
                if (this.saveto === "md"){
                    // 保存 MarkDown 和 对应 HTML
                    saves_remote(this.newarticle.staticlink + ".md",this.artinfo,"text/x-markdown")  // 保存文章内容

                    // 生成 HTML 内容
                    axios.get("/article.html").then((r)=>{
                        let r_datas = r.data.replace("v_app.load_aid()", "v_app.load_static('" + this.newarticle.staticlink + ".md')")
                        saves_remote(this.newarticle.staticlink + ".html",r_datas,"text/html",
                            (res)=>{console.log(res)})
                    }).catch((e)=>{console.error(e)})
                }
                else{
                    // 直接保存 HTML
                    saves_remote(this.newarticle.staticlink + ".html", MDEdit.getHTML(),"text/html",
                        (res)=>{console.log(res)})
                }

                // 更新元数据
                sdata = this.set_static_link(null,true)

                // 添加到列表
                reads_remote("/static-link.json",(r)=>{
                        let slist = r.data
                        slist[this.newarticle.staticlink] = sdata
                        saves_remote("/static-link.json",slist,"application/json",(r)=>{
                            console.log(r)
                            alert("保存成功")
                        })
                    },
                    true,(e)=>console.error(e))
            }
            else{
                const tdata = {
                    "aid":this.newarticle.aid,  // 文章 ID
                    "atitle":this.newarticle.atitle,  // 文章标题
                    "author":this.newarticle.author,  // 作者
                    "pubtime":this.newarticle.pubtimer.getTime(),  // 发布时间
                    "aclass":this.newarticle.aclass,  // 文章分类
                    "tags":this.newarticle.tags,  // 标签
                    "spimg":this.newarticle.spimg,  // 特色图像
                    // "staticlink":"",  // 固定链接
                    "keyword":this.newarticle.keyword,  // SEO 关键字
                    "describe":this.newarticle.describe,  // SEO 描述
                    "cc1":this.newarticle.cc1,  // 备用字段 1
                    "cc2":this.newarticle.cc2,  // 备用字段 2
                    "cc3":this.newarticle.cc3,  // 备用字段 3
                }
                saves_remote("/article/" + this.newarticle.aid + ".json",tdata)  // 保存元数据
                saves_remote("/article/" + this.newarticle.aid + ".md",this.artinfo,"text/x-markdown")  // 保存文章内容
                const sdata = tdata
                delete sdata['keyword']
                delete sdata['describe']
                reads_remote("/articles.json",(article_list)=>{
                    article_list[this.newarticle.aid.toString()] = sdata
                    saves_remote("/articles.json",article_list)
                },true) // 保存文章到列表
                clearInterval(this.autosave_interval)
                // TODO: 根据分类更细分类列表
                alert("保存成功")
            }
        },
        set_static_link($event,pub = false){
            // 设置固定链接

            // 确保以 / 开头
            if (!this.newarticle.staticlink.startsWith("/")){
                this.newarticle.staticlink = "/" + this.newarticle.staticlink
            }
            this.static_setting = true
            // 保存元数据
            let sdata = {
                "atitle": this.newarticle.atitle,  // 文章标题
                "author": this.newarticle.author,  // 作者
                "pubtime": this.newarticle.pubtimer.getTime(),  // 发布时间
                "aclass": this.newarticle.aclass,  // 文章分类
                "tags": this.newarticle.tags,  // 标签
                "spimg": this.newarticle.spimg,  // 特色图像
                "staticlink": this.newarticle.staticlink,  // 固定链接
                "pub": pub, // 文章已保存
                "saveto": this.saveto,  // 保存目标格式
                "keyword": this.newarticle.keyword,  // SEO 关键字
                "describe": this.newarticle.describe,  // SEO 描述
                "cc1": this.newarticle.cc1,  // 备用字段 1
                "cc2": this.newarticle.cc2,  // 备用字段 2
                "cc3": this.newarticle.cc3,  // 备用字段 3
            }
            let _this = this
            saves_remote(this.newarticle.staticlink + ".json",sdata,"application/json",()=>{
                _this.static_setting = false
            })

            // 修改 url
            if (getQueryVariable("link") == null){
                history.pushState({},"",document.URL + "&link=" + this.newarticle.staticlink)
            }
            return sdata
        },
        load_art(aid){
            // 读取文章
            this.newarticle.aid = aid
            reads_remote("/article/" + this.newarticle.aid + ".json",(tdata)=>{
                this.newarticle.atitle = tdata.atitle
                this.newarticle.author = tdata.author
                this.newarticle.pubtime =tdata.pubtime
                this.newarticle.tags =tdata.tags
                this.newarticle.spimg =tdata.spimg
                // this.newarticle.statictdata
                this.newarticle.keyword =tdata.keyword
                this.newarticle.describe =tdata.describe
                this.newarticle.cc1 = tdata.cc1
                this.newarticle.cc2 = tdata.cc2
                this.newarticle.cc3 = tdata.cc3

                this.tips = "正在加载文章，请稍后"
                // 先加载数据再读取文章
                reads_remote("/article/" + this.newarticle.aid + ".md",(md)=>{
                    // 写入文章
                    this.artinfo = md.data
                    MDEdit.clear()
                    MDEdit.appendMarkdown(this.artinfo)
                    this.tips = "加载完成"
                },false,()=>{alert("文章内容读取失败，请刷新重试")})


            },true,()=>{alert("文章数据读取失败，请检查网络连接并刷新重试")})
            $("#artinfos")[0].value = this.artinfo
        },
        load_static(lnk) {
            // 读静态文章
            this.newarticle.staticlink = lnk
            this.staticfile = true
            reads_remote(lnk + ".json",(tdata)=>{
                this.newarticle.atitle = tdata.atitle
                this.newarticle.author = tdata.author
                this.newarticle.pubtimer = tdata.pubtimer
                this.newarticle.aclass = tdata.aclass
                this.newarticle.tags = tdata.tags
                this.newarticle.spimg = tdata.spimg
                this.newarticle.staticlink = tdata.staticlink
                this.newarticle.saveto = tdata.saveto
                this.newarticle.keyword = tdata.keyword
                this.newarticle.describe = tdata.describe
                this.newarticle.static_link_seted = true  // 固定链接已设置
                this.newarticle.cc1 = tdata.cc1
                this.newarticle.cc2 = tdata.cc2
                this.newarticle.cc3 = tdata.cc3
                if (tdata.pub){
                    this.tips = "正在加载文章，请稍后"
                    // 先加载数据再读取文章
                    reads_remote(lnk + "." + this.saveto,(md)=>{
                        // 写入文章
                        this.artinfo = md.data
                        MDEdit.clear()
                        MDEdit.appendMarkdown(this.artinfo)
                        this.tips = "加载完成"
                    },false,()=>{alert("文章内容读取失败，请刷新重试")})
                }
                else{
                    this.tips = "找到了固定链接，但文章内容未保存"
                }

            },true,()=>{alert("文章数据读取失败，请检查网络连接并刷新重试")})
        },

    },
    mounted(){

    }

})

upapp.use(ElementPlus)