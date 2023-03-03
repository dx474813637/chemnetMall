<template>
	<view class="card u-p-30 bg-white u-radius-8 u-flex u-flex-between">
		<view class="item" @click="cardClick">
			<template v-if="origin.img"> 
				<u--image 
				showLoading 
				:src="origin.img" 
				width="50px" 
				height="50px" 
				shape="circle"
				></u--image>
			</template>
			<template v-else>
				<view class="u-flex u-flex-items-center u-flex-center" style="width: 50px; height: 50px; border-radius: 25px;background-color: #eee;">
					<i class="custom-icon-myfill custom-icon u-font-40" style="color: #999;"></i>
				</view>
			</template>
		</view>
		<view class="item u-flex-1 u-m-l-30" @click="cardClick">
			<view class="u-font-32 text-dark u-m-b-8 u-flex u-flex-items-center">
				<view class="u-m-r-20">{{origin.name}}</view>
				<u-tag text="我" plain type="primary" size="mini" v-if="origin.isMe"></u-tag>
			</view>
			<view class="u-font-26 text-light u-line-2">{{origin.company}}</view>
		</view>
		<view class="item u-flex u-flex-items-center u-flex-center u-p-20" @click="makeCall" v-if="origin.isMe != 1 && origin.phone">
			<i class="custom-icon-dianhua custom-icon " style="font-size: 24px; color: #26c341;"></i>
		</view>
		<view class="item u-flex u-flex-items-center u-flex-center  text-primary " >
			<u-button 
				type="error" 
				size="small" 
				@click="follow" 
				plain
				v-if="origin.isMe != 1 && origin.phone"
				:customStyle="{
					fontSize: '14px',
					minWidth: 'auto'
				}">{{followBtnText}}</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		name:"groupUserCard",
		props: {
			origin: {
				type: Object,
				default:() => {
					return {}
				},
			}, 
			followBtnText: {
				type: String,
				default: '关注'
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			cardClick() {
				this.$emit('cardClick', {data: this.origin})
			},
			makeCall() {
				this.$emit('makeCall', {data: this.origin.phone})
				// uni.makePhoneCall({
				// 	phoneNumber: this.origin.phone
				// });
			},
			follow() {
				this.$emit('follow', {data: this.origin})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>