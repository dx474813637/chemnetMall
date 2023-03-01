<template>
	<view class="card-w u-radius-10 u-p-t-20 u-p-b-20 bg-white"  @click.stop="cardClick"> 
		<view class="u-flex u-flex-items-center u-flex-between u-border-bottom u-p-l-20 u-p-b-20 u-p-r-20">
			<view class="item">
				{{origin.name}}
			</view>
			<view class="item text-primary">
				{{origin.state | inquiryState2Str}}
			</view>
		</view>
		<view class="u-flex u-flex-items-center u-flex-between u-p-10 u-p-l-20 u-p-r-20">
			<view class="item u-font-28 u-info">
				CAS号
			</view>
			<view class="item">
				{{origin.cas_no}}
			</view>
		</view>
		<view class="u-flex u-flex-items-center u-flex-between u-p-10 u-p-l-20 u-p-r-20">
			<view class="item u-font-28 u-info">
				需求量
			</view>
			<view class="item">
				{{origin.quantity}} × {{origin.pack}} {{origin.unit}}
			</view>
		</view>
		<view class="u-flex u-flex-items-center u-flex-between u-p-10 u-p-l-20 u-p-r-20">
			<view class="item u-font-28 u-info">
				询盘日期
			</view>
			<view class="item">
				{{origin.cdate}}
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		name: 'InquiryCard',
		props: {
			origin: {
				type: Object,
				default:() => {
					return {}
				},
			}
		},
		data() {
			return { 
			}
		},
		computed: { 
		},
		watch: { 
		},
		methods: { 
			cardClick() {
				this.$emit('cardClick', {data: this.origin})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-w { 
	} 
</style>
