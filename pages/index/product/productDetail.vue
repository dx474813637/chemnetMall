<template>
	<view class=" w " :style="{
		backgroundColor: themeConfig.pageBg
	}">

		<u-sticky>
			<navBar :title="`${onlineControl.title? onlineControl.title :(pan == 's'? '详情' : '详情')}`" :backBtn="backBtn"
				@backEvent="handleBackEvent"></navBar>
		</u-sticky>
		<!-- <u-notice-bar bgColor="#ff2a2a" color="#fff" text="已下架" v-if="list.state != '1'"></u-notice-bar>
		<u-notice-bar bgColor="#ff6a00" color="#fff" text="已过期" v-else-if="list.hasOwnProperty('expressed') && list.expressed <= 0 && list.trade_mode != '1'"></u-notice-bar>
		 -->
		<view class="pan-header u-p-10" :style="{
			backgroundColor: themeConfig.pan.headerBg,
		}">
			<view class="u-p-10 u-p-l-30 u-p-r-30 u-flex u-flex-items-start u-flex-between" v-if="list.Pinfo">
				<view class="u-flex u-flex-items-center u-flex-wrap u-flex-1">
					<text class="u-font-40 u-p-r-20" :style="{
						color: themeConfig.pan.headerText,
						fontWeight: 'bold'
					}">{{list.Pinfo.name}}</text>

					<view>
						<u-icon name="photo" v-if="list.Pinfo.image"
							@click="imgWrapShow = true" :color="themeConfig.pan.imgBtn" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view class="u-p-l-30 u-p-r-30 " v-if="list.Pinfo">
				<view class="u-flex u-flex-items-center u-flex-wrap u-flex-1"> 
					<view class="u-content u-font-28 " :style="{
						color: themeConfig.pan.headerSubText
					}">
						<text class="u-p-r-14" v-if="list.Cas_info.cnname">
							<text>常用中文名：</text>
							<text>{{list.Cas_info.cnname}}</text>
						</text>
						<text class="u-p-r-14" v-if="list.Cas_info.name">
							<text>常用英文名：</text>
							<text>{{list.Cas_info.name}}</text>
						</text>
					</view>
				</view>
			</view>
			
			<view class=" u-p-t-30 u-p-b-30 u-p-l-20 u-p-r-20">
				<view class="main-box u-font-30 u-m-b-30" :style="{
						backgroundColor: themeConfig.pan.boxBgTop
					}">
					
					<view class="main-box-content u-p-10" :style="{ 
							borderRadius: '20rpx',
						}" >
						<u-read-more ref="uReadMore" showHeight="360"  
							toggle
							closeText="展开全文"
							textIndent="0"
						>
							<view class="xq-h1 u-p-t-30 u-p-b-30 u-p-l-20" :style="{color: themeConfig.themeColor}">
								基本信息
							</view>
							<view class="xq-box">
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.registry_number">
									<view class="xq-title">CAS号</view>
									<view class="xq-content">{{list.Cas_info.registry_number}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.einecs">
									<view class="xq-title">EINECS号</view>
									<view class="xq-content">{{list.Cas_info.einecs}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.molecular_formula">
									<view class="xq-title">分子式</view>
									<view class="xq-content u-flex">
										<rich-text :nodes="list.Cas_info.molecular_formula"></rich-text>
									</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.formula_weight">
									<view class="xq-title">分子量</view>
									<view class="xq-content">{{list.Cas_info.formula_weight}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.risk_description">
									<view class="xq-title">风险术语</view>
									<view class="xq-content">{{list.Cas_info.risk_description}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.safety_description">
									<view class="xq-title">安全术语</view>
									<view class="xq-content">{{list.Cas_info.safety_description}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.cnsynonyms">
									<view class="xq-title">别名</view>
									<view class="xq-content">{{list.Cas_info.cnsynonyms}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.name">
									<view class="xq-title">英文名称</view>
									<view class="xq-content">{{list.Cas_info.name}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.synonyms">
									<view class="xq-title">英文别名</view>
									<view class="xq-content">{{list.Cas_info.synonyms}}
									</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Pinfo.remark">
									<view class="xq-title">简介</view>
									<view class="xq-content">
										<u-parse :content="list.Pinfo.remark" ></u-parse>
									</view>
								</view>
							</view>
							<view class="u-flex u-flex-center">
								<u-line :color="themeConfig.themeColor" length="100%" dashed></u-line>
							</view>
												
							<view class="xq-h1 u-p-t-30 u-p-b-30 u-p-l-20" :style="{color: themeConfig.themeColor}">
								物化性质
							</view>
							<view class="xq-box">
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.density">
									<view class="xq-title">密度</view>
									<view class="xq-content u-flex">
										<rich-text :nodes="list.Cas_info.density"></rich-text>
									</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.refractive_index">
									<view class="xq-title">折射系数</view>
									<view class="xq-content">{{list.Cas_info.refractive_index}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.Melting_Point">
									<view class="xq-title">熔点</view>
									<view class="xq-content u-flex">{{list.Cas_info.Melting_Point}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.Burning_Point">
									<view class="xq-title">自燃温度</view>
									<view class="xq-content u-flex">{{list.Cas_info.Burning_Point}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.Boiling_Point">
									<view class="xq-title">沸点</view>
									<view class="xq-content">{{list.Cas_info.Boiling_Point}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.Flash_Point">
									<view class="xq-title">闪点</view>
									<view class="xq-content">{{list.Cas_info.Flash_Point}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.water_solubility">
									<view class="xq-title">水溶性</view>
									<view class="xq-content">{{list.Cas_info.water_solubility}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.Vapour_Pressure">
									<view class="xq-title">蒸汽压</view>
									<view class="xq-content">{{list.Cas_info.Vapour_Pressure}}</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.usages">
									<view class="xq-title">产品用途</view>
									<view class="xq-content">
										{{list.Cas_info.usages}}
									</view>
								</view>
								<view class="u-flex u-m-b-20 item-row" v-if="list.Cas_info.pic_name1">
									<view class="xq-title">产品结构图</view>
									<view class="xq-content">
										<image :src="list.Cas_info.pic_name1" mode="widthFix" style="width: 180px;height: 180px;"></image> 
									</view>
								</view>
							</view> 
					
						
						</u-read-more>
					</view>
				</view>
				
			</view>
			
			
			
			
			
			

		</view>

		<view class="pan-main">
			<!-- <view class="main-box u-font-30 u-m-b-30" :style="{
					backgroundColor: themeConfig.pan.boxBgTop
				}">
				<view class="main-box-title u-font-34 u-p-t-20 u-text-center">
					我要询盘 
				</view>
				<view class="u-p-15"> 
					<view class="main-box-content u-p-10" :style="{ 
							borderRadius: '20rpx',
						}" >
						<view class="form u-p-l-10">
							<u--form labelPosition="left" :model="xpForm" ref="form" labelWidth="80"
								:borderBottom="false" :labelStyle="{
										color: themeConfig.tabText,
									}">
								<u-form-item label="收货区域" prop="addr" required > 
									<view class="u-flex u-p-15 u-border u-radius-4" 
										@click="handleGoto({url: '/pages/my/address/address', params: {source: 1}})"	
										style="background-color: #eee;"
									>
										<view class="u-flex-1"
											:class="{
												'u-info': !xpForm.addr
											}"
										>{{xpForm.addr || '点击选择地址'}}</view>
										<view class="u-p-t-6 u-p-l-10">
											<u-icon name="arrow-down"></u-icon>
										</view>
									</view>
									
								</u-form-item> 
								<u-form-item label="需求量" prop="num"  > 
									<view class="u-flex u-flex-items-center">
										<view class="item">
											<u-number-box 
												:min="1" 
												:step="1"
												disabledInput
												></u-number-box>
										</view>
										<view class="item u-p-10 u-info">
											×
										</view>
										<view class="item u-font-36">
											{{xpForm.unit_num}}{{list.Pinfo.unit}}
										</view>
									</view>
									
								</u-form-item> 
								<u-form-item label="备注" prop="remark"  > 
									<u--textarea v-model="xpForm.remark" placeholder="请输入内容" ></u--textarea>
									
								</u-form-item> 
								<view class="u-p-t-30 u-p-b-30">
									<u-button type="primary">提 交</u-button>
								</view>
							</u--form>
						</view>
					</view>
				</view>

			</view> -->
			<view class="main-box u-font-30 u-m-b-30" :style="{
					backgroundColor: themeConfig.pan.boxBgTop
				}" v-if="shenheBtn == 1">
				<view class="main-box-title u-font-34 u-p-t-20 u-text-center">
					品牌及规格 
				</view>
				<view class="u-p-15">

					
					<view class="main-box-content u-p-10" :style="{ 
							borderRadius: '20rpx',
						}" >
						<view class="pp-list" v-if="list.list_cas">
							<template v-if="list.list_cas.length == 0">
								<view class=" u-flex u-flex-items-center u-flex-center" style="height: 200px;">
									<u-empty
										mode="data"
										:icon="themeConfig.empty"
									>
									</u-empty>
								</view>
								
							</template>
							<view class="item u-p-10" v-for="item in list.list_cas" :key="item.id" >
								<chemnetCpyCard 
									:origin="item" 
									@handleTimesBtnClick="handleTimesBtn"
									@inquiryBtnClick="inquiryBtnClick"
								></chemnetCpyCard>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="u-flex u-flex-items-center u-flex-center u-p-20 u-m-b-30" :style="{
					color: themeConfig.pan.lightcolor
				}"
				v-if="list.list_pick && list.list_pick.length > 0"
				>严选产品</view>

			<view class="other-list">
				<view class="item u-m-b-20 u-p-10 u-p-l-20 u-p-r-20" v-for="(item, index) in list.list_pick" :key="item.id"
					style="background-color: #fff; border-radius: 5px;"
					@click="handleGoto({url: '/pages/index/product/productDetail', params: {id: item.id }, type: 'redirectTo' })"
					>
					<chemnetCard :origin="item"></chemnetCard>
				</view>
			</view>


		</view>



		<u-safe-bottom></u-safe-bottom>

		<u-popup :show="imgWrapShow" @close="imgWrapShow = false" mode="center" closeable bgColor="transparent">
			<view class="imgw">
				<u-swiper :list="[{pic: list.Pinfo.image}]" keyName="pic" height="60vh" imgMode="aspectFit"
					bgColor="rgba(255,255,255,.7)" indicator previousMargin="10" nextMargin="10"></u-swiper>
			</view>
		</u-popup>



		<tabBar theme="chemnet" :customStyle="{
				'boxShadow': '0 0 10rpx rgba(0,0,0,.1)'
			}">
			<view class="pan-tabbar u-flex u-flex-items-center u-flex-around " :style="{
					color: themeConfig.tabText,
					backgroundColor: themeConfig.tabBg,
				}">
				<view @click="handleGoto({url: '/pages/index/index', type: 'reLaunch'})"
					class="item-btn  u-flex u-flex-items-center u-flex-center">
					<text>首页</text>
				</view>
				<u-line direction="col" :color="themeConfig.pageTextSub" length="30%"></u-line>
				<!-- <view
					@click="handleTimesBtn('', `咨询：${list.name}，https://mall.chemnet.com/product_detail-${id}.html`)"
					class="item-btn  u-flex u-flex-items-center u-flex-center">
					<i class="custom-icon-tims custom-icon"></i>
					<text>在线联系</text>
				</view>
				<u-line direction="col" :color="themeConfig.pageTextSub" length="30%"></u-line> -->

				<!-- <template v-if="orderBtnShow == 1">
					<view class="item-btn u-flex u-flex-items-center u-flex-center"
						:style="{
							color: themeConfig.tabTextActive
						}"
						@click="handleGoto({url: '/pages/my/order/order_edit', params: {ordertype: pan == 's'? 'B' : 'S', id: id, type: 'add'}})"
					>
						<i class="custom-icon-add-product custom-icon"></i>
						<text class="u-p-l-10">{{orderBtnName}}</text>
					</view>
					<u-line direction="col" :color="themeConfig.pageTextSub" length="30%"></u-line>
				</template>
				 -->

				<view class="item-btn  u-flex u-flex-items-center u-flex-center">
					<u-button open-type="share" :customStyle="{
						color: themeConfig.tabText,
						backgroundColor: 'transparent',
						border: 'none',
						fontSize: '16px'
					}">
						<i class="custom-icon-forward custom-icon"></i>
						<text class="u-p-l-10">转发</text>
					</u-button>

				</view>
			</view>

		</tabBar>
		<u-loading-page :loading="pageLoading" loading-text="loading..." loadingMode="semicircle"
			:bg-color="themeConfig.pageBg" :loading-color="themeConfig.loading" :color="themeConfig.pageTextSub">
		</u-loading-page>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	import mixShareInfo from '@/config/mixShareInfo' 
	import { addObjImageKey ,addImageKey, RULES } from '@/utils/chemnetUtils.js'
	export default {
		mixins: [mixShareInfo],
		data() {
			return {
				id: '',
				pan: '',
				key: '',
				imgWrapShow: false,
				jpListShow: false,
				jpSubmitShow: false,
				backBtn: true,
				indexList: [],
				list: {},
				noimage: '',
				cpy: {}, 
				tabs_current: 0,
				tabs_desc: [{
						name: '我要询盘',
						value: 'xp'
					},
					{
						name: '品牌及规格',
						value: 'pp'
					},
					// {
					// 	name: '产品详细信息',
					// 	value: 'xq'
					// },
				],
				pageLoading: true,
				orderBtnShow: 1,
				orderBtnName: '立即下单',
				jpBtnName: '预 约',
				timeLeft: 0,
				xpForm: {
					addr: '',
					num: 1,
					unit_num: 25,
					remark: ''
				},
				addressData: {},
				shenheBtn: 1,
				
			};
		},
		async onLoad(options) {
			if (uni.$u.pages().length == 1) this.backBtn = false
			if (options.hasOwnProperty('id')) {
				this.id = options.id
			}
			if (options.hasOwnProperty('key')) {
				this.key = options.key
			}
			if (options.hasOwnProperty('pan')) {
				this.pan = options.pan
			}
			await this.getData()
			this.pageLoading = false
			// await this.getCpyData()
			// await this.getDataList()
		}, 
		watch: {
			addressData(n) {
				console.log(n)
				this.xpForm.addr = n.contact + '-' + n.Regionals.reduce((pre, cur) => pre + cur.Particular.name, '') + n.address
			}
		},
		computed: {
			...mapState({
				typeActive: state => state.theme.typeActive,
				typeConfig: state => state.theme.typeConfig,
				sh: state => state.user.sh,
			}),
			...mapGetters({
				themeConfig: 'theme/themeConfig',
				sys: 'theme/sys'
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
			shadowStyle() {
				return {
					backgroundImage: `linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, ${this.themeConfig.pan.headerBg} 80%)`,  
					backgroundImage: `linear-gradient(to top, ${this.themeConfig.pan.headerBg}, rgba(255, 255, 255, 0))`, 
					paddingTop: "100px",
					marginTop: "-100px",
				}
			}
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}), 
			load() {
                // this.$refs.uReadMore.init();
            },
			async handleChange({
				index
			}) {
				this.tabs_current = index;
			},
			showToast(params) {
				this.$refs.uToast.show({
					position: 'bottom',
					...params,
				})
			},
			handleBackEvent() {
				uni.navigateBack()
			},
			async refreshData() {
				uni.showLoading()
				await this.getData()
			},
			async getData() {
				const res = await this.$api.chemnet_product_detail({
					params: {
						id: this.id,
						key: this.key
					}
				})
				// console.log(res)
				if (res.code == 1) {
					this.noimage = res.noimage
					addObjImageKey(res.list.Pinfo, RULES, this.noimage)
					addImageKey(res.list.list_pick, RULES, this.noimage)
					this.list = res.list
					this.shenheBtn = res.button
					console.log(this.list)
					this.$nextTick(() => {
						this.$refs.uReadMore.init();
					})
					// console.log(this.list.Pinfo.remark)
					// this.list2 = res.list2 || {}
					// if (this.pan == 's' && this.list.trade_mode == '1') {
					// 	this.initBidConfig()
					// }
					// this.cpy = res.company
					// this.tabs_desc[0].content = this.list.intro
					// this.tabs_desc[1].content = this.list.remark
					// this.tabs_desc[2].label =res.detail_title
					// this.tabs_desc[2].content =res.detail_info
					// this.orderBtnShow = res.button
					// this.orderBtnName = res.button_name
					// this.jpBtnName = res.button_name1
					this.setOnlineControl(res)

				}
			},
			async getCpyData() {
				if (!this.list.login) return
				const res = await this.$api.getCompanyDetail({
					params: {
						login: this.list.login
					}
				})
				// console.log(res)
				if (res.code == 1) {
					this.cpy = res.list
				}
			},
			async getDataList() {
				// if(this.loadstatus != 'loadmore') return
				// this.loadstatus = 'loading'
				const res = await this.$api[this.pan == 's' ? 'getSell' : 'getBuy']({
					params: {
						login: this.list.login,
						// standard: this.list.standard,
						p: 1,
						expressed: 1,
						pr: 3
					}
				})
				if (res.code == 1) {
					this.indexList = res.list.filter(ele => ele.id != this.id)
					// if(this.curP == res.page_total) {
					// 	this.loadstatus = 'nomore'
					// }else {
					// 	this.loadstatus = 'loadmore'
					// }
				}
			},
			handleTimesBtn({login, content = ""}) {
				console.log(login)
				if (!login) login = this.list.Tims.login
				console.log(login)
				// if(this.sh == 1) return
				this.handleGoto({
					url: '/pages/my/msg/msgDetail',
					params: {
						login,
						content,
					}
				})
			},
			inquiryBtnClick({data}) {
				this.handleGoto({
					url: '/pages/my/inquiry/inquiry',
					params: {
						data: encodeURIComponent(JSON.stringify(data)), 
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	.time {
		@include flex;
		align-items: center;

		&__item {
			// color: #fff;
			font-size: 15px;
			text-align: center;
		}
	}
</style>
<style lang="scss" scoped>
	.pan-header {
		padding-bottom: 30px!important;
	}
	.header-info {
		.item {
			flex: 0 0 50%;
			margin-top: 10px;

			.item-label {
				margin-bottom: 4px;
			}

			.item-content {
				word-break: break-all;
			}
		}
	}

	.jp-wrap {
		box-sizing: border-box;
	}

	.jp-bar {
		border-radius: 10px;
	}

	.jp-content {
		width: 100%;
		box-sizing: border-box;
	}

	.imgw {
		width: 100vw;
	}

	.item-label {
		flex: 0 0 80px
	}

	.w {
		padding-bottom: 60px;
		min-height: 100vh;
	}

	.tag {
		display: inline-block;
		line-height: 18px;
		height: 18px;
		border: 1rpx solid #f8f8f8;
		color: #666;
		border-radius: 8rpx;
		padding: 0 8px;
	}

	.pan-tabbar {
		height: 100%;

		.item-btn {
			height: 100%;

			&.share-btn {}
		}
	}

	.pan-main {
		position: relative;
		top: -40px;
		padding: 0 15px;

	}
		.main-box {
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		}
	.main-box-title {
		font-weight: bold;
	}
	.main-box-title .item {
		height: 35px;
		flex: 1 1 50%;

	}

	.pp-list {
		.item {
			border-top: 1rpx solid #eee;
		}
	}

	.xq-box {
		.item-row {}

		.xq-title {
			flex: 0 0 80px;
			color: #999;
			font-size: 28rpx;
			padding-left: 10px;
		}

		.xq-content {
			flex: 1;
			color: #000;
			font-size: 30rpx;
			padding-left: 10px;
			word-break: break-all;
			font-weight: 300;
		}
	}

	.xq-h1 {
		font-weight: bold;
	}
</style>
