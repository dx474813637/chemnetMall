<template>
	<view class="card-w u-p-20"
		:style="{
			backgroundColor: bgColor,
			borderRadius: borderRadius,
			boxShadow: boxShadow
		}"
		 @click="handleGotoDetail"
		>
		<view class="card-header u-flex u-flex-items-center u-flex-between  u-p-5">
			<view class="u-flex u-flex-items-baseline">
				<view class="u-font-28 text-base"> 
					<u-tag :text="customData.id" plain size="mini" borderColor="#ccc" color="#777"></u-tag>
				</view>
				<!-- <u-tag :text="customData.id" size="mini" ></u-tag> -->
				<view class="u-line-1 u-m-l-10">{{ customData.Sinfo.name}}</view>
			</view>
			
			<view class=" u-font-28" style=" flex: 0 0 auto;" >
				<u-tag :text="customData.state | orderState2Str"></u-tag>
			</view>
		</view>
		<view class="card-main u-p-t-20">
			<view class="main-row u-flex u-flex-between u-flex-items-start u-p-20 u-radius-8 page-bg2">
				<view class="item">
					<text class="">{{customData.name}}</text>
					<text class="u-m-l-12 u-info u-font-28">{{customData.cas_no}}</text>
				</view> 
			</view>
			<view class="main-row u-flex u-flex-between u-flex-items-center u-m-t-20 u-p-5">
				<view class="item text-light u-font-28">成交量</view>
				<view class="item u-info-dark">{{customData.quantity}} × {{customData.pack}}{{customData.unit}}</view>
			</view>
			<view class="main-row u-flex u-flex-between u-flex-items-center u-m-t-10 u-p-5">
				<view class="item text-light u-font-28">交易日期</view>
				<view class="item u-info-dark">{{customData.cdate}}</view>
			</view> 
		</view>
		<!-- <view class="card-footer u-flex u-flex-between u-flex-items-center u-p-b-12 u-p-t-12">
			<view></view>
			
		</view> -->
	</view>
</template>

<script>
	export default {
		name: 'CustomCard',
		props: {
			bgColor: {
				type: String,
				default: '#fff',
			},
			ordertype: {
				type: String,
				default: 'B',
			},
			ids: {
				type: String,
				default: 'ids',
			},
			seller: {
				type: String,
				default: 'seller',
			},
			prod: {
				type: String,
				default: 'prod',
			},
			price: {
				type: String,
				default: 'price',
			},
			prices: {
				type: String,
				default: 'prices',
			},
			num: {
				type: String,
				default: 'num',
			},
			pay_type: {
				type: String,
				default: 'pay_type',
			},
			date: {
				type: String,
				default: 'date',
			},
			unit: {
				type: String,
				default: 'unit',
			},
			ht_status: {
				type: String,
				default: 'ht_status',
			},
			boxShadow: {
				type: String,
				default: '0 0 10rpx rgba(0,0,0,.1)',
			},
			borderRadius: {
				type: String,
				default: '16rpx',
			},
			customData: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				
			}
		},
		computed: {
			
		},
		methods: {
			handleGotoDetail() {
				this.$emit('detail', this.customData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.name {
		color: #000;
		font-size: 30rpx;
	}
	.pp {
		color: #666;
		font-size: 32rpx;
		padding-left: 10rpx;
	}
	.item-sub {
		color: #666;
	}
</style>
