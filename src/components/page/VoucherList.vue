<template>
    <div class="table portlet-body" style="overflow-x: auto; overflow-y: hidden; overflow: auto;">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <!--<el-button class="handle-del " @click="handleBatchDel" :disabled="!isSelectData">批量删除</el-button>-->
            <el-input v-model="querypara.billno" placeholder="单据号" class="handle-input "></el-input>
            <el-input id="makepeople" placeholder="制单人" class="handle-input "></el-input>

            <div class="date-range">
                <el-date-picker  style="width:46%"
                v-model="querypara.billbegindate"
                type="datetime"
                placeholder="选择开始日期"
                >
                </el-date-picker>
                <span style="width:6%;display:inline-block;text-align: center;">&nbsp;~&nbsp;</span>
                <el-date-picker  style="width:46%"
                v-model="querypara.billenddate"
                type="datetime"
                placeholder="选择结束日期"
                >
                <!--:picker-options="pickerOptions0"-->
                </el-date-picker>
            </div>
        
            <el-input id="accountcode" placeholder="核算帐套" class="handle-input "></el-input>

            <el-select v-model="querypara.billstatus" placeholder="记账状态" class="handle-select ">
                <el-option key="-1" label="全部" value=""></el-option>
                <el-option key="1" label="记账成功" value="1"></el-option>
                <el-option key="0" label="记账失败" value="0"></el-option>
                <el-option key="2" label="处理中" value="2"></el-option>
                <el-option key="9" label="处理超时" value="9"></el-option>
                <el-option key="-99" label="记账作废" value="-99"></el-option>
            </el-select>

            <el-input v-model="querypara.voucherno" placeholder="凭证号" class="handle-input "></el-input>

            <div class="search-div" style="">
            <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            <el-button type="warning" @click="clearCondition">清除条件</el-button>
            </div>
        </div>

        <el-table :data="tableData"  class="table table-striped table-bordered table-hover" border style="width: 100%; table-layout:fixed"  @selection-change="handleSelectionChange" 
        row-class-name="odd gradeX t-row">
            <el-table-column align="center" type="selection" ></el-table-column>
            <!--sortable-->
            <el-table-column align="center" prop="billstatus" label="操作"  width="70px;">
                <template scope="scope">
                    <a @click.prevent="showDetail">查看</a>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="accountcode" label="核算账套编码" width="130px;"></el-table-column>
            <el-table-column align="center" prop="accountname" label="核算账套名称" min-width="200px"  show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="billno" label="单据编号" min-width="150px" ></el-table-column>
            <el-table-column align="center" prop="billtype" label="单据类型" width="100px;" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="voucherno" label="凭证号" width="150px;" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="vouchernote" label="凭证摘要" width="100px;" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="accountyear" label="会计年度" width="95px;" ></el-table-column>
            <el-table-column align="center" prop="accountmonth" label="会计期间" width="95px;" ></el-table-column>
            <el-table-column align="center" label="制单日期" width="160px;">
                <template scope="scope">
                    {{ scope.row.makedate | date('yyyy-MM-dd HH:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="vouchertype" label="凭证类型" width="100px;" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="filesize" label="附单据数" width="95px;"></el-table-column>
            <el-table-column align="center" prop="billstatus" label="状态" width="95px;" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="makepeoplename" label="制单人" width="100px;" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="cur_page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    let queryAttrDefault = function(){
            return {
                billbegindate:'',
                billenddate:'',
                billstatus:'',
                billno:'',
            };
        };
    export default {
        props: ['url'],
        data() {
            return {
                // url: '../../../static/vuetable.json',
                tableData: [],
                cur_page: 1,
                page_size: 10,
                page_total: 400,
                multipleSelection: [],
                querypara: new queryAttrDefault,
            }
        },
        computed:{
            isSelectData: function(){
                return this.multipleSelection.length>0;
            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page_size=val;
                this.getData();
            },
            clearCondition(){
                this.querypara = new queryAttrDefault;
            },
            getData(){
                let self = this;
                var url = this.url;
                if(process.env.NODE_ENV === 'development'){
                   url = '/ms/table/list';
                   url = '/fssc-manager/voucher/fetchData.do';
                };
                var cond = {
					data : this.querypara,
					billbegindate : this.querypara.billbegindate,
					billenddate : this.querypara.billenddate,
					page : {
						pageIndex : this.cur_page,
						pageSize : this.page_size
					}
				};
                
				var jsonstr = JSON.stringify(cond);
                $.ajax({
                    url : url,
                    async : false,
                    cache : false,
                    data : {
                        data : jsonstr
                    },
                    type : 'post',
                    dataType : 'json',
                    success : function(res) {
                        if (res.retCode == 0 && res.msg == 'success') {
                            var resultList = res.data.objList;
                            self.tableData = resultList;
						    self.page_total = res.data.records;
                        } else {
                            this.$message.error('加载数据发生异常！！');
                        }
                    }
                });
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
            },
            showDetail () {
                console.log('show...');
            }
        }
    }

</script>

<style>
.t-row{
    font-family: 微软雅黑; 
    font-size: 12px;
    text-align: center;
}
body{
    overflow :yes;
    font-size: 13px;
    margin: 0px;
    padding: 0px;
}
.handle-box{
    margin-bottom: 20px;
}
.handle-del{
    border-color: #bfcbd9;
    color: #999;
    margin-top: 5px;
}
.handle-select{
    width: 33%;
    margin-top: 5px;
    padding: 5px;
}
.handle-input{
    width: 33%;
    display: inline-block;
    margin-top: 5px;
    padding: 5px;
}
.date-range{
    width: 33%;
    display: inline-block;
    margin-top: 5px;
    padding: 5px;
}
.search-div{
    text-align: center;
    margin-top: 5px;
}
</style>
