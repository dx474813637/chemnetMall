<template>
	<view class="w"> 
		<view class="list">
			<view class="u-p-10 u-p-l-20 u-p-r-20"
				v-for="(item, index) in indexList"
				:key="index">
				<groupUserCard
					:origin="item"
					followBtnText="取消"
					@makeCall="makeCall"
					@cardClick="cardClick"
					@follow="follow"
				></groupUserCard>
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
		
		<u-toast ref="uToast"></u-toast>
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations} from 'vuex' 
	import mixShareInfo from '@/config/mixShareInfo'  
	export default {
		mixins: [mixShareInfo],
		data() {
			return { 
				indexList: [],
				curP: 1, 
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
			async getData() { 
				const res = await this.$api.follow_list()
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.indexList = res.list 
				}
			},  
			
			showToast(params) {
				this.$refs.uToast.show({ 
					...params,
				})
			},
			makeCall({data}) {
				// if(!this.isLimit()) return
				// this.$emit('makeCall', {data: this.origin.phone})
				uni.makePhoneCall({
					phoneNumber: data
				});
			},
			async follow({data}) {
				// if(!this.isLimit()) return
				// this.$emit('makeCall', {data: this.origin.phone})
				const res = await this.$api.follow({
					params: {
						login: data.login,
						follow: 2
					}
				})
				if(res.code == 1) {
					this.showToast({
						type: 'success',
						message: res.msg, 
					})
					uni.showLoading()
					await this.getData() 
				}
			},
			cardClick({data}) {
				// if(!this.isLimit()) return
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
