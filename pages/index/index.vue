<template>
	<view class="w" :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<navBar fixed :projectBtn="switchBtn" :title="onlineControl.title" @projectEvent="projectEvent"></navBar>
		<u-status-bar></u-status-bar>

		<!-- <custom-official-account class="cont" :msg="gz_msg" :isFollow="false" :max="-1"></custom-official-account> -->
		<view class="h-circle" :style="{
			backgroundColor: themeConfig.navBg,
			color: '#fff',
			paddingTop: '44px'
		}">
			
			<chemnetSearch></chemnetSearch>
			<!-- <view class="u-p-b-10 step2">
				<u-notice-bar
					v-if="notice.length > 0"
					:bgColor="themeConfig.navBg" 
					:color="themeConfig.warn" 
					:text="notice.map(ele => ele.title)"
					direction="column"
					mode="link"
					@click="handleNoticeIndex"
				></u-notice-bar>
			</view> -->
			<view style="position: relative;z-index: 5;" v-if="this.menusList && this.menusList.length > 0">
				<u-tabs 
					:list="menusList" 
					:lineHeight="0" 
					:lineWidth="0" 
					:activeStyle="{color: '#fff'}"  
					:inactiveStyle="{color: '#fff'}" 
					@click="tabsClick">
					<view slot="right" class="u-p-l-10 u-p-r-10" @tap="show = true">
						<u-icon name="list" size="24" color="#fff" bold></u-icon>
					</view>
				</u-tabs>
			</view>
		</view>

		<view class="main u-p-l-30 u-p-t-15 u-p-r-30">

			<view class="swiper u-m-b-20" v-if="ad_list && ad_list.length > 0">
				<u-swiper :list="ad_list" keyName="img" indicator indicatorMode="line" circular height="160"></u-swiper>

			</view>
			<view class="tbtj index-box u-radius-10 u-m-b-30">
				<view class="index-box-title u-flex u-flex-items-center u-flex-between u-m-b-20 u-p-t-20 u-p-10">
						<view class="box-item u-flex u-flex-items-center">
							<i class="custom-icon-guanzhudu custom-icon text-error u-m-r-15 u-font-40"></i>
						<view class="title">特别推荐</view>
					</view>
				</view>
				<view class="index-box-content" v-if="tbtj_filter.length > 0">
					<u-scroll-list indicator :indicatorColor="themeConfig.light_btn2" :indicatorActiveColor="themeConfig.themeColor">
						<view class="tbtj-list u-p-r-15" v-for="(list, index) in tbtj_filter" :key="index">
							<view class="tbtj-list-item u-m-b-15 bg-white u-radius-5 u-p-6 u-p-l-15 u-p-r-15" v-for="(item, i) in list.list" :key="`${index}${i}`">
								<chemnetCard 
								:origin="item"  
								@cardClick="handleGoto({url: '/pages/index/product/productDetail', params: { id: item.id}})"
								></chemnetCard>
							</view>
						</view>
					</u-scroll-list>
				</view>
			</view>
			
			<view class="rxcp index-box u-radius-10 u-p-t-10 u-p-b-10">
				<view class="index-box-title u-m-b-20">
					<view class="index-box-title u-flex u-flex-items-center u-flex-between u-m-b-20 u-p-t-20 u-p-10">
						<view class="box-item u-flex u-flex-items-center">
							<i class="custom-icon-scoretop custom-icon text-error u-m-r-15 u-font-40"></i>
							<view class="title">热销产品</view>
						</view>
					</view>
				</view>
				<view class="index-box-content" v-if="home_list.list_hot"> 
					<template v-if="home_list.list_hot.length == 0">
						<u-empty mode="data"></u-empty>
					</template>
					<custom-waterfalls-flow
						ref="waterfallsFlowRef_hot" 
						:value="home_list.list_hot" 
						:column="column" 
						:columnSpace="1.5" 
						:seat="2" 
						:listStyle="listStyle"
						imgMask 
						@wapperClick="handleClick" 
						@imageClick="handleClick" 
						@loaded="loaded">
						<view class="item-w u-p-t-20"
							v-for="(item, index) in home_list.list_hot"
							:key="item.id"
							 slot="slot{{index}}"
						>
							<view class="card-main u-font-30">
								<view class="u-line-2 u-font-30"> 
									<text style="font-weight: bold;">{{item.name}}</text>
								</view>
								<view class="u-line-1 text-base u-m-t-10 u-m-b-10"> 
									<text>{{item.cas_no}}</text>
								</view>
								<view class="u-line-1 text-primary u-font-30"> 
									<text v-if="item.price > 0">￥ {{item.price}}</text>
									<text v-else>面议</text>
								</view>
							</view>
						</view>
					</custom-waterfalls-flow>
						 
					
				</view>
			</view>
			<!-- <view class="tbtj index-box u-radius-10 u-m-b-30"> 
				<view class="index-box-content" v-if="turn_filter.length > 0">
					<u-scroll-list indicator :indicatorColor="themeConfig.light_btn2"  :indicatorActiveColor="themeConfig.themeColor">
						<view class="tbtj-list u-p-r-15" v-for="(list, index) in turn_filter" :key="index">
							<view class="tbtj-list-item u-m-b-15 bg-white u-radius-5 u-p-6 u-p-l-15 u-p-r-15" v-for="(item, i) in list.list" :key="`${index}${i}`">
								<chemnetCard 
								:origin="item"  
								@cardClick="handleGoto({url: '/pages/index/product/productDetail', params: { id: item.id}})"
								></chemnetCard>
							</view>
						</view>
					</u-scroll-list>
				</view>
			</view> -->
			<view class="tbtj index-box u-radius-10 u-m-b-30 u-m-t-50" v-if="turn_swiper.length > 0">
				<view class="index-box-content">
					<u-scroll-list indicator :indicatorColor="themeConfig.light_btn2"  :indicatorActiveColor="themeConfig.themeColor">
						<view class="tbtj-list u-p-r-15" v-for="(item, index) in turn_swiper" :key="item.id">
							<view class="tbtj-list-item u-m-b-15 bg-white u-radius-5 u-p-6 u-p-l-15 u-p-r-15" >
								<chemnetCard 
								:origin="item"
								noImageMode
								noSub
								@cardClick="handleGoto({url: '/pages/index/product/product', params: { keyword: item.name}})"
								></chemnetCard>
							</view>
						</view>
					</u-scroll-list>
					<view class="turn-list bg-white u-m-t-30 u-m-b-30">
						<view
							v-for="(item, index) in turn_filter"
							:key="item.id"
						>
							<view class="u-p-15 u-radius-10 u-m-l-15 u-m-r-15 u-m-t-15" :style="{background: '#fff'}">
								<chemnetCard 
									@cardClick="handleGoto({url: '/pages/index/product/productDetail', params: {id: item.id } })"
									:origin="item"></chemnetCard>
							</view>
							
						</view>
					</view>
				</view>
			</view>
			 
			<view class=" u-radius-10 linear-bg u-p-40 u-p-l-80 u-p-r-80" > 
				<view class="t u-m-b-30 u-font-40">市场波动及时获取，提供最优采购备库建议</view>
				<view class="s u-m-b-40 u-font-32">多供应商比价，综合最优推荐</view>
				<view class="btn">
					<u-button type="primary" shape="circle" plain @click="handleGoto({url: '/pages/my/inquiry/inquiry'})">发布采购需求</u-button>
				</view>
			</view> 
		
		
			<view class="rxcp index-box u-radius-10 u-p-t-10 u-p-b-10">
				<view class="index-box-title u-m-b-20">
					<view class="index-box-title u-flex u-flex-items-center u-flex-between u-m-b-20 u-p-t-20 u-p-10">
						<view class="box-item u-flex u-flex-items-center">
							<i class="custom-icon-tuijiansel custom-icon text-error u-m-r-15 u-font-40"></i>
							<view class="title">严选产品</view>
						</view>
					</view>
				</view>
				<view class="index-box-content" v-if="home_list.list_pick"> 
					<template v-if="home_list.list_pick.length == 0">
						<u-empty mode="data"></u-empty>
					</template>
					<custom-waterfalls-flow
						ref="waterfallsFlowRef_pick" 
						:value="home_list.list_pick" 
						:column="column" 
						:columnSpace="1.5" 
						:seat="2" 
						:listStyle="listStyle"
						imgMask 
						@wapperClick="handleClick" 
						@imageClick="handleClick" 
						@loaded="loaded">
						<view class="item-w u-p-t-20"
							v-for="(item, index) in home_list.list_pick"
							:key="item.id"
							 slot="slot{{index}}"
						>
							<view class="card-main u-font-30">
								<view class="u-line-2 u-font-30"> 
									<text style="font-weight: bold;">{{item.name}}</text>
								</view>
								<view class="u-line-1 text-base u-m-t-10 u-m-b-10"> 
									<text>{{item.cas_no}}</text>
								</view>
								<view class="u-line-1 text-primary u-font-30"> 
									<text v-if="item.price > 0">￥ {{item.price}}</text>
									<text v-else>面议</text>
								</view>
							</view>
						</view>
					</custom-waterfalls-flow>
					
				</view>
			</view>
		</view>
		<menusPopup 
			:show="show" 
			theme="white"
			mainkey="category"
			@close="show = false"
			@confirm="menusConfirm"
		></menusPopup>
		<!-- <menusPopupProject 
			:show="showProject" 
			theme="white" 
			@close="showProject = false"
			@confirm="menusConfirmProject"
		></menusPopupProject> -->
		<!-- <xky-guideStep :step="step" :otherHeight="$u.sys().safeAreaInsets.top + 44"></xky-guideStep> -->
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
	// import { changeProject, current_project, saveApiData } from '@/utils/isProject.js'
	import { filterData, RULES } from '@/utils/chemnetUtils.js'
	// import waterfallList from '@/pages/components/waterfallList/waterfallList.vue'
	export default {
		mixins: [mixShareInfo], 
		data() {
			return {
				show: false,
				showProject: false,
				keyword: '', 
				onlineControl: {
					title: '首页'
				}, 
				swiperList: [{
					image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东',
				}, {
					image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					title: '身无彩凤双飞翼，心有灵犀一点通'
				}, {
					image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
				}],
				home_list: {},
				wfList: [],
				// wf_loadStatus: false, 
				tabsList2: [{
							name: '热销产品',
							value: 'rxcp',
						}, {
							name: '严选产品',
							value: 'yxcp',
						},
						
				],
				ad_list: [],
				current: 0,
				listStyle: {
					boxShadow: '0 0 10px rgba(0,0,0,.1)',
					padding: '15px',
					boxSizing: 'border-box'
				},
				column: 2, 
				switchBtn: 0,
				noImage: '',
			};
		},
		computed: {
			...mapState({
				menusList: state => state.user.menusList,
				typeActive: state => state.theme.typeActive,
				typeConfig: state => state.theme.typeConfig,
			}),
			...mapGetters({
				// themeConfig: 'theme/themeConfig', 
				sys: 'theme/sys'
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			}, 
			tbtj_filter() {
				if(!this.home_list?.list_recom || this.home_list.list_recom.length == 0) return []
				let list = [];  
				this.home_list.list_recom.forEach((ele, index) => {
					if((index + 1) % 3 == 1) {
						list.push({list: []})
					}
					let curListIndex = list.length 
					list[curListIndex - 1].list.push(ele)
					
					// obj.list.push(ele)
					// if((index + 1) % 3 == 0) { 
					// 	list.push( uni.$u.deepClone(obj));
					// 	obj = {list: []}
					// }
				})
				return list
			},
			turn_swiper() {
				if(!this.home_list?.list_turn || this.home_list.list_turn.length <6) return []
				return this.home_list.list_turn.slice(6)
			},
			turn_filter() {
				if(!this.home_list?.list_turn || this.home_list.list_turn.length == 0) return []
				return this.home_list.list_turn.slice(0, 6)
			}, 
		}, 
		async onLoad() {
			this.getHome()
			if(!this.menusList || this.menusList.length == 0) {
				this.getMenusList()
			}
		},
		components: {
			// menusBar,
			// navBar,
			// chemnetCard,
			// menusPopup,
			// chemnetSearch
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				getMenusList: 'user/getMenusList',
			}),
			projectEvent() {
				this.showProject = true
			}, 
			tabsClick(item) { 
				this.handleGoto({url: '/pages/index/classify/classify', params: {id: item.category}})
			},
			async getHome() {
				const res = await this.$api.chemnet_home(); 
				if(res.code == 1) {
					// this.$emit('setOnlineControl', res)
					this.switchBtn = res.switch
					this.noImage = res.noimage
					this.ad_list = res.ad.list
					this.home_list = filterData(res.list, RULES, this.noImage)
					// saveApiData(res.home)
					// this.changeWaterData()
					this.$nextTick(() => {
						// this.$refs.waterfallsFlowRef_hot.refresh();
						// this.$refs.waterfallsFlowRef_pick.refresh();
					})
					this.setOnlineControl(res) 
				}
			},  
			async menusConfirm(data) {
				console.log(data) 
				this.handleGoto({
					url: '/pages/index/product/product', 
					params: { 
						data: encodeURIComponent(`{"name":"${data.name}","category":"${data.category}"}`)
					}
				}) 
			}, 
			handleClick(data) {
				this.handleGoto({url: '/pages/index/product/productDetail', params: { id: data.id}})
			}, 
			loaded(e) {
				// console.log(e)
			},
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100vh;
	}
	.tbtj-list {
		&:last-child {
			padding-right: 10px;
		}
	}
</style>
<style lang="scss" scoped>
	.linear-bg {
		background: #0052D4;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to top, #6FB1FC, #4364F7, #0052D4);  
		background: linear-gradient(to top, #6FB1FC, #4364F7, #0052D4); 
		background-image: linear-gradient(to top, #6FB1FC, #4364F7, #0052D4); 
		min-height: 200px;
		width: 100%;
		box-sizing: border-box;
		.t {
			font-weight: bold;
			color: #fff;
		}
		.s {
			color: #c8ddfc ;
		}
		.btn {
			width: 50%;
			margin: 0 auto;
		}
	}
	.index-box {
		// background-color: #fff;
		border-radius: 15px;
		&.rxcp {
			background-color: transparent;
		}
		.index-box-title {
			color: $u-main-color;
			.box-item {}
			.title {
				font-weight: bold;
				font-size: 18px;
			}
		}
		
		.index-box-content {
			width: 100%;
			min-height: 60px;
			.tbtj-list {
				width: 100%;
				box-sizing: border-box;
				.tbtj-list-item {
					width: 100%;
					box-sizing: border-box;
				}
			}
		}
	}

	.swiper {
		position: relative;
		z-index: 10;
	}

	.h-circle {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			top: 100%;
			left: 0;
			background-color: $chemnet_color;
			width: 100vw;
			height: 80px;
			border-radius: 0 0 100% 100%;
			transform: translateY(-30px);
			z-index: 2;
			;
		}
	}

	.w {
		min-height: 100vh;
		padding-bottom: 50px;
	}

	.main {
		.banner-img {
			width: 100%;
			border-radius: 16rpx;
		}

}
 
</style>
