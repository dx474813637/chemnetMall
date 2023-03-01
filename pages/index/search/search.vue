<template>
	<view class="w" :style="{
		backgroundColor: themeConfig.pageBg,
	}">
		<view >
			<navBar 
				:title="title" 
				backBtn 
				@backEvent="handleBackEvent"
			> </navBar>
			<view class="search-w u-p-l-20 u-p-r-20 u-p-b-10 u-p-t-10" :style="{
				backgroundColor: themeConfig.navBg,
			}">
				<u-search 
					placeholder="请输入商品中文名、CAS NO." 
					v-model="keyword"
					:showAction="false"
					:bgColor="themeConfig.pageBg"
					@search="handleSearch"
					shape="square"
				></u-search>
			</view>
		</view>
		
		<view class="main">
			<view class="box u-p-20">
				<view class="box-t  u-p-20 u-flex u-flex-items-center u-flex-between" :style="{color: themeConfig.pageText}">
					<view class="">
						搜索历史
					</view>
					<view class="u-font-28 u-flex u-flex-items-center" :style="{
						color: themeConfig.search.tagText
					}" @click="list = []">
						<i class="custom-icon-shanchu custom-icon u-font-28"></i>
						<text class="u-p-l-10">清除历史</text>
					</view>
				</view>
				<view class="box-c u-flex u-flex-items-center u-flex-wrap u-p-10" v-if="list.length > 0">
					<view
						class="item"
						v-for="(item, index) in list"
						:key="item"
					>
						<u-tag 
							:text="item" 
							size="medium" 
							closable 
							:bgColor="themeConfig.search.tagBg"
							:borderColor="themeConfig.search.tagBorder"
							:closeColor="themeConfig.search.tagClose"
							:color="themeConfig.search.tagText"
							@close="handleClose" 
							@click="handleTagClick"
							:name="item"
						></u-tag>
					</view>
				</view>
				<view class="" v-else>
					<u-empty
						mode="data"
						:icon="themeConfig.empty"
						text="暂无搜索历史"
					>
					</u-empty>
				</view>
			</view>	
		</view>
		
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				keyword: '',
				subsection_current: 0,
				subsection_list: [
					{
						name: '卖盘',
						value: 's',
					},
					{
						name: '买盘',
						value: 'b',
					}
				],
				list: uni.getStorageSync('historySearch_chemnet') || [],
				pan: 's',
				title: '搜索'
			};
		},
		onLoad(options) {
			if(options.hasOwnProperty('pan')) {
				this.pan = options.pan
				if(this.pan == 's') {
					this.subsection_current = 0
				}else if(this.pan == 'b') {
					this.subsection_current = 1
				}
			}
		}, 
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
			}), 
			themeConfig() {
				return this.typeConfig.chemnet
			},
		},
		watch: {
			list: {
				deep: true,
				handler(n) {
					this.saveSearch()
				}
			},
			subsection_current(n) {
				this.pan = this.subsection_list[n].value
			}
		},
		onReady() {
			this.setNavColor() 
			
		},
		methods: {
			...mapMutations({
				setNavColor: 'theme/setNavColor'
			}),
			handleSubsectionChange(index) {
				this.subsection_current = index
			},
			handleBackEvent() {
				if(uni.$u.pages().length == 1) {
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}else {
					uni.navigateBack()
				}
				
			},
			
			handleSearch() {
				let index = this.list.indexOf(this.keyword)
				if(index != -1) this.list.splice(index, 1)
				this.list.unshift(this.keyword)
				
				
				console.log('搜索', this.keyword, this.pan)
				uni.navigateTo({
					url: `/pages/index/product/product?keyword=${this.keyword}`
				})
			},
			saveSearch() {
				uni.setStorageSync('historySearch_chemnet', this.list)
			},
			handleClose(name) {
				console.log(name)
				let index = this.list.indexOf(name)
				this.list.splice(index, 1)
				
			},
			handleTagClick(name) {
				this.keyword = name;
				this.handleSearch()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.w {
		min-height: 100vh;
		background-color: #f8f8f8;
	}
	.subsection-w {
		width: 150px;
	}
</style>
