<template>
	<view class="w u-flex u-flex-column" :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<navBar :title="onlineControl.title"></navBar>
		<view class="h-circle" :style="{
			backgroundColor: themeConfig.navBg,
			color: '#fff', 
		}"> 
			<chemnetSearch></chemnetSearch>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in menusList" :key="item.category" class="u-tab-item "
					:class="{ 'u-tab-item-active': current == index }" :data-current="index"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>

			<scroll-view scroll-y class="right-box">
				<view class="right-title u-flex u-flex-items-center u-flex-between u-font-36 text-dark u-p-20 u-p-l-60">
					<view class="">
						{{menusList[current].name}}
					</view>
					<view @click="labelClick({
						name: menusList[current].name,
						category: menusList[current].category
					})">
						<i class="custom-icon-right custom-icon"></i>
					</view>
				</view>
				<view class="list u-flex u-flex-wrap">
					<view class="card-label u-line-1 u-m-b-12" v-for="(ele, i) in menusList[current].list"
						:key="ele.id" 
						@click="labelClick(ele)"
						>
						{{ele.name}}
					</view>

				</view>

			</scroll-view>
		</view>
		<u-safe-bottom></u-safe-bottom>
		<menusBar activeIndex="0" theme="chemnet"></menusBar>
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
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				dataList: [],
				term: '',
				id: '',
				onlineControl: {
					title: '分类导航'
				}
			}
		},
		async onLoad(options) {
			
			if(options.hasOwnProperty('id')) {
				this.id = options.id
			}
			await this.getMenusList()
			// console.log(this.menusList)
			if(this.id) this.current = this.menusList.findIndex(ele => ele.category == this.id) 
		}, 
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
				menusList: state => state.user.menusList,
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				getMenusList: 'user/getMenusList'
			}),
			initList() {},
			async handlescrolltolower() {


			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index == this.current) return;
				uni.hideLoading()
				this.current = index;

				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			handleSearch() {},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},

			handlePathDetail(obj) {
				// console.log(obj)
				uni.navigateTo({
					url: `/pages/prodDetail/prodDetail?id=${obj.id}`,
				})
			},
			labelClick(data) {
				this.handleGoto({
					url: '/pages/index/product/product', 
					params: { 
						data: encodeURIComponent(`{"name":"${data.name}","category":"${data.category}"}`)
					}
				}) 
			}

		}
	}
</script>

<style lang="scss" scoped>
	.w {
		height: 100vh;
		padding-bottom: 50px;
		box-sizing: border-box;
	}

	.card-label {
		flex: 0 0 48%;
		margin-right: 2%;
		height: 34px;
		line-height: 34px;
		transition: all .3s;
		font-size: 14px;
		text-align: center;
		border-radius: 8rpx;
		position: relative;
		border: 1rpx solid #eee;

		&:nth-of-type(2n) {
			margin-right: 0;
		}
	}

	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 20rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		flex: 0 0 160rpx;
		width: 160rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 120rpx;
		// background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 40rpx;
		padding: 0 10rpx;
		border-top: 1rpx solid #f8f8f8;
		transition: all .3s;

		&.item-left {
			// justify-content: flex-start;
		}
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 28rpx;
		font-weight: 600;
		background: #e6ecff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 2px solid $chemnet_color;
		height: 100%;
		left: 0;
		top: 0;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		flex: 1;
		width: calc(100% - 160rpx);
		background-color: #fff;
		.right-title {
			font-weight: bold;
			position: relative;
			&:before,
			&:after {
				content: ''; 
				position: absolute;
				width: 15px;
				height: 15px;
				border-radius: 3px;
				background-color: $uni-color-primary;
			}
			&:before { 
				left: 5px;  
				top: 13px;
				opacity: .7;
			}
			&:after { 
				left: 10px; 
				top: 20px; 
				opacity: .3;
			}
			
		}
		.list {
			padding: 10rpx;
			width: 100%;
			box-sizing: border-box;
		}
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
