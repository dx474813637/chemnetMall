<template>
	<view class="card u-p-30 bg-white u-radius-8 u-flex u-flex-between" @click="cardClick">
		<view class="item">
			<u--image 
			showLoading 
			src="https://cdn.uviewui.com/uview/album/1.jpg" 
			width="50px" 
			height="50px" 
			shape="circle"
			></u--image>
		</view>
		<view class="item u-flex-1 u-m-l-30">
			<view class="u-font-32 text-dark u-m-b-8 u-line-1">张三name</view>
			<view class="u-font-26 text-light u-line-2">名头欢迎大家积极邀请PTA行业相关人士加入群友通讯录行业相关人士加入群友通讯录，共同打造产业精准人脉圈，做大行业交流平台。</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"groupUserCard",
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