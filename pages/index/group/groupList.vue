<template>
	<view class="w">
		<view class="list-header u-m-b-40"> 
			<view class="bg-w"></view>
			<image class="img-bg u-m-t-20 u-m-b-10" :src="topimg" mode="widthFix"></image> 
			<view class="xun-ad-w u-p-20 u-radius-8 bg-white u-m-l-20 u-m-r-20 ">
				<view class="notice-bar u-p-20 u-radius-8 u-m-b-20">
					<view class="notice-sub u-m-b-20">
						<view class="text-dark u-p-l-5 u-flex u-flex-items-baseline">
							<view>已为</view>
							<view class="u-p-l-10 u-p-r-10  ">
								<u-count-to :startVal="10000" color="#007aff" :endVal="button.num" duration="1200"></u-count-to>
							</view> 
							<view>个询盘提供匹配服务</view> 
						</view>
					</view>
					<view class="notice bg-white u-p-10 u-p-l-20 u-p-r-20 u-radius-4">
						<view class="text-dark u-font-28 notice-title">最新询盘</view>
						<u-notice-bar :text="notice" bgColor="transparent" color="#333" direction="column"></u-notice-bar> 
					</view>
				</view>
				<view class="inquiry-btn u-m-b-20">
					<u-button type="primary" @click="btnClick" :customStyle="{borderRadius: '8px', backgroundColor: '#2068e7', borderColor: '#2068e7'}">{{button.name}}</u-button>
				</view>
				<view class="text-base u-font-24 u-text-center">发布采购商品，系统将精准匹配优质生产商，专人反馈</view>
			</view> 
		</view>
		<u-sticky>
			<view class="search-wrapper u-flex u-p-l-20 u-p-r-20">
				<view class="item u-flex-1 u-p-b-10">
					<u-search 
						placeholder="检索名称" 
						v-model="keyword"
						clearabled
						:showAction="false"
						bgColor="#e8e8e8"
						@search="handleSearch"
					></u-search>
				</view>
				
			</view>
		</u-sticky> 
		<view class="tabs-w">
			<u-tabs
				:list="tabs_list"
				:current="tabs_current"
				lineHeight="0"
				:activeStyle="activeTabsStyle"
				:itemStyle="itemTabsStyle"
				@change="handleTabsChange"
			> 
			</u-tabs>
		</view> 
		<view class="list">
			<view class="u-p-10 u-p-l-20 u-p-r-20"
				v-for="(item, index) in indexList"
				:key="index">
				<groupListCard
					:origin="item"
					@groupClick="groupClick"
				></groupListCard>
			</view>
			
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
		</view> 
		
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations} from 'vuex' 
	import mixShareInfo from '@/config/mixShareInfo'  
	export default {
		mixins: [mixShareInfo],
		data() {
			return {
				keyword: '',
				tabs_current: 0,
				activeTabsStyle: {
					fontSize: '34rpx',
					fontWeight: 'bold',
					color: '#007aff'
				},
				itemTabsStyle: {
					height: '44px',
					padding: '0 13px'
				},
				tabs_list: [
					{
						name: '全部',
						params: {},
						disabled: false,
					},
					{
						name: '我加入的群',
						params: {
							my: 1
						},
						disabled: false,
					},
					// {
					// 	name: '卖盘',
					// 	trade_type: 's',
					// 	disabled: false,
					// },
				],
				indexList: [],
				curP: 1,
				loadstatus: 'loadmore',
				button: {},
				notice: [],
				topimg: ''
			};
		},
		async onLoad() {
			uni.showLoading()
			await this.getData() 
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
			}),
		}, 
		async onReachBottom () {
			this.scrolltolower()
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			async refreshList() {
				this.initParamas()
				await this.getData()
			},
			initParamas() {
				this.curP = 1;
				this.indexList = [];
				this.loadstatus = 'loadmore'
			},
			handleSearch(v) {
				this.refreshList()
			},
			changeTabsStatus(key, value) {
				this.tabs_list = this.tabs_list.map(ele => {
					ele[key] = value;
					return ele
				})
			},
			async handleTabsChange(value) {
				this.keyword = ''
				this.tabs_current = value.index
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
				const res = await this.$api.group_book_list({params:{
					...this.tabs_list[this.tabs_current].params,
					p: this.curP,
					terms: this.keyword
					// trade_type: this.tabs_list[this.tabs_current].trade_type
				}})
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.button = res.button
					this.notice = res.notice
					this.topimg = res.topimg 
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
			// async handleChangeStatus({state, id}) {
			// 	const res = await this.$api.ableProduct({params: {id, state}})
			// 	if(res.code == 1) {
			// 		const index = this.indexList.findIndex(ele => ele.id == id)
			// 		this.indexList[index].state = 1-this.indexList[index].state
					
			// 	}
			// }, 
			groupClick({data}) {
				
				uni.navigateTo({
					url: `/pages/index/group/group?id=${data.id}`
				})
			},
			btnClick() {
				uni.navigateTo({
					url: this.button.url
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-bg2;
		min-height: 100vh;
		/deep/ {
			.u-notice-bar {
				padding-left: 0px!important;
			}
			.u-notice__left-icon {
				display: none!important;
			}
		}
	}
</style>
<style lang="scss" scoped>
	.w {
		height: 100%;
	}
	.list {
		// height: calc(100% - 83px);
		min-height: calc(100vh - 83px);
		
	}
	.list-new {
		// height: 100vh;
	}
	.list-header {
		position: relative;
		.bg-w {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 180px;
			z-index: 5;
			background-color: #2c67df; 
		}
		.img-bg {
			position: relative;
			z-index: 5;
			width: 100vw;
		} 
		.xun-ad-w {
			position: relative;
			z-index: 5;
			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
		}
		.notice-title {
			font-weight: bold;
		}
		.notice-bar { 
			// width: 315px;
			background-color: #f1f5fe;
		}
		.inquiry-btn {
			// width: 300px; 
			
		}
		.num {
			
		}
	}
</style>
