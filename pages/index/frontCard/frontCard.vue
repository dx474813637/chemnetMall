<template>
	<view class="w">
		<!-- <rich-text :nodes="card"></rich-text>
		<u-parse :content="more" ></u-parse> -->
		<view class="card-header u-p-30">
			<view class="bg">
				<i class="custom-icon-mingpian custom-icon"></i>
			</view>
			
			<view class="title text-white u-font-40 u-p-10 u-p-t-40 u-p-b-10">
				<img :src="topimg" alt="" mode="heightFix" style="height: 30px;">
			</view>
			<view class="card">
				<view class="card-main u-radius-10  ">
					<view class="card-main-top u-p-30 u-p-l-40 u-p-r-40 text-base u-font-24 text-dark">
						<view class="img-w">
							<u--image :src="list.img" mode="scaleToFill" width="60px" height="60px" shape="circle"></u--image>
						</view>
						<view class="card-name  u-font-40 u-m-b-20">{{list.name}}</view>
						<view class="u-m-b-20">
							<view class="card-row" v-if="list.position">{{list.position}}</view>
							<view class="card-row" v-if="list.company">{{list.company}}</view>
						</view> 
						<view class="card-row u-m-b-10">手机：{{list.phone}}</view>
						<view class="card-row u-m-b-10">邮箱：{{list.email}}</view>
						<view class="card-row u-m-b-10">地址：{{list.address}}</view>
					</view>
					<view class="card-main-bottom u-flex text-white u-flex-items-center u-font-28">
						<view class="item-btn u-flex-1 u-flex u-flex-items-center u-flex-center " @click="makeCall">
							<i class="custom-icon-dianhua custom-icon text-white u-font-32" ></i>
							<text class="u-p-l-10">{{button.name1}}</text>
						</view>
						<view class="item">
							<view class="line"></view>
						</view>
						<view class="item-btn u-flex-1 u-flex u-flex-items-center u-flex-center" @click="followFunc">
							<i class="custom-icon-attention custom-icon text-white u-font-32" ></i>
							<text class="u-p-l-10">{{button.name2}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tabs-w u-p-l-20 u-p-r-20">
			<u-tabs
				:list="tabs_list"
				:current="tabs_current" 
				:activeStyle="activeTabsStyle"
				lineColor="#4a67ff"
				:itemStyle="itemTabsStyle"
				@change="handleTabsChange"
			> 
			</u-tabs>
		</view> 
		
		<view class="u-p-20">
			<view class="u-radius-10 bg-white u-p-20 u-p-l-30 u-p-r-30 content-w u-font-32"> 
				<u--textarea :value="list.info || ''" readonly autoHeight :customStyle="{border: 'none'}"></u--textarea> 
			</view>
		</view>
		
		
		<u-safe-bottom></u-safe-bottom>
		<menusBar tabbar theme="white" ></menusBar>
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
				login:'',
				card: '',
				more: '',
				follow: 0,
				list: {},
				button: {},
				topimg: '',
				tabs_current: 0,
				activeTabsStyle: {
					fontSize: '30rpx',
					fontWeight: 'bold',
					color: '#4a67ff'
				},
				itemTabsStyle: {
					height: '44px',
					padding: '0 13px'
				},
				tabs_list: [
					{
						name: '主营业务', 
						disabled: false,
					},  
				],
			};
		},
		async onLoad(options) { 
			if (options.hasOwnProperty('login')) {
				this.login = options.login
			}  
			uni.showLoading()
			await this.getData()
		},
		methods: {
			async getData() {
				const res = await this.$api.web_login_card({
					params: {
						login: this.login
					}
				})
				if(res.code == 1) {
					this.setOnlineControl(res)
					this.list = res.list
					this.card = res.mp
					this.more = res.more
					this.topimg = res.topimg
					this.button = res.button
					this.follow = res.follow
					if(res.tz == 1) {
						uni.reLaunch({
							url: res.url
						})
					}
				}
			},
			makeCall() {
				if(!this.list.phone) return
				uni.makePhoneCall({
					phoneNumber: this.list.phone
				});
			},
			showToast(params) {
				this.$refs.uToast.show({ 
					...params,
				})
			},
			async followFunc() {
				// if(!this.isLimit()) return
				// this.$emit('makeCall', {data: this.origin.phone})
				const res = await this.$api.follow({
					params: {
						login: this.list.login,
						follow: this.follow == 1? 2 : 1
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
			changeTabsStatus(key, value) {
				this.tabs_list = this.tabs_list.map(ele => {
					ele[key] = value;
					return ele
				})
			},
			async handleTabsChange(value) {
				// this.keyword = ''
				this.tabs_current = value.index
				// this.changeTabsStatus('disabled', true)
				// this.initParamas();
				// uni.showLoading();
				// await this.getData()
				// this.changeTabsStatus('disabled', false)
			},
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f8f8f8;
		min-height: 100vh;
	}
</style>
<style lang="scss" scoped>
	.content-w {
		min-height: 200px;
	}
	.w {
		padding-bottom: 60px;
		.card-header {
			position: relative;
			z-index: 10;
			.bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 150px;
				background-color: #4a67ff;
				z-index: 10;
				// overflow: hidden;
				&:after {
					content: '';
					position: absolute;
					z-index: 10;
					top: 100%;
					left: 50%;
					width: 120vw;
					height: 120px;
					border-radius: 100%;
					background-color: #4a67ff;
					transform: translate(-50%,-60%);
				}
				.custom-icon-mingpian {
					position: absolute;
					z-index: 15;
					top: 20px;
					right: 40px;
					font-size: 120px;
					color: #fff;
					opacity: .2;
					transform: rotateY(180deg) rotate(20deg);
				}
			}
			
			.title {
				position: relative;
				z-index: 10;
				font-style: italic;
				font-weight: 700;
				letter-spacing: 2px;
				text-shadow:2px 3px 1px #405bde;
				font-family: '微软雅黑';
			}
			.card {
				position: relative;
				z-index: 10;
				&:after {
					content: '';
					position: absolute;
					z-index: 10;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 10px;
					background-color: #fff;
					opacity: .3;
					transform: rotate(-6deg);
				}
				.card-main {
					position: relative;
					z-index: 15;
					overflow: hidden;
					min-height: 170px;
					background-color: #eef0fd;
					box-shadow: 0 5px 10px rgba(77, 106, 255, .3);
					.card-main-top {
						position: relative;
						z-index: 10;
						.img-w {
							position: absolute;
							top: 20px;
							right: 20px; 
						}
						.card-name { 
							color: #000;
						}
						.card-row {  
							color: #555;
						}
					}
					.card-main-bottom {
						background-color: #4b75ff;
						overflow: hidden;
						height: 35px;
						.item-btn {
							height: 100%;
						}
						.line {
							width: 10px;
							height: 50px;
							background-color: #eef0fd;
							transform: rotate(-20deg);
						}
					}
				}
			}
		}
		
	}
</style>
