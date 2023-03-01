<template>
	<view class="u-content u-p-20">
		<u-parse :content="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			};
		},
		async onLoad() {
			const res = await this.$api.myEwm()
			if(res.code == 1) {
				this.content = res.list
				uni.setNavigationBarTitle({
					title: res.title
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
