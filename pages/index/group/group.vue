<template>
	<view class="w " :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<view class="group-header ">
			<view class="bg-w"></view>
			
			<!-- <view class="group-header-bg">
				<image :src="groupData.img" mode="aspectFill" ></image>
			</view> -->
			<view class="group-header-main u-radius-10 bg-white  " style="overflow: hidden;">
				
				<view class="u-m-20 u-radius-10" style="background-color: #f0f4fd; overflow: hidden;">
					<view class="u-flex u-p-10 u-p-l-20 u-p-r-20" >
						<view class="item "> 
							<u--image 
								showLoading 
								:src="groupData.pic" 
								width="60px" 
								height="60px"
								 shape="circle"
							></u--image>
						</view>
						<view class="item u-flex-1 u-m-l-20">
							<view class="u-font-30 text-dark u-m-t-10 u-m-b-10 group-name text-dark u-line-2">{{groupData.name}}</view>
							<view class="u-font-26 text-dark u-flex ">
								<view class="u-flex u-m-r-15">
									<u-icon name="eye" color="#007aff"></u-icon>
									<view class="u-m-l-8 text-dark" v-if="groupData.hasOwnProperty('num')">浏览：{{groupData.num}}</view>	
								</view>
								<view class="u-flex">
									<u-icon name="account" color="#f90"></u-icon>
									<view class="u-m-l-8 text-dark" >成员：{{memberNum}}</view>	
								</view>
								<view class="group-refresh-btn u-m-l-20" @click="refreshList">
									<i class="custom-icon-refresh custom-icon text-primary u-font-36"></i>
								</view>
							</view>
						</view>
					</view>
					<view class="u-line-3 u-font-24 u-p-20 text-base bg-white u-m-l-20 u-m-r-20 u-m-b-20 u-radius-8" v-if="groupData.info">
						<rich-text :nodes="groupData.info"></rich-text> 
					</view>
					<image 
						@click="handleGoto('/pages/my/inquiry/inquiry')" 
						:src="topimg" style="width: 100%; display: block;" mode="widthFix"></image>
				</view>
				<u-notice-bar v-if="groupData.title" :text="groupData.title" mode="closable" bgColor="#f1f5fe" color="#007aff"></u-notice-bar>
			</view>
			
			
			<!-- 群最新动态 -->
			<view class="group-dynamic-w bg-white u-radius-10 u-p-20 u-m-t-30" v-if="find_dynamic == 1">
				<view class="u-flex u-flex-items-baseline u-flex-between u-border-bottom u-p-10">
					<view class="item text-dark u-font-28">群发布</view>
					<view class="text-primary u-font-28" @click="handleGoto({url: '/pages/index/dynamic/dynamicList', params: {id: id}})">查看更多</view>
				</view>
				<view class="group-dynamic u-flex u-flex-items-start u-m-t-10 u-p-20">
					<view class="item">
						<u--image :src="dynamic_list.avatar" width="50px" shape="circle" height="50px"></u--image>
					</view>
					<view class="item u-flex-1 u-m-l-20">
						<view class="u-flex u-flex-between u-flex-items-baseline u-m-b-12">
							<view class="text-dark u-font-28">{{dynamic_list.name}}</view>
							<view class="text-base u-font-28">{{$u.timeFrom(dynamic_list.publishtime*1000)}}</view>
						</view>
						<view class="text-base u-line-2 u-font-28">{{dynamic_list.content}}</view>
						
					</view>
				</view>
			</view>
			
		</view>
		<u-sticky>
			<view class="search-wrapper u-flex u-flex-items-center u-p-10 u-p-l-20 u-p-r-20" style="background-color: #f8f8f8;">
				<view class="item u-flex-1 ">
					<u-search 
						placeholder="检索群成员" 
						v-model="keyword"
						clearabled
						:showAction="false"
						bgColor="#fff"
						shape="square"
						@search="handleSearch"
					></u-search>
				</view>
				<view class="u-m-l-20">
					<u-button type="primary" size="small" plain @click="handleGoto({url: '/pages/index/dynamic/dynamicList', params: {id: id}})">{{dynamic.name}}</u-button>
				</view>
			</view> 
		</u-sticky> 
		<view class="group-main u-p-l-20 u-p-r-20  u-p-t-10">
			
			<u-swipe-action >
				<u-swipe-action-item
				  :options="item.options" 
				  v-for="(item, index) in list"
				  :disabled="item.disabled"
				  autoClose
				  :key="item.id" 
				  :name="index"
				  @click="btnClick"
				>
					<view class="swipe-action " >
						<view class="swipe-action__content " >
							<groupUserCard
								:origin="item"
								@makeCall="makeCall"
								@cardClick="cardClick"
								@follow="follow"
							></groupUserCard>
						</view>
					</view>
				  
				</u-swipe-action-item>
			</u-swipe-action> 
			
			<template name="dataStatus">
				<template v-if="indexList.length == 0">
					<u-empty
						mode="data"
						:icon="typeConfig.white.empty"
					>
					</u-empty>
				</template>
				<template v-else>
					<u-loadmore
						:status="loadstatus"
					/>
				</template>
			</template> 
			<!-- <u-list
				height="100%"
				enableBackToTop
				@scrolltolower="scrolltolower"
				:preLoadingScreen="100"
			>
				
				
				<view class="search-wrapper u-flex u-p-10 u-p-l-20 u-p-r-20">
					<view class="item u-flex-1 ">
						<u-search 
							placeholder="检索群成员" 
							v-model="keyword"
							clearabled
							:showAction="false"
							bgColor="#fff"
							shape="square"
							@search="handleSearch"
						></u-search>
					</view>
					
				</view> 
				<u-swipe-action >
					<u-swipe-action-item
					  :options="item.options" 
					  v-for="(item, index) in list"
					  :disabled="item.disabled"
					  autoClose
					  :key="item.id" 
					  :name="index"
					  @click="btnClick"
					>
						<view class="swipe-action " >
							<view class="swipe-action__content u-border-top" >
								<groupUserCard
									:origin="item"
									@makeCall="makeCall"
									@cardClick="cardClick"
								></groupUserCard>
							</view>
						</view>
					  
					</u-swipe-action-item>
				</u-swipe-action> 
				
				<template name="dataStatus">
					<template v-if="indexList.length == 0">
						<u-empty
							mode="data"
							:icon="typeConfig.white.empty"
						>
						</u-empty>
					</template>
					<template v-else>
						<u-loadmore
							:status="loadstatus"
						/>
					</template>
				</template>
			</u-list> -->
		</view>
		<view style="position: relative;z-index: 10;">
			<u-loading-page
			:loading="pageLoading" 
			loading-text="loading..." 
			loadingMode="semicircle"
			:bg-color="themeConfig.pageBg" 
			:loading-color="themeConfig.loading" 
			:color="themeConfig.pageTextSub" 
			>
			</u-loading-page>
		</view>
		<menusPopupAddGroup
			:show="show" 
			:cate="cate" 
			theme="white" 
			@close="show = false"
			@confirm="joinConfirm"
		></menusPopupAddGroup>
		<u-safe-bottom></u-safe-bottom>
		<tabBar theme="chemnet" :customStyle="{
				'boxShadow': '0 0 10rpx rgba(0,0,0,.1)'
			}">
			<view class="pan-tabbar u-flex u-flex-items-center u-flex-between u-p-r-20 u-p-l-20" :style="{
					color: themeConfig.tabText,
					backgroundColor: themeConfig.tabBg,
				}">
				<view @click="naviback"
					v-if="$u.pages().length > 1"
					class="item-btn u-flex u-flex-1 u-flex-items-center u-flex-center u-flex-column">
					<u-icon name="arrow-leftward" color="#999" size="22"></u-icon>
					<text class="u-font-28">返回</text>
				</view> 
				<view @click="handleGoto({url: '/pages/index/group/groupList', type: 'reLaunch'})"
					v-else
					class="item-btn u-flex-1 u-flex u-flex-items-center u-flex-center u-flex-column">
					<u-icon name="list" color="#999" size="22"></u-icon>
					<text class="u-font-28">群列表</text>
				</view> 
				<view @click="handleGoto({url: '/pages/index/index', type: 'reLaunch'})"
					class="item-btn u-flex-1 u-flex u-flex-items-center u-flex-center u-flex-column">
					<u-icon name="home" color="#999" size="22"></u-icon>
					<text class="u-font-28">首页</text>
				</view> 
				<view class="item-btn  u-flex u-flex-items-center u-flex-center u-flex-2 u-m-l-20" v-if="join == 1">
					<u-button type="error" @click="exitBtnClick">退出</u-button> 
				</view>
				<view class="item-btn  u-flex u-flex-items-center u-flex-center u-flex-2 u-m-l-20" v-if="join == 0">
					<u-button type="primary" @click="joinBtnClick">加入</u-button> 
				</view>
				<view class="item-btn u-flex-3 u-flex u-flex-items-center u-flex-center text-primary u-m-l-20">
					<u-button open-type="share" :customStyle="{
						color: themeConfig.tabText,
						backgroundColor: 'transparent',
						border: '1rpx solid #007aff',
						fontSize: '16px'
					}">  
						<text class="u-p-l-10 text-primary">邀请群友加入</text> 
					</u-button>

				</view>
			</view>
		
		</tabBar>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	import mixShareInfo from '@/config/mixShareInfo' 
	export default {
		mixins: [mixShareInfo],
		data() {
			return { 
				keyword: '',
				pageLoading: true,
				id: '',
				indexList: [] ,
				dynamic_list: {},
				find_dynamic: 0,
				dynamic: {},
				memberNum: 0,
				groupData: {},
				guanli: 0,
				join: 0,
				card_info: [],
				card: 0,
				cate: null,
				curP: 1,
				loadstatus: 'loadmore',
				notice: '',
				show: false,
				nologintips: '',
				topimg: ''
			};
		},
		computed: {
			...mapState({
				typeActive: state => state.theme.typeActive,
				typeConfig: state => state.theme.typeConfig,
				sh: state => state.user.sh,
				wode: state => state.user.wode,
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
			list() {
				if(!this.indexList || this.indexList.length == 0) return []
				let disabled = true; 
				if(this.guanli == 1) disabled = false
				return this.indexList.map(ele => {
					let isMe = (ele.login == this.wode.login || ele.login == this.wode.mobile) ? 1 : 0;
					return {
						...ele,  
						isMe: isMe,
						// disabled: false,
						disabled: disabled || isMe == 1,
						options: [
							{
								text: '移除',
								name: 'delet',
								style: {
									backgroundColor: '#ff0000'
								}
							}, 
						]
					}
				})
			}
		},
		async onLoad(options) { 
			if (options.hasOwnProperty('id')) {
				this.id = options.id
			}  
			await this.getGroupData()
			this.pageLoading = false 
			await this.getData()
			// await this.getCpyData()
			// await this.getDataList()
		}, 
		async onPullDownRefresh() {
			console.log('refresh');
			await this.refreshList()
			uni.stopPullDownRefresh();
		},
		async onReachBottom () {
			this.scrolltolower()
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({ 
				wodeFunc: 'user/wode', 
			}), 
			async handleSearch() {
				this.initParamas()
				await this.getData()
			},
			async refreshList() {
				this.initParamas()
				this.pageLoading = true
				await this.getGroupData()
				this.pageLoading = false
				await this.getData()
			},
			showToast(params) {
				this.$refs.uToast.show({ 
					...params,
				})
			},
			initParamas() {
				this.curP = 1;
				this.indexList = [];
				this.loadstatus = 'loadmore'
			},
			scrolltolower() {
				this.getMoreData()
			},
			async getGroupData() { 
				const res = await this.$api.group_book_detail({
					params:{
						id: this.id
					},
				})
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.groupData = res.list
					this.guanli = res.guanli
					this.join = res.join
					this.card_info = res.card_info
					this.card = res.card
					this.cate = res.cate
					this.nologintips = res.tip
					this.topimg = res.topimg 
					this.dynamic_list = res.dynamic_list 
					this.find_dynamic = res.find_dynamic 
					this.dynamic = res.dynamic
				}
			},
			async getData() {
				if(this.loadstatus != 'loadmore' && !refreshCurP) return
				this.loadstatus = 'loading'
				const res = await this.$api.group_book_member_list({params:{
					p: this.curP,
					id: this.id ,
					terms: this.keyword
				}})
				if(res.code == 1) { 
					this.memberNum = res.total
					this.indexList = [...this.indexList, ...res.list] 
					
					if( this.indexList.length == res.total || !res.list ||res.list.length == 0) {
						this.loadstatus = 'nomore'
					}else {
						this.loadstatus = 'loadmore'
					}
				}
			},
			async getMoreData() {
				if(this.loadstatus != 'loadmore') return
				this.curP ++
				await this.getData()
			},
			naviback() {
				uni.navigateBack() 
			},
			async btnClick({index: btnIndex, name: itemIndex}) {
				let item = this.list[itemIndex] 
				if(item.options[btnIndex].name == 'delet') {
					uni.showLoading()
					const res  = await this.$api.kicking_out_group_book({params: {tid: item.id,id: this.id}})
					if(res.code == 1) {
						this.showToast({
							type: 'success',
							message: res.msg, 
						})
						this.indexList.splice(itemIndex, 1)
						this.memberNum -= 1
						// uni.showLoading()
						// this.initParamas() 
						// await this.getData()
					}
				}
			},
			async joinConfirm({data}) {
				uni.showLoading()
				await this.joinFunc({...data, id: this.id, cate: this.cate})
				this.show = false
			},
			async joinBtnClick() {
				if(this.cate == 1) {
					await this.joinFunc({id: this.id, cate: 1})
					this.wodeFunc()
				}else {
					this.show = true
				}
				
				
			},
			async joinFunc(params) {
				const res = await this.$api.join_group_book({
					params,
				})
				if(res.code == 1) {
					this.showToast({
						type: 'success',
						message: res.msg, 
					})
					uni.showLoading()
					await this.refreshList()
				}
			},
			async exitBtnClick() {
				uni.showModal({
					title: '提示',
					content: '是否退出该群',
					success: async (r) => {
						if (r.confirm) {
							const res = await this.$api.out_group_book({
								params: { id: this.id }
							})
							if(res.code == 1) {
								this.showToast({
									type: 'success',
									message: res.msg, 
								})
								uni.showLoading()
								await this.refreshList()
							}
						} else if (r.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			isLimit() {
				let islimit = true
				if(this.join != 1) {
					islimit = false 
				}
				if(!islimit) {
					this.showToast({
						type: 'error',
						message: this.nologintips, 
					})
				}
				return islimit
			},
			makeCall({data}) {
				if(!this.isLimit()) return
				// this.$emit('makeCall', {data: this.origin.phone})
				uni.makePhoneCall({
					phoneNumber: data
				});
			},
			async follow({data}) {
				if(!this.isLimit()) return
				// this.$emit('makeCall', {data: this.origin.phone})
				const res = await this.$api.follow({
					params: {
						login: data.login,
						follow: 1
					}
				})
				if(res.code == 1) {
					this.showToast({
						type: 'success',
						message: res.msg, 
					})
				}
			},
			cardClick({data}) {
				if(!this.isLimit()) return
				this.handleGoto({
					url: '/pages/index/frontCard/frontCard',
					params: {
						login: data.login
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f8f8f8;
		/deep/ {
			.u-swipe-action-item {
				border-radius: 10px!important;
				overflow: hidden!important;
				margin-bottom: 6px!important;
			}
		}
	}
</style>
<style lang="scss" scoped>
	.search-wrapper {
		position: relative;
		z-index: 10;
	}
	.pan-tabbar {
		height: 100%;
	
		.item-btn {
			height: 100%;
	
			&.share-btn {}
		}
	}
	.w {
		min-height: 100vh;
		padding-bottom: 60px;
		box-sizing: border-box;
	}
	.group-dynamic {
		
	}
	.group-main {
		min-height: calc(100vh - 104px);
		// flex: 1; 
		// overflow: hidden;
	}
	.group-header {
		position: relative;
		padding: 30px 10px 5px 10px;
		.bg-w {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100px;
			z-index: 5;
			background-color: #2c67df; 
		}
		.group-refresh-btn {
			// position: absolute;
			// right: 8px;
			// top: 8px;
			// padding: 10px;
			z-index: 15;
		}
		.group-header-bg {
			position: absolute;
			z-index: 5;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: #9c9ea6;
			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.15);
				z-index: 10;
			}
			image {
				position: relative;
				z-index: 8;
				width: 100%;
				height: 100%; 
			}
		}
		.group-header-main {
			position: relative;
			z-index: 10;
			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
		}
		.group-name {
			font-weight: bold;
		}
	}

</style>
