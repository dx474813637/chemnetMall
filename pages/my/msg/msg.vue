<template>
	<view class="text-white w " :class="[typeActive]" :style="{
		backgroundColor: themeConfig.pageBg
	}">
		<view :style="{
			backgroundColor: themeConfig.navBg
		}">
			<navBar 
				:title="`${title}${lunxunLoading? '（更新中...）' :''}`"
				backBtn
				@backEvent="handleBackEvent"
			></navBar>
		</view>	
		<view class="list" :style="{
			height: `calc(100% - 94px - ${sys.statusBarHeight}px - ${sys.safeAreaInsets.bottom}px)`
		}">
			<template v-if="loading">
				<view class="u-p-20 animation" v-for="item in 3" :key="item">
					<u-skeleton loading avatar animate rows="2" :title="false" avatarShape="square" avatarSize="48"></u-skeleton>
				</view>
				
			</template>
			<template v-else>
				<scroll-view
					scroll-y
					style="height:100%"
					enable-back-to-top
					scroll-anchoring
					refresher-enabled	
					:refresher-default-style="typeActive == 'dark'?'white': 'black' "
					:refresher-triggered="refresher"
					@refresherrefresh="refresherrefresh"
				>
					<view
						v-for="(item, index) in indexList"
						:key="item.id"
					>
						<MsgRowsCard
							:msg="item"
							@detail="handleRouteTo"
						></MsgRowsCard>
						
					</view>
					
					<template v-if="indexList.length == 0">
						<u-empty
							mode="data"
							:icon="themeConfig.empty"
							marginTop="80"
							:textColor="themeConfig.pageTextSub"
						>
						</u-empty>
					</template>
					<!-- <template v-else>
						<u-loadmore
							:status="loadstatus"
						/>
					</template> -->
				</scroll-view>
			</template>
		
		</view>	
		<menusBar tabbar  :theme="typeActive" ></menusBar>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations} from 'vuex'
	import MsgRowsCard from '@/pages/my/components/MsgRowsCard/MsgRowsCard.vue'
	export default {
		data() {
			return {
				title: '消息列表',
				loading: true,
				indexList: [],
				refresher: false,
				curP: 1,
				loadstatus: 'loadmore',
				timer: null,
				lunxunLoading: false,
			};
		},
		components: {
			MsgRowsCard
		},
		computed: {
			...mapState({
				typeActive: state => state.theme.typeActive,
			}),
			...mapGetters({
				themeConfig: 'theme/themeConfig',
				sys: 'theme/sys'
			}),
			paramsObj() {
				return {
					p: this.curP,
				}
			}
		},
		onLoad() {
			this.refreshList()
			this.lunxun()
		},
		onUnload() {
					console.log('onUnload')
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			handleBackEvent() {
				uni.navigateBack()
			},
			lunxun() {
				if(this.timer) return;
				clearInterval(this.timer)
				this.timer = null
				this.timer = setInterval(async () => {
					console.log('setIn')
					// if(this.refresher || this.loading || this.lunxunLoading || this.loadstatus == 'loading') return
					this.lunxunLoading = true;
					await this.refreshList()
					this.lunxunLoading = false;
					// const list = []
					// for(let i = 0; i < this.curP; i++) {
					// 	list.push(this.$api.getMsgList({params: {p: i}}))
					// };
					// Promise.all(list).then(data => {
					// 	console.log(res)
					// })
					
				}, 10000)
			},
			async refreshList() {
				this.initParamas()
				await this.getData()
			},
			initParamas() {
				// this.curP = 1;
				// this.indexList = [];
				this.loadstatus = 'loadmore'
			},
			// scrolltolower() {
			// 	if(this.lunxunLoading) return
			// 	this.getMoreData()
			// },
			async refresherrefresh() {
				uni.showLoading()
				this.refresher = true;
				await this.refreshList()
				this.refresher = false;
			},
			async getData() {
				if(this.loadstatus != 'loadmore') return
				this.loadstatus = 'loading'
				const res = await this.$api.timsNewsList()
				
				if(res.code == 1) {
					this.loading = false
					this.indexList = res.list
					// if(this.curP == 1) this.indexList = res.list
					// else this.indexList = [...this.indexList, ...res.list]
					// if(this.indexList.length >= res.total) {
					// 	this.loadstatus = 'nomore'
					// }else {
					// 	this.loadstatus = 'loadmore'
					// }
				}
			},
			// async getMoreData() {
			// 	if(this.loadstatus != 'loadmore') return
			// 	this.curP ++
			// 	await this.getData()
			// },
			handleRouteTo(data) {
				
				uni.navigateTo({
					url: `/pages/my/msg/msgDetail?login=${data.clogin}`,
					success:() => {
						this.indexList[this.indexList.findIndex(ele => ele.id == data.id)].read = 0
					}
				})
			},
		},
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
						background: #eee!important;
						&--circle {}
						&--square {}
					}
					&__content {
						&__rows,
						&__title {
							background: #eee!important;
						}
					}
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	.w {
		height: 100vh;
	}
	.list {
		
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
