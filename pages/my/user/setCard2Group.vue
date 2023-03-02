<template>
	<view class="w">
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
		<!-- <view class="tabs-w">
			<u-tabs
				:list="tabs_list"
				:current="tabs_current"
				lineHeight="0"
				:activeStyle="activeTabsStyle"
				:itemStyle="itemTabsStyle"
				@change="handleTabsChange"
			> 
			</u-tabs>
		</view> -->
		<view class="list">
			<u-list
				height="100%"
				enableBackToTop
				@scrolltolower="scrolltolower"
				:preLoadingScreen="100"
			>
				<u-list-item
					v-for="(item, index) in indexList"
					:key="index"
				>
					<view class="u-p-10 u-p-l-20 u-p-r-20 card" > 
						<view class="guanlian" v-if="item.gl">
							<u-tag text="当前设置" size="mini" type="error"></u-tag>
						</view>
						<groupListCard
							:origin="item"
							@groupClick="setGroup(item)"
						></groupListCard> 
					</view>
					
				</u-list-item>
				
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
		
		<tabBar theme="chemnet" :customStyle="{
				'boxShadow': '0 0 10rpx rgba(0,0,0,.1)'
			}">
			<view class="pan-tabbar u-p-20" :style="{
					color: themeConfig.tabText,
					backgroundColor: themeConfig.tabBg,
				}">
				<view @click="setGroup({id: 0, gl: 1})" class="item-btn ">
					<u-button type="primary">取消关联群</u-button>
				</view> 
			</view>
		
		</tabBar>
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
						trade_type: 'bs',
						disabled: false,
					},
					// {
					// 	name: '买盘',
					// 	trade_type: 'b',
					// 	disabled: false,
					// },
					// {
					// 	name: '卖盘',
					// 	trade_type: 's',
					// 	disabled: false,
					// },
				],
				indexList: [],
				curP: 1,
				loadstatus: 'nomore',
				myCard: {},
				checkedId: '0'
			};
		},
		async onLoad() {
			uni.showLoading()
			this.getmyCard() 
			await this.getData() 
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
			}),
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
				// this.curP = 1;
				this.indexList = [];
				// this.loadstatus = 'loadmore'
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
			async getmyCard() { 
				const res = await this.$api.login_card()
				if(res.code == 1) { 
					this.myCard = res.list 
				}
			},
			async getData() {
				// if(this.loadstatus != 'loadmore') return
				// this.loadstatus = 'loading'
				const res = await this.$api.group_book_list({params:{
					// p: this.curP,
					terms: this.keyword,
					set: 1, 
				}})
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.indexList = [...this.indexList, ...res.list]
					// if( this.indexList.length == res.total || !res.list ||res.list.length == 0) {
					// 	this.loadstatus = 'nomore'
					// }else {
					// 	this.loadstatus = 'loadmore'
					// }
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
				
				// uni.navigateTo({
				// 	url: `/pages/index/group/group?id=${data.id}`
				// })
			},
			async setGroup(data) {
				let id = data.id
				let content = '是否设置该群为名片关联群'
				if(data.gl == 1) {
					content = '是否取消关联群'
					id=0
				}
				uni.showModal({
					title: '提示',
					content: content,
					success: async (r) => {
						if (r.confirm) {
							const res = await this.$api.edit_tiao_book({
								params: {
									id: id
								}
							})
							if(res.code == 1) {
								uni.showToast({
									title: res.msg
								})
								await this.refreshList()
							}
						} else if (r.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-bg2;
		height: 100vh;
	}
</style>
<style lang="scss" scoped>
	.w {
		height: 100%;
		padding-bottom: 60px;
	}
	.pan-tabbar {
		height: 100%;

		.item-btn {
			height: 100%;

			&.share-btn {}
		}
	}

	.list {
		height: calc(100% - 39px);
		
	}
	.card {
		position: relative;
		.guanlian {
			position: absolute;
			left: 10px;
			top: 5px;
			z-index: 10;
		}
	}
</style>
