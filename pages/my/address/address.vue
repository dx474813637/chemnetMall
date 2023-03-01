<template>
	<view class="content b-t">
		<template v-if="addrfilter.length > 0">
			<view class="list" :class="{
				active: source == 1
			}">
				<view class="list-item b-b" :class="{
					ziti: item.id == -1,
					sactive: sid == item.id
				}" @click="checkAddress(item)" v-for="(item, index) in addrfilter" :key="item.id">
					<view class="wrapper">
						<view class="u-box u-flex u-flex-items-center u-flex-wrap">
							<view class="name u-line-1">{{item.contact}}</view>
							<view class="mobile">{{item.tel}}</view>
							<view class="u-m-l-10">
								<u-tag v-if="item.def == 1" text="默认" plain size="mini" type="error" plainFill></u-tag>
							</view>	
							<view class="u-m-l-10">
								<u-tag v-if="item.type.includes('R')" text="收" plain size="mini" type="primary" plainFill></u-tag>
							</view>	
							<view class="u-m-l-10">
								<u-tag v-if="item.type.includes('S')" text="发" plain size="mini" type="warning" plainFill></u-tag>
							</view>	
						</view>
						<view class="address-box">
							<text class="address">{{item.Regionals.map(ele => ele.Particular.name).join('')}} {{item.address}}</text>
						</view>
					</view>
					<view class="func u-flex u-flex-items-center u-flex-center">
						<view class="btn-w" @click.stop="addAddress('edit', item)">
							<i class="custom-icon custom-icon-edit"></i>
						</view>
						
					</view>
					
				</view>
			</view>
			<u-loadmore
				:status="loadStatus" 
				:icon-type="iconType" 
				:load-text="loadText" 
				margin-top="60"
				margin-bottom="20"
				color="#999"
			/>
		</template>
		<template v-else>
			<u-empty text="暂无收货地址" mode="data" :icon="typeConfig.white.empty" margin-top="20"></u-empty>
		</template>
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
		
		
	</view>
</template>

<script>
	import listMethods from "./reglist2selectlist.js"
	import mixCheckLogin from '@/config/mixins/mixCheckLoginStatus.js'
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		// mixins: [mixCheckLogin],
		data() {
			return {
				source: 0,
				addressList: [],
				p: 1,
				endFlag: false,
				loadStatus: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '我也是有底线的'
				},
				sid: ""
			}
		},
		computed: {
			...mapState({
				addressArea: state => state.user.addressArea,
				typeConfig: state => state.theme.typeConfig,
			}),
			addrfilter() {
				if(this.addressList.length == 0) return []
				if(this.source == 1 && this.sid && this.sid != -1) {
					let oldArr = this.$u.deepClone(this.addressList)
					let i;
					oldArr.some((ele, index) => {
						if(ele.id == this.sid) {
							i = index
							return true
						}else {
							return false
						}
					})
					if(i) {
						return [ ...oldArr.slice(0, 1), oldArr[i], ...oldArr.slice(1, i), ...oldArr.slice(i+1)]
					}
				}
				return this.addressList
				
			}
		},
		async onLoad(option){
			// console.log(option.source);
			if(option && option.source) {
				this.source = option.source;
			}
			if(option && option.sid) {
				this.sid = option.sid;
				console.log(this.sid)
			}
			uni.showLoading()
			await this.getData()
			this.getAddressArea()
			// this.getRegionalList()
		},
		onReachBottom() {
			this.getNextData()
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}), 
			...mapActions({
				getAddressArea: 'user/getAddressArea'
			}),
			init(){
				this.addressList = []
				this.p = 1
				this.endFlag = false
				this.loadStatus = 'loadmore'
			},
			getNextData() {
				if(this.endFlag) return
				this.p = this.p + 1
				this.getData()
			},
			async getRegionalList() {
				//获取地区toCode 数据 存入vuex
				if(this.$store.state.regionalList.length != 0) {
					return
				}
				let res = await this.$http.get('regional_list')
				let resList = JSON.parse(res.data)
				const list = listMethods(resList)
				this.$store.commit('getRegionalList', list)
				
			},
			async getData() {
				this.loadStatus = 'loading'
				const res = await this.$api.myAddress({params: {p: this.p}})
				console.log(res)
				if(res.code == 1) {
					let list = res.list
					// if(this.p == 1 && this.source != 1) list.splice(0, 1)
					this.addressList = [...this.addressList, ...list]
					
					// console.log(this.addressList)
					if(this.addressList.length >= res.total) {
						this.endFlag = true
						this.loadStatus = 'nomore'
					}else this.loadStatus = 'loadmore'
				}
			},
			//选择地址
			checkAddress(item){
				// console.log(item)
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$utils.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				if(item) {
					uni.navigateTo({
						url: `/pages/my/address/addr_edit?type=${type}&data=${encodeURIComponent(JSON.stringify(item))}`
					})
				}
				else {
					// this.handleGoto({
					// 	url: `/pages/my/address/addr_edit`,
					// 	params: {
					// 		type: type
					// 	}
					// })
					uni.navigateTo({
						url: '/pages/my/address/addr_edit?type='+ type
					})
				}
				
			},
			//添加或修改成功之后回调
			refreshList(type){
				this.init()
				this.getData()
			}
		}
	}
</script>
<style lang='scss'>
	page{
		padding-bottom: 120rpx;
	}
</style>
<style lang='scss' scoped>
	.content{
		position: relative;
	}
	.list.active {
		.list-item {
			/* padding-left: 90rpx; */
			&.sactive {
				padding-left: 90rpx;
			}
			.addr-radio {
				display: block;
			}
		}
	}
	.list-item {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background: #fff;
		position: relative;
		width: 100%;
		min-height: 130rpx;
		box-sizing: border-box;
		.addr-radio {
			position: absolute;
			display: none;
			left: 28rpx;
			top: 50%;
			transform: translateY(-50%);
			.nocheck {
				width: 30rpx;
				height: 30rpx;
				margin-left: 2rpx;
				border-radius: 50%;
				border: 1rpx solid #ccc;
			}
		}
		&.ziti {
			margin-bottom: 60rpx;
			.shouhuotitle {
				display: flex;
			}
		}
		.shouhuotitle {
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			height: 60rpx;
			background-color: #f8f8f8;
			display: none;
			align-items: center;
			padding: 0 20rpx;
			color: #999;
		}
	}
	.func {
		flex: 0 0 auto;
		/* height: 60px; */
		.btn-w {
			padding: 10px;
			/* background-color: #f8f8f8; */
			border-radius: 50%;
			color: #999;
		}
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
		padding-right: 10rpx;
	}
	.address-box{
		/* display: flex; */
		/* align-items: center; */
		
		.address{
			font-size: 30rpx;
			color: $font-color-dark;
			word-break: break-all;
		}
	}
	.u-box{
		font-size: 28rpx;
		color: $font-color-light;
		margin-top: 16rpx;
		margin-bottom: 8rpx;
		.tag{
			font-size: 22rpx;
			color: #fa436a;
			margin-left: 10rpx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4rpx;
			padding: 2rpx 10rpx;
		}
		.name{
			margin-right: 10rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #000;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		width: 120rpx;
		font-size: 40rpx;
		color: $font-color-light;
	}
	
	.add-btn{
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		margin-bottom: 0;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		bottom: 30rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		 */
	}
</style>
