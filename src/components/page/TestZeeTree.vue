<template>
    <div>
        <h1>test adb{{new Date()|date}}</h1>
        <ul id="treeDemo" class="ztree">
            <li>abc</li>
        </ul>
    </div>
</template>




<script>

    export default {
        props: ['url'],
        data() {
            return {
                // url: '../../../static/vuetable.json',
                treeData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: ''
            }
        },
        computed:{
            isSelectData: function(){
                return this.multipleSelection.length>0;
            }
        },
        mounted:function(){this.getData()},
//        created(){
//            this.getData();
//        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            handleNodeClick(data) {
                console.log(data);
            },
            getData(){
                console.log('get data');
                let setting = {
                    view : {
                        selectedMulti : false
                    // 禁止多点选中
                    },
                    data : {
                        simpleData : {
                            enable : true,
                            idKey : "id",
                            pIdKey : "pId",
                            rootPId : ""
                        }
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode) {
                            if (!treeNode.isParent) {
                                console.log('click:'+treeNode.name);
                                $.ajax({
                                    url : "/fssc-manager/vouchtemp/treeInfo.do",
                                    dataType : "json",
                                    async : false,
                                    cache : false,
                                    type : 'post',
                                    success : function(data) {
                                        console.log(data);
                                    }
                                });
                            } else {
                               this.handleEdit();
                            }
                        }
                    }
                };
                let self = this;
                self.$axios.post('/fssc-manager/vouchtemp/treeInfo.do').then((res) => {
                    this.treeData = res.data;
                    $.fn.zTree.init($("#treeDemo"), setting, this.treeData);
                })
                /*$.ajax({
                    url : "/fssc-manager/vouchtemp/treeInfo.do",
                    dataType : "json",
                    async : false,
                    cache : false,
                    type : 'post',
                    success : function(data) {
                        self.treeData = data;
                        $.fn.zTree.init($("#treeDemo"), setting, self.treeData);
                        console.log(self.treeData.length);
                        console.log('set tree end');
                    }
                });*/
            },
                formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            handleSelectionChange: function(val) {
                this.multipleSelection = val;
            },
            handleBatchDel: function(){
                this.$message('共删除'+this.multipleSelection.length+'个');
                console.log(this.multipleSelection.length);
            }
        }
    }
</script>

<style scoped>

.handle-box{
    margin-bottom: 20px;
}
.handle-del{
    border-color: #bfcbd9;
    color: #999;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
