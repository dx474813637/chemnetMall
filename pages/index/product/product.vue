<template>
	<view class=" w " :style="{
		backgroundColor: themeConfig.pageBg
	}">
		<view  >
			<navBar :title="`${onlineControl.title? onlineControl.title :pageConfig[pan].navtitle}`" ></navBar>
			<view class="search-w u-p-l-20 u-p-r-20 u-p-b-10 u-p-t-10 u-flex u-flex-items-center " :style="{
				backgroundColor: themeConfig.navBg,
			}">
				<view @click="handleGoto({url: '/pages/index/search/search' })" class="item u-flex-1" >
					<u-search 
						placeholder="请输入商品中文名、CAS NO." 
						:value="keyword"
						:showAction="false"
						disabled 
						shape="square"
						:bgColor="themeConfig.navText"
					></u-search>
				</view>
				<view class="item u-m-l-20">
					<view
						class="u-flex u-flex-items-center"
						:style="{
							color:  themeConfig.navText
						}"
						@click="handleGoto({url: '/pages/my/inquiry/inquiry'})"
					>
						<i class="custom-icon-roundadd custom-icon"></i>
						<text class="u-p-l-8 u-font-30">发布询盘</text>
					</view>
				</view>
			</view>
			
			<view class="tabs-w" :style="{background: themeConfig.tabBg}">
				<u-tabs
					:list="tabs_list"
					:current="tabs_current"
					lineHeight="0"
					:activeStyle="{...activeTabsStyle, color: themeConfig.tabTextActive}"
					:inactiveStyle="{ color: themeConfig.tabTextInactive}"
					:itemStyle="itemTabsStyle"
					@change="handleTabsChange"
				> 
					<view 
						slot="right"
						class="u-p-r-20 u-flex u-flex-items-center"
						:style="{
							color: themeConfig.pan.pageText
						}"
						@click="show = true"
					>
						<i class="custom-icon-filter2 custom-icon"></i>
						<text class="u-p-l-8 u-font-30">分类筛选</text>
					</view>
					
				</u-tabs>
			</view>
		</view>
		<view class="list" :style="{
			height: `calc(100% - 182px - ${sys.statusBarHeight}px - ${sys.safeAreaInsets.bottom}px)`
		}">
			<template v-if="skeletonLoading">
				<view class="u-p-20 animation" v-for="item in 4" :key="item">
					<u-skeleton loading   animate rows="3" :title="false" avatarShape="square" avatarSize="48"></u-skeleton>
				</view>
			</template>
			<template v-else>
				<u-list
					height="100%"
					enableBackToTop
					@scrolltolower="scrolltolower"
					:preLoadingScreen="100"
				>
					<u-list-item 
						v-if="hot && hot.id"
						
					>
						<view 
							@click="handleGoto({url: '/pages/index/product/productDetail', params: {id: hot.id } })"
							class="product-list-card u-p-15 u-radius-10 u-m-l-15 u-m-r-15 u-m-t-15 u-p-l-80 u-p-r-40 u-flex u-flex-column u-flex-between u-flex-items-start">
							<view class="hot-label">热销</view>
							<view class="main-top text-base u-m-b-14 u-m-t-30 u-font-30">CAS号：{{hot.cas_no}}</view>
							<view class="main-mid u-flex-1 u-font-40">{{hot.name}}</view>
							<view class="main-bottom u-flex u-flex-items-center  u-m-b-30">
								<view class="u-m-r-30 text-primary u-font-40">
									<template v-if="hot.price>0">
										￥ {{hot.price}}
									</template>
									<template v-else>面议</template>
								</view>
								<u-button type="primary" plain size="small">立即询盘</u-button>
							</view>
						</view>
					</u-list-item>
					<u-list-item
						v-for="(item, index) in indexList"
						:key="item.id"
					>
						<view class="u-p-15 u-radius-10 u-m-l-15 u-m-r-15 u-m-t-15" :style="{background: '#fff'}">
							<chemnetCard 
								@cardClick="handleGoto({url: '/pages/index/product/productDetail', params: {id: item.id } })"
								:origin="item"></chemnetCard>
						</view>
						
					</u-list-item>
					
					<template name="dataStatus">
						<template v-if="indexList.length == 0">
							<u-empty
								mode="data"
								:icon="themeConfig.empty"
							>
							</u-empty>
						</template>
						<template v-else>
							<u-loadmore
								:status="loadstatus"
							/>
						</template>
					</template>
				</u-list>
			</template>
			
		</view>
		
		<menusPopup 
			:show="show" 
			theme="white"
			mainkey="category"
			@close="show = false"
			@confirm="menusConfirm"
		></menusPopup>
		<u-safe-bottom></u-safe-bottom>
		<menusBar tabbar :activeIndex="pageConfig[pan].menuIndex" theme="white" ></menusBar>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations} from 'vuex'
	import mixShareInfo from '@/config/mixShareInfo'  
	import { addImageKey, RULES } from '@/utils/chemnetUtils.js'
	export default {
		mixins: [mixShareInfo],
		data() {
			return {
				show: false,
				pan: 's',
				skeletonLoading: true,
				pageConfig: {
					's': {
						navtitle: '卖盘中心',
						menuIndex: 1
					},
					'b': {
						navtitle: '买盘中心',
						menuIndex: 2
					},
				},
				// keyword2: '',
				keyword: '',
				tabs_current: 0,
				activeTabsStyle: {
					fontSize: '30rpx',
					color: '#fff'
				},
				itemTabsStyle: {
					height: '44px',
					padding: '0 13px'
				},
				tabs_list: [
					{
						name: '全部商品',
						category: '',
						keyword: '',
						disabled: false,
					},
				],
				hot: {},
				indexList: [],
				curP: 1,
				loadstatus: 'loadmore',
				noImage: ''
			};
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
			}), 
			themeConfig() {
				return this.typeConfig.chemnet
			},
			paramsObj() {
				return {
					category: this.tabs_list[this.tabs_current].category,
					terms: this.tabs_list[this.tabs_current].keyword,
					p: this.curP,
				}
			}
		}, 
		onLoad(options) {
			// console.log(options)
			if(options.hasOwnProperty('pan')) {
				this.pan = options.pan
			}
			if(options.hasOwnProperty('data')) {
				const data = JSON.parse(decodeURIComponent(options.data))
				// console.log(encodeURIComponent(JSON.stringify(data)))
				this.menusConfirm({
					name: data.name,
					category: data.category,
					keyword: data.keyword || "",
					disabled: false,
				})
				this.tabs_current = 1
			}
			else if(options.hasOwnProperty('keyword')) {
				// this.keyword = options.keyword
				this.menusConfirm({keyword: options.keyword, name: `搜索${options.keyword}结果`})
				this.tabs_current = 1
			}
			else {
				uni.showLoading()
				this.getData()
			}
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),  
			async menusConfirm(data) {
				console.log(data)
				this.tabs_list.push({
					name: data.name,
					keyword: data.keyword || "",
					disabled: false,
					category: data.category,
				})
				this.show = false;
				this.handleTabsChange({index: this.tabs_list.length - 1})
			},
			refreshList() {
				uni.showLoading()
				this.initParamas()
				this.getData()
			},
			initParamas() {
				this.curP = 1;
				this.indexList = [];
				this.hot = {}
				this.loadstatus = 'loadmore'
			},
			changeTabsStatus(key, value) {
				this.tabs_list = this.tabs_list.map(ele => {
					ele[key] = value;
					return ele
				})
			},
			async handleTabsChange(obj) { 
				this.tabs_current = obj.index
				if(obj.index == 0) {
					delete this.customShareParams.data
				}else {
					this.customShareParams.data = encodeURIComponent(JSON.stringify(this.tabs_list[obj.index]))
				}
				
				this.changeTabsStatus('disabled', true)
				this.initParamas();
				uni.showLoading();
				await this.getData()
				this.changeTabsStatus('disabled', false)
			},
			scrolltolower() {
				this.getMoreData()
			},
			async getData() {
				if(this.loadstatus != 'loadmore') return
				this.loadstatus = 'loading'
				// console.log(this.tabs_current)
				let func = 'chemnet_product_list';
				let curKw = this.tabs_list[this.tabs_current].keyword
				if(curKw) func = 'chemnet_product_search'
				const res = await this.$api[func]({params: this.paramsObj})
				// const res = await this.$api.getPanList()
				// console.log(res)
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.noImage = res.noimage
					this.hot = res.list.Hot
					if(curKw) {
						this.indexList = [...this.indexList, ...addImageKey(res.list.list_search, RULES, this.noImage)]
					}
					else {
						this.indexList = [...this.indexList, ...addImageKey(res.list.list_product, RULES, this.noImage)]
					}
					
					console.log(this.indexList)
					if(this.curP == res.total) {
						this.loadstatus = 'nomore'
					}else {
						this.loadstatus = 'loadmore'
					}
				}
				this.skeletonLoading = false
			},
			async getMoreData() {
				if(this.loadstatus != 'loadmore') return
				this.curP ++
				await this.getData()
			},
			handleRouteTo({id}) {
				uni.navigateTo({
					url: `/pages/index/pan/panDetail?id=${id}&pan=${this.pan}`
				})
			},
			handleClickTims({tims, id, origin}) {
				this.handleGoto({
					url: '/pages/my/msg/msgDetail',
					params: {
						login: `${tims.login}`,
						content: `咨询${this.pan=='s'? '卖盘': '买盘'}：${origin.name}，https://www.rawmex.cn/${this.pan=='s'? 'sell': 'buy'}-${id}.html`
					}
				})
				// this.handleGoto({
				// 	url: '/pages/index/webview/webview',
				// 	params: {
				// 		_a: 'msg',
				// 		f: 'detail',
				// 		id: `${tims.id}_${tims.ctime}`,
				// 		ttype: this.pan == 's'? 'sell': 'buy',
				// 		tid: id,
				// 		tims: '1'
				// 	}
				// })
			},
			
			inquiryBtnClick(data) {
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
	page {
		height: 100vh;
		.dark /deep/ {
			.u-skeleton {
				&__wrapper {
					&__avatar {
						background: #1e1f31!important;
						&--circle {}
						&--square {}
					}
					&__content {
						&__rows,
						&__title {
							background: #1e1f31!important;
						}
					}
				}
			}
		}
		.white /deep/ {
			.u-skeleton {
				&__wrapper {
					&__avatar {
						background: #dcdcdc!important;
						&--circle {}
						&--square {}
					}
					&__content {
						&__rows,
						&__title {
							background: #dcdcdc!important;
						}
					}
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	.product-list-card {
		background: #ADA996;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to right, #EAEAEA, #DBDBDB, #F2F2F2, #ADA996);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to right, #EAEAEA, #DBDBDB, #F2F2F2, #ADA996); 
		background-image: linear-gradient(to right, #EAEAEA, #DBDBDB, #F2F2F2, #ADA996); 
		height: 140px;
		position: relative;
		.hot-label {
			position: absolute;
			top: 0;
			left: 15px;
			width: 20px;
			height: 50px;
			padding-top: 10px;
			border-radius: 0 0 5px 5px;
			color: #fff;
			background-color: $uni-color-error;
			font-weight: bold;
			text-align: center;
			font-size: 14px;
		}
		.main-mid {
			font-weight: bold;
		}
		.main-bottom {
			white-space: nowrap;
			font-weight: bold;
		}
	}
	.w {
		height: 100vh;
		padding-bottom: 50px;
		box-sizing: border-box;
	}
	.list {
		height: calc(100% - 177px - env(safe-area-inset-bottom));
		
	}
	
	.animation {
		animation: shandong 1.5s ease infinite;
	}
	@keyframes shandong {
		50% {
			opacity: .5;
		}
		100% {
			opacity: 1;
		}
	}
</style>
