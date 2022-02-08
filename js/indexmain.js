
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
    },
    mounted(){
        reads_remote("/settings/banner.txt",(r)=>{
            if (r.length > 0 ){
                this.banner_list = r
            }
        },true,(e)=>{console.error(e)})
        this.loading = false
    }
})
mainapp.use(ElementPlus)