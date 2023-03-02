<template>
	<view class="w">
		<rich-text :nodes="card"></rich-text>
		<u-parse :content="more" ></u-parse>
		<u-safe-bottom></u-safe-bottom>
		<menusBar tabbar theme="white" ></menusBar>
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
				list: {}
			};
		},
		async onLoad(options) { 
			if (options.hasOwnProperty('login')) {
				this.login = options.login
			}  
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
					if(res.tz == 1) {
						uni.reLaunch({
							url: res.url
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.w {
		padding-bottom: 60px;
	}
</style>
