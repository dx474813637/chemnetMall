<template>
	<view class="w u-flex u-flex-column" :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<view class="group-header">
			<view class="group-header-bg">
				<image src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill" ></image>
			</view>
			<view class="group-header-main">
				<view class="u-flex u-m-b-20" style="height: 60px;">
					<view class="item "> 
						<u--image 
						showLoading 
						src="https://cdn.uviewui.com/uview/album/1.jpg" 
						width="60px" 
						height="60px"
						 shape="circle"
						></u--image>
					</view>
					<view class="item u-flex-1 u-flex u-flex-column u-flex-between u-m-l-20">
						<view class="u-font-32 text-dark u-p-t-10 group-name text-white">PTA行业交流行业交流</view>
						<view class="u-font-28 text-white u-flex u-p-b-10">
							<view class="u-flex u-m-r-10">
								<u-icon name="eye-fill" color="#007aff"></u-icon>
								<view class="u-m-l-5">浏览：1234</view>	
							</view>
							<view class="u-flex">
								<u-icon name="account-fill" color="#f90"></u-icon>
								<view class="u-m-l-5">成员：1234</view>	
							</view>
						</view>
					</view>
				</view>
				<view class="u-line-2 u-font-26 text-white">
					欢迎大家积极邀请PTA行业相关人士加入群友通讯录，共同打造产业精准人脉圈，做大行业交流平台。
				</view>
			</view>
			
		</view>
		<view class="group-main">
			<u-list
				height="100%"
				enableBackToTop
				@scrolltolower="scrolltolower"
				:preLoadingScreen="100"
			>
				<u-notice-bar :text="notice" mode="closable"></u-notice-bar>
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
							<view class="swipe-action__content " >
								<groupUserCard
									:origin="item" 
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
		
		<u-safe-bottom></u-safe-bottom>
		<tabBar theme="chemnet" :customStyle="{
				'boxShadow': '0 0 10rpx rgba(0,0,0,.1)'
			}">
			<view class="pan-tabbar u-flex u-flex-items-center u-flex-between u-p-r-20" :style="{
					color: themeConfig.tabText,
					backgroundColor: themeConfig.tabBg,
				}">
				<view @click="naviback"
					v-if="$u.pages().length > 1"
					class="item-btn u-flex-2 u-flex u-flex-items-center u-flex-center">
					<u-icon name="arrow-leftward" color="#999" size="18"></u-icon>
					<text class="u-p-l-10">返回</text>
				</view> 
				<view @click="handleGoto({url: '/pages/index/group/groupList', type: 'reLaunch'})"
					v-else
					class="item-btn u-flex-2 u-flex u-flex-items-center u-flex-center">
					<u-icon name="list" color="#999" size="18"></u-icon>
					<text class="u-p-l-10">群列表</text>
				</view> 
				<view @click="handleGoto({url: '/pages/index/index', type: 'reLaunch'})"
					class="item-btn u-flex-2 u-flex u-flex-items-center u-flex-center">
					<u-icon name="home" color="#999" size="22"></u-icon>
					<text class="u-p-l-10">首页</text>
				</view> 
				<view class="item-btn  u-flex u-flex-items-center u-flex-center u-flex-3 u-m-l-20">
					<u-button type="primary">邀请群友加入</u-button>
		
				</view>
			</view>
		
		</tabBar>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	import mixShareInfo from '@/config/mixShareInfo' 
	export default {
		mixins: [mixShareInfo],
		data() {
			return { 
				pageLoading: true,
				id: '',
				indexList: [{ },{},{},{}] ,
				groupData: {},
				guanli: 1,
				join: 0,
				card_info: [],
				card: 0,
				curP: 1,
				loadstatus: 'loadmore',
				notice: 'uView UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用',
			};
		},
		computed: {
			...mapState({
				typeActive: state => state.theme.typeActive,
				typeConfig: state => state.theme.typeConfig,
				sh: state => state.user.sh,
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
			list() {
				if(!this.indexList || this.indexList.length == 0) return []
				let disabled = true;
				if(this.guanli == 1) disabled = false
				return this.indexList.map(ele => {
					return {
						...ele, 
						disabled: false,
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
		methods: {
			async refreshList() {
				this.initParamas()
				this.pageLoading = true
				await this.getGroupData()
				this.pageLoading = false
				await this.getData()
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
				}
			},
			async getData() {
				if(this.loadstatus != 'loadmore') return
				this.loadstatus = 'loading'
				const res = await this.$api.group_book_member_list({params:{
					p: this.curP,
					id: this.id 
				}})
				if(res.code == 1) {
					this.setOnlineControl(res)
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
						uni.showLoading()
						this.refreshList()
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
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
