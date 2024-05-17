<template>
    <div>
      <el-container>
        <el-header id="theHeader">
          <div class="flex v-center header-wrapper space-between">
            <!--          <div class="stystemNam">I<sup>3</sup>CITY EVO 2021</div>-->
            <div class="stystemNam"> 糊了吗！在线点餐系统</div>
            <div class="flex v-center" style="right:5%;margin-right: -50%;height:100%;width:35%;">
              <the-header v-if="showHeader"></the-header>
            </div>
            <div v-if="is_logged===1" >
              <el-button type="primary" style="background: none;
                                          border-top: none;
                                          border-right: none;
                                          border-bottom: none;
                                          border-left: 1px solid #f6faff;
                                          float: right;
                                          border-radius: 0px;
                                          color: #f6faff;" v-if="showHeader" @click="logOut">退出登录</el-button>

            </div>

          </div>
        </el-header>
        <el-main>
          <div v-if="active_step === 0">
            <el-card class="box-card" style="margin: 1%">
              <div  style="height: 700px;">
                <el-card style="height: 200px; width: 600px; margin-top: 5%; margin-left: 30%; cursor: pointer" shadow="hover"
                         @click.native="my_login(0)">
                  <el-row>
                    <el-col :span="9">
                      <img style="margin-left:60px; margin-top: 25px; height: 100px"
                           src="https://s21.ax1x.com/2024/05/15/pknMvgs.png"
                           alt="pknMvgs.png"/>
                    </el-col>
                    <el-col :span="10">
                      <div style="margin-top: 60px; font-size: 25px; font-weight:bold">管理员登录</div>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card style="height: 200px; width: 600px;  margin-top: 2%; margin-left: 30%; cursor: pointer" shadow="hover"
                         @click.native="my_login(1)">
                  <el-row>
                    <el-col :span="10">
                      <img style="margin-left:60px; margin-top: 25px; height: 100px"
                           src="https://s21.ax1x.com/2024/05/15/pknMbE8.png"
                           alt="pknMbE8.png"/>
                    </el-col>
                    <el-col :span="10">
                      <div style="margin-top: 60px; font-size: 25px; font-weight:bold">用户登录</div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </el-card>
          </div>

          <!--            管理员登录页面    -->
          <div v-if="active_step === 1 && is_admin === 1">
            <el-card class="box-card" shadow="never" style="height: 800px">
              <el-form label-position="right" label-width="100px">
                <el-form-item label="用户名">
                  <el-input v-model="AdminInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="AdminInfo.pwd" type="password"></el-input>
                </el-form-item>
              </el-form>
              <div>
                <el-button style="margin-left: 80px" @click="lastStep" plain>上一步</el-button>
                <el-button style="float: right; margin-right: 80px" type="primary" @click="submitLoginInfo(1)" plain>下一步
                </el-button>
              </div>
            </el-card>

          </div>
            <!--            用户登录页面    -->
          <div v-if="active_step === 1 && is_admin === 0">
            <el-card class="box-card" shadow="never"  style="height: 800px">
              <el-form label-position="right" label-width="100px">
                <el-form-item label="用户名">
                  <el-input v-model="UserInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="UserInfo.pwd" type="password"></el-input>
                </el-form-item>
              </el-form>
              <div>
                <el-button style="margin-left: 80px" @click="lastStep" plain>上一步</el-button>
                <el-button style="float: right; margin-right: 80px" type="primary" @click="submitLogginInfo(0)" plain>下一步
                </el-button>
              </div>
            </el-card>
          </div>

<!--          管理员主界面-->
          <div v-if="active_step === 2 && is_admin === 1">
            <el-menu :default-active="adminActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleAdminMenuSelect">
              <el-menu-item index="1">菜单管理</el-menu-item>
              <el-menu-item index="2">订单管理</el-menu-item>
            </el-menu>

<!--            菜单管理界面-->
            <div v-if="adminMenuIndex ==='1'">
              <el-table
                  :data="dishes"
                  style="width: 100%">
                <el-table-column
                    type="index"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="菜品图片"
                    width="200">
                  <template v-slot="scope">
                    <el-image style="height: 100px" :src="dishes[scope.$index].img"></el-image>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="菜品名称"
                    width="100">
                  <template v-slot="scope">
                    {{dishes[scope.$index].name}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="价格"
                    width="180">
                  <template v-slot="scope">
                    <span style="color: red">¥ {{dishes[scope.$index].price}}元</span>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="stock"
                    label="库存数量">
                  <template v-slot="scope">
                    {{dishes[scope.$index].stock}}
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="250">
                  <template v-slot="scope">
                    <el-button style="float: right; margin-right: 80px" type="warning"
                               icon="el-icon-edit" plain size="small"
                               @click="">修改菜品信息
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--              <div v-for="(item, index) in dishes" :key="index">-->
              <!--                <el-card shadow="never" style="margin-bottom: 5px">-->
              <!--                  <el-image style="height: 100px" :src="item.img"></el-image>-->
              <!--                  <div style="padding: 10px;">-->
              <!--                    <span style="margin-left:5px; font-weight: bold">{{ item.name}}</span>-->
              <!--                    <div class="bottom clearfix">-->
              <!--                      价格：<span style="color: red">¥ {{ item.price }}元</span>-->

              <!--                      <el-button style="float: right" type="primary"-->
              <!--                                 icon="el-icon-circle-plus-outline" plain size="small"-->
              <!--                                 @click="addToCart(item)">加入购物车-->
              <!--                      </el-button>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </el-card>-->
              <!--              </div>-->
            </div>

<!--            订单管理界面-->
            <div v-if="adminMenuIndex ==='2'">
              <el-table
                  :data="all_orders"
                  style="width: 100%">
                <el-table-column
                    prop="name"
                    label="订单编号"
                    width="250">
                  <template v-slot="scope">
                    {{orders[scope.$index].id}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="180">
                  <template v-slot="scope">
                    <div v-if="orders[scope.$index].status === '0'">未支付</div>
                    <div v-else-if="orders[scope.$index].status === '1'">进行中</div>
                    <div v-else>已完成</div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="订单总价">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="生成时间">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                  <template v-slot="scope">
                    <el-button  v-if="orders[scope.$index].status === '0'" style="margin-left: 5px" size="small"
                                @click="addRow = scope.$index; dialogAddConceptVisible = true; ">接单
                    </el-button>
                    <el-button  v-else-if="orders[scope.$index].status === '2'" style="margin-left: 5px" size="small"
                                @click="addRow = scope.$index; dialogAddConceptVisible = true; ">完成
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>



          </div>
<!--          用户主界面-->
          <div v-if="active_step === 2 && is_admin === 0">

            <el-menu :default-active="userActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleUserMenuSelect">
              <el-menu-item index="1">个人中心</el-menu-item>
              <el-menu-item index="2">菜单列表</el-menu-item>
              <el-menu-item index="3">购物车</el-menu-item>
              <el-menu-item index="4">订单列表</el-menu-item>
            </el-menu>

<!--            个人中心-->
            <div v-if="userMenuIndex ==='1'">
              <el-card class="box-card" shadow="never"  style="height: 800px">
                <el-form label-position="right" label-width="100px">
                  <el-form-item label="用户名">
                    <el-input v-model="UserInfo.name" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="UserInfo.pwd" type="password" :disabled="true"></el-input>
                  </el-form-item>
                </el-form>
                <div>
                  <el-button style="margin-left: 80px" plain>修改信息</el-button>
                </div>
              </el-card>
            </div>


            <!--            用户菜单列表-->
            <div v-if="userMenuIndex ==='2'">
              <el-table
                  :data="dishes"
                  style="width: 100%">
                <el-table-column
                    type="index"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="菜品图片"
                    width="200">
                  <template v-slot="scope">
                    <el-image style="height: 100px" :src="dishes[scope.$index].img"></el-image>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="菜品名称"
                    width="100">
                  <template v-slot="scope">
                    {{dishes[scope.$index].name}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="价格"
                    width="180">
                  <template v-slot="scope">
                    <span style="color: red">¥ {{dishes[scope.$index].price}}元</span>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="stock"
                    label="库存数量">
                  <template v-slot="scope">
                    {{dishes[scope.$index].stock}}
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                  <template v-slot="scope">
                    <el-button style="float: right" type="primary"
                               icon="el-icon-circle-plus-outline" plain size="small"
                               @click="addToCart(dishes[scope.$index])">加入购物车
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
<!--              <div v-for="(item, index) in dishes" :key="index">-->
<!--                <el-card shadow="never" style="margin-bottom: 5px">-->
<!--                  <el-image style="height: 100px" :src="item.img"></el-image>-->
<!--                  <div style="padding: 10px;">-->
<!--                    <span style="margin-left:5px; font-weight: bold">{{ item.name}}</span>-->
<!--                    <div class="bottom clearfix">-->
<!--                      价格：<span style="color: red">¥ {{ item.price }}元</span>-->

<!--                      <el-button style="float: right" type="primary"-->
<!--                                 icon="el-icon-circle-plus-outline" plain size="small"-->
<!--                                 @click="addToCart(item)">加入购物车-->
<!--                      </el-button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </el-card>-->
<!--              </div>-->
            </div>

            <!--            购物车-->
            <div v-if="userMenuIndex ==='3'">
                <el-table
                    :data="cart"
                    style="width: 100%">
                  <el-table-column
                      type="index"
                      width="40">
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="所选菜品"
                      width="300">
                    <template v-slot="scope">
                      <el-image style="height: 100px" :src="dishes[cart[scope.$index].id].img"></el-image>
                      {{dishes[cart[scope.$index].id].name}}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="count"
                      label="数量"
                      width="180">
                    <template v-slot="scope">
                      <el-button v-if="cart[scope.$index].count >0" style="margin-left: 5px" icon="el-icon-minus" size="mini" circle
                                 @click="cart[scope.$index].count-- "></el-button>
                      <el-button v-else style="margin-left: 5px" icon="el-icon-remove-outline" size="mini" circle
                                 disabled></el-button>
                       {{cart[scope.$index].count}}
                      <el-button icon="el-icon-plus" size="mini" circle
                                 @click="cart[scope.$index].count++ "></el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="price"
                      label="总价">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="180">
                    <template v-slot="scope">
                      <el-button  style="margin-left: 5px" size="small" type="danger"
                                 @click="addRow = scope.$index; dialogAddConceptVisible = true; ">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

              <el-row style="margin-top: 20px">
                <el-button style="float: right; margin-right: 30px" type="primary" @click="submitTableMapping" plain>订单结算</el-button>
              </el-row>
            </div>

            <!--            订单列表-->
            <div v-if="userMenuIndex ==='4'">
              <el-table
                  :data="orders"
                  style="width: 100%">
                <el-table-column
                    prop="name"
                    label="订单编号"
                    width="250">
                  <template v-slot="scope">
                    {{orders[scope.$index].id}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="180">
                  <template v-slot="scope">
                    <div v-if="orders[scope.$index].status === '0'">未支付</div>
                    <div v-else-if="orders[scope.$index].status === '1'">进行中</div>
                    <div v-else>已完成</div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="订单总价">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="生成时间">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                  <template v-slot="scope">
                    <el-button  v-if="orders[scope.$index].status === '0'" style="margin-left: 5px" size="small"
                                @click="addRow = scope.$index; dialogAddConceptVisible = true; ">去支付
                    </el-button>
                    <el-button  v-else-if="orders[scope.$index].status === '2'" style="margin-left: 5px" size="small"
                                @click="addRow = scope.$index; dialogAddConceptVisible = true; ">去评价
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              </div>



            </div>

        </el-main>
        <el-footer height="50px">
          <div class="about-us tc flex v-center space-around">
            <span>数据库期中课程设计2024 胡蕙滢</span>
          </div>
        </el-footer>
      </el-container>


  </div>
</template>

<style>
/*#app {*/
/*  font-family: Avenir, Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*}*/

/*nav {*/
/*  padding: 30px;*/
/*}*/

/*nav a {*/
/*  font-weight: bold;*/
/*  color: #2c3e50;*/
/*}*/

/*nav a.router-link-exact-active {*/
/*  color: #42b983;*/
/*}*/
#theHeader {
  height: 52px !important;
}

.el-header {
  background: olive linear-gradient(to right, #0152c1, #3b92fc);
}
.el-footer {
  border-top: 1px solid lightgray;
}
.stystemNam {
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
}

.about-us {
  font-size: 14px;
}
.flex {
  display: flex;
}
.v-center {
  align-items: center;
}
.header-wrapper {
  height: 100%;
}
.space-between {
  justify-content: space-between;
}
.space-around {
  justify-content: space-around;
}
.tc {
  text-align: center;
}
</style>

<script>
import _ from "@/utils";

export default {
  data() {

    return {
      /*****************  所有数据在这里定义  *************/
      active_step: 0,
      is_logged:0,
      is_admin: 0,
      showHeader: true,

      /*******  通用数据  ******/
      dishes:[
        {id:"0", name:"汉堡", img:"https://s21.ax1x.com/2024/05/15/pkn3DPO.jpg", stock:"10", price:"25"},
        {id:"1", name:"麻辣小龙虾", img:"https://s21.ax1x.com/2024/05/15/pkn3rGD.jpg", stock:"97", price:"98"},
        {id:"2", name:"回锅肉", img:"https://s21.ax1x.com/2024/05/15/pkn3sRe.jpg", stock:"10", price:"49"},
        {id:"3", name:"皮蛋瘦肉粥", img:"https://s21.ax1x.com/2024/05/15/pkn35i8.jpg", stock:"10", price:"15"}
      ],


      /*******  管理员相关数据  ******/
      AdminInfo: {
        name: 'root',
        pwd: '123456',
      },

      // 界面上方的导航栏
      adminMenuIndex:"1",
      adminActiveIndex: '1',

      all_orders:[
        {id:"0001", status:"0"},
        {id:"0002", status:"1"},
        {id:"0003", status:"2"},
        {id:"0004", status:"2"},
        {id:"0005", status:"2"},
        {id:"0006", status:"2"},
      ],

      /*******  用户相关数据  ******/

      UserInfo: {
        name: 'hpp',
        pwd: '123456',
      },

    // 界面上方的导航栏
      userMenuIndex:"1",
      userActiveIndex: '1',

      cart:[
        {id:"2", count:2},
        {id:"3", count:3}
      ], //记录菜品id和数量

      orders:[ //0-未支付 1-进行中 2-已完成
        {id:"0001", status:"0"},
        {id:"0002", status:"1"},
        {id:"0003", status:"2"},
        {id:"0004", status:"2"},
      ]

    }
  },
  methods: {
    /*****************  所有函数在这里定义，定义好了函数就可以在上面的html标签里用  *************/

    //"上一步"按钮界面切换和变量更新
    lastStep() {
      switch (this.active_step) {
        case 1:
          this.active_step--;
          break;
        case 2:
          this.active_step--;
          break;
        case 3:
          this.active_step--;
          break;
      }
    },

    my_login(idx){
      if(idx === 0){
        // 管理员登录
        this.is_admin = 1

        // 发送post请求，检验其是否符合登录条件，返回为true/false
        _.post('//localhost:8000/admin/adminLogin', {
          name: this.AdminInfo.name,
          pwd: this.AdminInfo.pwd
        }, res => {
          if (res.data) {
            // 获取管理员有关的订单、菜品数据

          } else {
            this.$message.error('数据库连接失败');
          }
        }, () => {
          this.$message.error('数据库连接失败')
        })


        _.get('//localhost:8000/admin/getAdminInfo', {},
            res => {
              console.log(res.data)
              this.$message({
                message: '管理员登录成功',
                type: 'success'
              });

            }, () => {
              this.$message.error('管理员登录失败');
            })

      }else {
        // 用户登录
        this.is_admin = 0

      }
      this.active_step ++
    },

    logOut(){
      this.is_logged = 0
      this.active_step = 0
    },

    submitLoginInfo(idx){
      // 检验登录信息是否正确
      if(idx === 0){
        // 管理员
        // post函数

      } else{
        // 用户
        // post函数

      }
      this.active_step ++
      this.is_logged = 1
    },

    handleUserMenuSelect(key, keyPath) {
      console.log("key", key);
      console.log("keypath", keyPath);
      this.userMenuIndex = key
    },
    addToCart(item){
      // 需要添加SQL逻辑
      this.cart.push({id:item.id, count:1})
    },

    handleAdminMenuSelect(key, keyPath) {
      console.log("key", key);
      console.log("keypath", keyPath);
      this.adminMenuIndex = key
    },

  }
}


</script>