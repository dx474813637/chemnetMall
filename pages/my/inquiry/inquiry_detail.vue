<template>
	<view class="u-p-20" >
		<u-loading-page :loading="!list.hasOwnProperty('id')"></u-loading-page>
		<view class="main u-p-30" v-if="list.hasOwnProperty('id')"> 
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">商品名称</view>
				<view class="item u-text-right">
					<view class="u-primary" @click="handleGoto({url: '/pages/index/product/productDetail', params: {id: list.product_id}})">
						{{list.name}}
					</view>
				</view>
			</view>
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">CAS号</view>
				<view class="item u-text-right">{{list.cas_no}}</view>
			</view>
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">卖方/撮合员</view>
				<view class="item u-text-right">{{list.Sinfo.name}}</view>
			</view>
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">需求量</view>
				<view class="item u-text-right">{{list.quantity}} × {{list.pack}} {{list.unit}}</view>
			</view> 
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">收货区域</view>
				<view class="item u-text-right">{{list.Regionals.map(ele=> ele.Particular.name).join('/')}}</view>
			</view>
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">询盘备注</view>
				<view class="item u-text-right">{{list.remark}}</view>
			</view>
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">询盘日期</view>
				<view class="item u-text-right">{{list.cdate}}</view>
			</view> 
			<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
				<view class="item text-light item-label">状态</view>
				<view class="item u-text-right">{{list.state | inquiryState2Str}}</view>
			</view>
			<template v-if="list.id">
				<view class="u-p-30 u-font-36 u-text-center u-m-b-20 u-border-top">撮合信息</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.auth_state == '2'">
					<view class="item text-light item-label">交易订单</view>
					<view class="item u-text-right">
						<u-button 
						type="primary" 
						size="small" 
						@click="handleGoto({url: '/pages/my/order/order', params: {inquiry_id: list.id}})"
						>点击查看</u-button>
					</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">撮合日期</view>
					<view class="item u-text-right">{{list.post_time}}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">撮合状态</view>
					<view class="item u-text-right">{{list.auth_state | authState2Str}}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">撮合员</view>
					<view class="item u-text-right">{{list.Sinfo.contact }}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">撮合员手机</view>
					<view class="item u-text-right">{{list.Sinfo.mobile}}</view>
				</view> 
			</template>
			
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	import {uLoadingPage} from '@/uni_modules/uview-ui/components/u-loading-page/u-loading-page.vue'
	export default {
		data() {
			return {
				id: '',
				list: {}
			}
		},
		async onLoad(opt) {
			if(opt.hasOwnProperty('id')) {
				this.id = opt.id;
			}
			// uni.showLoading()
			await this.getData()
		},
		components: {
			uLoadingPage
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			async getData() {
				const res = await this.$api.detail_inquiry({params: {id: this.id}})
				if(res.code == 1) {
					this.list = res.list[0]
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $page-bg2;
	}
</style>
<style lang="scss" scoped>
	.item-label {
		flex-shrink: 0; 
	}
	.main {
		background-color: #fff;
	}
</style>
