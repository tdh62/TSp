const hds = {
    props:{now_page:String},
    data(){
        return {
            "load_remote":true,
            "site_info":{
                "site_title":"青橙屋",
                "site_sub_title":"见到你很高兴",
            },
        }
    },
    template:"        <el-header height=\"100px\" tag=\"div\" id=\"site-header\">\n" +
        "            <el-container class='header-row'>\n" +
        "                <el-row align=\"middle\" class=\"header-row\">\n" +
        // "                    <el-col :span=\"1\">\n" +
        // "                    </el-col>\n" +
        "                    <el-col :span=\"20\" class=\"site-titles\" >\n" +
        "                        <h1><span class=\"site-title\" v-text=\"site_info.site_title\"></span>\n" +
        "                            <span class=\"site-sub-title\"> —— {{site_info.site_sub_title}}</span></h1>\n" +
        "                    </el-col>\n" +
        "                    <el-col :span=\"3\">\n" +
        "                    </el-col>\n" +
        "                    <el-col class=\"site-header-map\" :span=\"24\">\n" +
        "                        <el-menu :default-active=\"now_page\" class=\"el-menu-demo\" mode=\"horizontal\"" +
        "                            @select=\"handleSelect\">\n" +
        "                            <el-menu-item index=\"1\">首页</el-menu-item>\n" +
        "                            <el-menu-item index=\"2\">文章</el-menu-item>\n" +
        "                            <el-menu-item index=\"3\">关于&联系</el-menu-item>\n" +
        "                            <el-menu-item index='4' class='right'>设定</el-menu-item>\n" +
        "                        </el-menu>\n" +
        "                    </el-col>\n" +
        "                </el-row>\n" +
        "            </el-container>\n" +
        "        </el-header>",
    mounted(){
        if (this.load_remote){
            reads_remote("/siteinfo.json",(r)=>{
                this.site_info = r
            },true,(e)=>{alert("加载失败，请刷新重试");console.log(e)})
        }
    },
    methods:{
        handleSelect(idx){
            console.log(idx)
            if (idx === "1" ){
                window.location.href = "/index.html"
            }
            else if(idx === "3"){
                window.location.href = "/about.html"
            }
            else if(idx === "4"){
                window.location.href = "/setting.html"
            }
            else{
                window.location.href = "/article-index.html"
            }
        }
    }

}
let shd = null
if (typeof aapp != "undefined"){
    shd = aapp.component("site-header",hds)
    shd.now_page = "1"
}else{
    shd = mainapp.component("site-header",hds)
}
