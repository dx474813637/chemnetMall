<template>
	<view class="card u-flex u-flex-items-center" @click="$emit('cardClick', {origin})">
		<view class="item-img" v-if="!noImageMode">
			<u--image fade showLoading  :src="origin[imgName]" mode="aspectFit" width="80px" height="80px" radius="5" ></u--image>
		</view>
		<view class="item-content u-flex-1 u-p-10 u-p-l-25 u-flex u-flex-column u-flex-between"
			:style="{
				height: noSub && noImageMode ? 'auto': '80px'
			}"
		>
			<view class="content-title u-line-1 u-font-32 u-m-b-10 "
				:class="{
					'u-text-center': noSub && noImageMode
				}"
			>{{origin.name}}</view>
			<view class="content-sub u-line-1 u-flex-1 " v-if="origin.cas_no && !noSub">CAS号:{{origin.cas_no}}</view>
			<view class="u-flex u-flex-between u-flex-items-end" v-if="!noSub"> 
				<view class="content-price u-line-1">
					<text :style="{color: themeConfig.themeColor}">
						<template v-if="origin.price == 0">
							面议
						</template>
						<template v-else>{{origin.price}}</template>
					</text>
					<text class="u-info u-p-l-10" v-if="origin.price > 0" style="font-size: 14px;">元/{{origin.unit}}</text> 
				</view>
				<view class="u-info u-p-l-20" v-if="origin.post_time">
					{{$u.timeFrom(new Date(origin.post_time).getTime())}}
				</view>
			</view>
		</view>
	</view>	
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		name: 'chemnetCard',
		props: {
			origin: {
				type: Object,
				default: () => {
					return {}
				}
			}, 
			imgName: {
				type: String,
				default: 'image'
			},
			noImageMode: {
				type: Boolean,
				default: false
			},
			noSub: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
				page: state => state.user.page,
			}), 
			themeConfig() {
				return this.typeConfig.chemnet
			}
		},
		data() {
			return {
				list: []
			};
		}, 
		mounted() { 
		},
		created() { 
		},
		methods: {
			...mapMutations({
				setMoreMenus: 'user/setMoreMenus',
				setMoreMenusNew: 'user/setMoreMenusNew',
				setWdMenus: 'user/setWdMenus',
				setBrokerMenus: 'user/setBrokerMenus',
				setDingyue: 'user/setDingyue',
				setNewMsg: 'user/setNewMsg',
				setPage: 'user/setPage'
			}), 
		}
	};
</script> 
<style scoped lang="scss">
	.card {
		// background-color: #fff;
		font-size: 14px;;
	}
	.item-img { 
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			background-color: rgba(90,90,90,.1);
		}
	}
	.item-content {
		width: calc(100vw - 160px);
		height: 80px;
	}
	.content-sub {
		color: #999;
		font-size: 14px;
		white-space: nowrap;
	}
	.content-title {
		font-weight: bold;
	}
	.content-price {
		font-size: 16px;
		// font-weight: bold;
	}
</style>
