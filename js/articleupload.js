upapp = Vue.createApp({
    data(){
        return {
            "site_info":{
                "site_title":"青橙屋",
                "site_sub_title":"见到你很高兴",
                "article_now_page":0,
                "class_now_page":{
                    "0":0
                }
            },

            "page_title":"编辑文章",
            "tips":"请稍后",
            "loading":true,
            "tipscolor":"#ffffff",
            "aclass_list":[{
                cid: '0',
                cname: '默认分类',
            }],
            "newarticle":{
                "_new_article":false,
                "_staticfile":false,  // 固定链接文章
                "_saveto":"md",  // 保存文件的类型
                "aid":"",  // 文章 ID
                "atitle":"",  // 文章标题
                "author":"",  // 作者
                "pubtimer":new Date(),  // 发布时间
                "aclass":"0",  // 文章分类
                "tags":"",  // 标签
                "spimg":"",  // 特色图像

                "staticlink":"",  // 固定链接
                "static_link_seted":false,  // 固定链接已设置
                "password_protected":false, // 密码保护
                "keyword":"",  // SEO 关键字
                "describe":"",  // SEO 描述
                "cc1":"",  // 备用字段 1
                "cc2":"",  // 备用字段 2
                "cc3":"",  // 备用字段 3
                "apages":0,  // 文章分页
                "classpages":0,  // 文章分页
            },
            "artinfo":"", // 文章内容
            "artpassword":"", // 文章密码
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
        leftfix(){
            document.getElementsByClassName("CodeMirror-gutters")[0].style.left=null;
        },
        openbed(){
            window.open('/admin/imgbed.html')
        },
        get_new_aid(){
            // 获取新 ID
            let _this = this
            read_from_remote("next-article",function (nid){
                _this.newarticle.aid = nid
                save_to_remote("next-article",parseInt(nid)+1)
            },(e)=>{console.log(e)})
        },
        save_cg(){
            // 保存草稿
            this.artinfo = $("#artinfos")[0].value
            save_to_local("new_article",this.newarticle.new_article)
            save_to_local("cg_article",this.artinfo)
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
                return
            }
            $("#artinfos")[0].value = this.artinfo
            MDEdit.clear()
            MDEdit.appendMarkdown(this.artinfo)

            if (init === true){
                this.tips = "发现保存的草稿，已自动读取，点击此处 <a href='' onclick='v_app.delete_cg();MDEdit.clear();" +
                    "v_app.tips=\"删掉了\";return false;'>删除并清空</a>，请勿同时打开多个编辑窗口"
            }
            else{
                this.tips = "读出来啦"
            }

            this.newarticle = JSON.parse(read_from_local("new_article_cg")) // TODO
            v_app.tipscolor = "#7b7b7b"

            // patch CodeMirror
            // 在读取草稿后左侧栏 left 计算错误（？）导致文字被遮住
            document.getElementsByClassName("CodeMirror-gutters")[0].style.left=null;

        },
        delete_cg(){
            // 删除草稿
            delete_from_local("cg_article")
            delete_from_local("new_article_cg")
        },
        save_article(){
            // 保存文章
            this.loading = true
            this.save_cg()
            let sdata;
            if (this.staticfile) {
                // 固定链接文章

                // 确保以 / 开头
                if (!this.newarticle.staticlink.startsWith("/")) {
                    this.newarticle.staticlink = "/" + this.newarticle.staticlink
                }

                if (this.saveto === "md") {
                    // 保存 MarkDown 和 对应 HTML
                    saves_remote(this.newarticle.staticlink + ".md", this.artinfo, "text/x-markdown")  // 保存文章内容
                    let ch = false

                    site_base_files.forEach((s)=>{
                        if (this.newarticle.staticlink.startsWith(s)) ch = true
                    })

                    if (ch===true){
                        // 生成 HTML 内容
                        axios.get("/article.html").then((r) => {
                            let r_datas = r.data.replace("v_app.load_aid()", "v_app.load_static('" + this.newarticle.staticlink + ".md')")
                            saves_remote(this.newarticle.staticlink + ".html", r_datas, "text/html",
                                (res) => {
                                    console.log(res)
                                })
                        }).catch((e) => {
                            console.error(e)
                        })
                    }
                    else{
                        alert("为保障站点正常运行，HTML 文件没有进行覆盖")
                    }
                } else {
                    // 直接保存 HTML
                    saves_remote(this.newarticle.staticlink + ".html", this.artinfo, "text/html",
                        (res) => {
                            console.log(res)
                        })
                }

                // 更新元数据
                sdata = this.set_static_link(null, true)

                let _this = this
                // 添加到列表
                reads_remote("/static-link.json", (r) => {
                        let slist = r
                        slist[_this.newarticle.staticlink.toString()] = sdata
                        saves_remote("/static-link.json", slist, "application/json", (r) => {
                            console.log(r)
                            alert("保存成功")
                        })
                    },
                    true, (e) => console.error(e))
            } else {
                // 普通文章
                const tdata = {
                    "aid": this.newarticle.aid,  // 文章 ID
                    "atitle": this.newarticle.atitle,  // 文章标题
                    "author": this.newarticle.author,  // 作者
                    "pubtime": this.newarticle.pubtimer.getTime(),  // 发布时间
                    "aclass": this.newarticle.aclass,  // 文章分类
                    "tags": this.newarticle.tags,  // 标签
                    "spimg": this.newarticle.spimg,  // 特色图像
                    // "staticlink":"",  // 固定链接
                    "keyword": this.newarticle.keyword,  // SEO 关键字
                    "describe": this.newarticle.describe,  // SEO 描述
                    "password_protected": this.newarticle.password_protected, // 密码保护
                    "cc1": this.newarticle.cc1,  // 备用字段 1
                    "cc2": this.newarticle.cc2,  // 备用字段 2
                    "cc3": this.newarticle.cc3,  // 备用字段 3
                }
                if (this.new_article) {
                    // 新文章
                    tdata['apages'] = this.site_info.article_now_page
                    tdata['classpages'] = this.site_info.class_now_page[this.newarticle.aclass]
                } else {
                    tdata['apages'] = this.newarticle.apages
                    tdata['classpages'] = this.newarticle.classpages
                }
                saves_remote("/article/" + this.newarticle.aid + ".json", tdata)  // 保存元数据

                if (this.newarticle.password_protected){
                    // 加密
                    this.artinfo = AES_encrypt(this.artinfo,this.artpassword)
                }
                saves_remote("/article/" + this.newarticle.aid + ".md", this.artinfo, "text/x-markdown")  // 保存文章内容

                if (this.newarticle){
                    // 新文章

                    // 最近发布
                    reads_remote("/recent-articles.json", (r) => {
                        let cnt = r.push(tdata)
                        if (cnt > Resent_Article_Number) {
                            delete r[0]
                        }
                        saves_remote("/recent-articles.json", r, "application/json")
                    }, true, (e) => {
                        alert("保存最新文章失败");
                        console.log(e)
                    })

                    // 分类最近
                    reads_remote("/recent-class-" + this.newarticle.aclass + ".json", (r) => {
                        let cnt = r.push(tdata)
                        if (cnt > Resent_Article_Number) {
                            delete r[0]
                        }
                        saves_remote("/recent-class-" + this.newarticle.aclass + ".json", r, "application/json")
                    }, true, (e) => {
                        alert("保存最新分类文章失败");
                        console.log(e)
                    })

                    // 分页文章
                    reads_remote("/article/article0.json", (r) => {
                        r.datas[this.newarticle.aid] = tdata
                        let cnt = Object.keys(r.datas).length
                        if (cnt >= Article_Prepage_Number) {
                            saves_remote("/article/article" + r.pages + ".json", r)
                            saves_remote("/article/article0.json", {"pages": parseInt(r.pages) + 1, "datas": {}})
                            this.site_info.article_now_page = parseInt(r.pages) + 1
                            saves_remote("/siteinfo.json", this.site_info, "application/json")
                        } else {
                            saves_remote("/article/article0.json", r, "application/json")
                        }
                    }, true, (e) => {
                        alert("保存文章分页失败");
                        console.log(e)
                    })

                    // 分类分页
                    reads_remote("/article/class-" + this.newarticle.aclass + "-0.json", (r) => {
                        r.datas[this.newarticle.aid] = tdata
                        let cnt = Object.keys(r.datas).length
                        if (cnt >= Article_Prepage_Number) {
                            saves_remote("/article/class-" + this.newarticle.aclass + "-" + r.pages + ".json", r)
                            saves_remote("/article/class-" + this.newarticle.aclass + "-0.json", {
                                "pages": parseInt(r.pages) + 1,
                                "datas": {}
                            })
                            this.site_info.class_now_page[this.newarticle.aclass] = parseInt(r.pages) + 1
                            saves_remote("/siteinfo.json", this.site_info, "application/json", (e) => {
                                console.error(e);
                                alert("保存站点信息失败")
                            })
                        } else {
                            saves_remote("/article/class-" + this.newarticle.aclass + "-0.json", r, "application/json")
                        }
                    }, true, (e) => {
                        alert("保存文章分页失败");
                        console.log(e)
                    })
                } else {
                    // 旧文章修改
                    // 分页文章
                    reads_remote("/article/article" + this.newarticle.apages + ".json", (r) => {
                        r[this.newarticle.aid] = tdata
                        saves_remote("/article/article" + this.newarticle.apages + ".json", r)
                    }, true, (e) => {
                        alert("保存文章分页失败");
                        console.log(e)
                    })

                    // 分类分页
                    reads_remote("/article/class-" + this.newarticle.aclass + "-" + this.newarticle.classpages + ".json", (r) => {
                        r.datas[this.newarticle.aid] = tdata
                        saves_remote("/article/class-" + this.newarticle.aclass + "-" + this.newarticle.classpages + ".json", r)
                    }, true, (e) => {
                        alert("保存文章分页失败");
                        console.log(e)
                    })
                }

                // 更新分类信息
                this.aclass_list.forEach((e) => {
                    if (e.aid === this.aclass){
                        e.article_count = (parseInt(e.article_count) + 1).toString()
                    }
                })
                saves_remote("/class/class.json", this.aclass_list)

                delete tdata['keyword']
                delete tdata['describe']
                delete tdata['cc2']
                delete tdata['cc3']

                // 分类总目录
                reads_remote("/class/class" + this.newarticle.aclass + ".json", (article_list) => {
                    article_list[this.newarticle.aid] = tdata
                    saves_remote("/class/class" + this.newarticle.aclass + ".json", article_list)
                }, true, (e) => {
                    console.error(e);
                    alert("分类目录保存失败")
                })

                // 总目录
                reads_remote("/articles.json", (article_list) => {
                    article_list[this.newarticle.aid] = tdata
                    saves_remote("/articles.json", article_list)
                }, true, (e) => {
                    console.error(e);
                    alert("总目录保存失败")
                }) // 保存文章到列表
                alert("保存请求已提交")
            }
            this.new_article = false
            this.loading = false
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
            let nurl = document.URL
            if (document.URL.endsWith("html")){
                nurl += "?"
            }
            if (getQueryVariable("link") == null){
                nurl += "&link=" + this.newarticle.staticlink
            }
            if (getQueryVariable("type") == null){
                nurl += "&type=static"
            }
            history.pushState({},"",nurl)
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
                this.newarticle.apages = tdata.apages
                this.newarticle.classpages = tdata.classpages
                this.newarticle.password_protected = tdata.password_protected

                this.tips = "正在加载文章，请稍后"
                // 先加载数据再读取文章
                reads_remote("/article/" + this.newarticle.aid + ".md",(md)=>{
                    // 写入文章
                    if (this.newarticle.password_protected){
                        // 解密
                        this.artpassword = prompt("文章已加密，请输入密码：")
                        this.artinfo = AES_decrypt(md,this.artpassword)
                    }
                    else{
                        this.artinfo = md
                    }
                    MDEdit.clear()
                    MDEdit.appendMarkdown(this.artinfo)
                    this.tips = "加载完成"
                },false,()=>{alert("文章内容读取失败，请刷新重试")})
                this.loading = false
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
                this.newarticle.pubtime = tdata.pubtimer
                this.newarticle.aclass = tdata.aclass
                this.newarticle.tags = tdata.tags
                this.newarticle.spimg = tdata.spimg
                this.newarticle.staticlink = tdata.staticlink
                this.saveto = tdata.saveto
                this.newarticle.keyword = tdata.keyword
                this.newarticle.describe = tdata.describe
                this.newarticle.static_link_seted = true  // 固定链接已设置
                this.newarticle.cc1 = tdata.cc1
                this.newarticle.cc2 = tdata.cc2
                this.newarticle.cc3 = tdata.cc3
                this.newarticle.password_protected = tdata.password_protected
                if (tdata.pub){
                    this.tips = "正在加载文章，请稍后"
                    // 先加载数据再读取文章
                    reads_remote(lnk + "." + this.saveto,(md)=>{
                        // 读取文章
                        if (this.newarticle.password_protected){
                            // 解密
                            this.artpassword = prompt("文章已加密，请输入密码：")
                            this.artinfo = AES_decrypt(md,this.artpassword)
                        }
                        else{
                            this.artinfo = md
                        }
                        MDEdit.clear()
                        MDEdit.appendMarkdown(this.artinfo)
                        this.tips = "加载完成"
                        document.getElementsByClassName("CodeMirror-gutters")[0].style.left=null;
                    },false,()=>{alert("文章内容读取失败，请刷新重试")})
                }
                else{
                    this.tips = "找到了固定链接，但文章内容未保存"
                }
                this.loading = false

            },true,()=>{alert("文章数据读取失败，请检查网络连接并刷新重试")})
        },

    },
    mounted(){
        let _this = this
        this.loading = true
        reads_remote("/class/class.json",(r)=>{
            _this.aclass_list = r
            reads_remote("/siteinfo.json",(r)=>{
                _this.site_info = r
                _this.loading = false
            },true,(e)=>{alert("加载失败，请刷新重试");console.log(e)})
        },true,(e)=>{console.error(e);alert("分类加载失败")})
    }

})

upapp.use(ElementPlus)