<template>
	<view class="card u-p-20 bg-white u-radius-8 uni-shadow-base u-flex u-flex-between" @click="cardClick">
		<view class="item">
			<u--image 
			showLoading 
			src="https://cdn.uviewui.com/uview/album/1.jpg" 
			width="80px" 
			height="80px" 
			radius="5"
			></u--image>
		</view>
		<view class="item u-flex-1 u-m-l-30">
			<view class="u-font-36 text-dark u-m-b-8 u-line-1">PTA行业交流行业交流</view>
			<view class="u-font-28 text-light u-line-3">欢迎大家积极邀请PTA行业相关人士加入群友通讯录行业相关人士加入群友通讯录，共同打造产业精准人脉圈，做大行业交流平台。</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"groupListCard",
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
				
			};
		},
		methods: {
			cardClick() {
				this.$emit('groupClick', {data: this.origin})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>