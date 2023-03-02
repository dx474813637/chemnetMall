<template>
	<view class="w u-flex u-flex-column" :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<view class="group-header">
			<view class="group-refresh-btn" @click="refreshList">
				<i class="custom-icon-refresh custom-icon text-white u-font-40"></i>
			</view>
			<view class="group-header-bg">
				<image :src="groupData.img" mode="aspectFill" ></image>
			</view>
			<view class="group-header-main">
				<view class="u-flex u-m-b-20" style="height: 60px;">
					<view class="item "> 
						<u--image 
							showLoading 
							:src="groupData.pic" 
							width="60px" 
							height="60px"
							 shape="circle"
						></u--image>
					</view>
					<view class="item u-flex-1 u-flex u-flex-column u-flex-between u-m-l-20">
						<view class="u-font-32 text-dark u-p-t-10 group-name text-white">{{groupData.name}}</view>
						<view class="u-font-28 text-white u-flex u-p-b-10">
							<view class="u-flex u-m-r-15">
								<u-icon name="eye-fill" color="#007aff"></u-icon>
								<view class="u-m-l-8" v-if="groupData.hasOwnProperty('num')">浏览：{{groupData.num}}</view>	
							</view>
							<view class="u-flex">
								<u-icon name="account-fill" color="#f90"></u-icon>
								<view class="u-m-l-8" >成员：{{memberNum}}</view>	
							</view>
						</view>
					</view>
				</view>
				<view class="u-line-3 u-font-26 text-white" v-if="groupData.info">
					<rich-text :nodes="groupData.info"></rich-text> 
				</view>
			</view>
		</view>
		<view class="search-wrapper u-flex u-p-10 u-p-l-20 u-p-r-20 bg-white u-border-bottom">
			<view class="item u-flex-1 ">
				<u-search 
					placeholder="检索群成员" 
					v-model="keyword"
					clearabled
					:showAction="false"
					bgColor="#e8e8e8"
					@search="handleSearch"
				></u-search>
			</view>
			
		</view>
		<view class="group-main">
			<u-list
				height="100%"
				enableBackToTop
				@scrolltolower="scrolltolower"
				:preLoadingScreen="100"
			>
				<u-notice-bar v-if="groupData.title" :text="groupData.title" mode="closable"></u-notice-bar>
				
				<!-- <template v-if="groupData.guanli != 1">
					<u-list-item
						v-for="(item, index) in 10"
						:key="index"
					>
						<view class="u-border-top">
							<groupUserCard
								:origin="item" 
							></groupUserCard>
						</view>
						
					</u-list-item>
				</template> -->
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
			</u-list>
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
				show: false
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
		// async onPullDownRefresh() {
		// 	console.log('refresh');
		// 	await this.refreshList()
		// 	uni.stopPullDownRefresh();
		// },
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
					position: 'bottom',
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
			cardClick({data}) {
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
		height: 100vh;
		padding-bottom: 60px;
		box-sizing: border-box;
	}
	.group-main {
		flex: 1; 
		overflow: hidden;
	}
	.group-header {
		position: relative;
		padding: 30px 20px 20px 20px;
		.group-refresh-btn {
			position: absolute;
			right: 8px;
			top: 8px;
			padding: 10px;
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
		}
		.group-name {
			font-weight: bold;
		}
	}

</style>
