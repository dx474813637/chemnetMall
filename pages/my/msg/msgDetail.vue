<template>
	<view class="text-white w " :class="[typeActive]" :style="{
		backgroundColor: themeConfig.pageBg,
		paddingBottom: tabHeight + 'px'
	}">
		<view :style="{
			backgroundColor: themeConfig.navBg
		}">
			<navBar 
				:title="`${title}${lunxunLoading? '（更新中...）' :''}`"
				backBtn
				@backEvent="handleBackEvent"
			></navBar>
		</view>
		
		<view class="list" :style="{
			height: `calc(100% - 44px - ${sys.statusBarHeight}px - ${sys.safeAreaInsets.bottom}px)`
		}">
			<template v-if="loading">
				<view class="u-p-20 animation" v-for="item in 3" :key="item">
					<u-skeleton loading avatar animate rows="2" :title="false" avatarShape="square" avatarSize="48"></u-skeleton>
				</view>
				
			</template>
			<template v-else>
				<scroll-view
					id="scrollview"
					scroll-y
					style="height:100%;transition: all .3s"
					enable-back-to-top
					scroll-anchoring
					:scroll-top="scrollTop"
					:scroll-into-view="target"
					refresher-enabled
					:refresher-default-style="typeActive == 'dark'? 'white': 'black'"
					:refresher-triggered="refresher"
					@refresherrefresh="scrolltoupper"
				>
					
					<view
						id="msglistview"
					>
						<view class="u-p-10">
							<u-loadmore
								:status="loadstatus"
								:loadmore-text="loadmoreText" 
							/>
						</view>
						<template v-if="list.length == 0">
							<u-empty
								mode="data"
								:icon="themeConfig.empty"
								marginTop="80"
								text='暂无消息'
								:textColor="themeConfig.pageTextSub"
							>
							</u-empty>
						</template>
						
						<view
							v-for="(item, index) in list"
							:key="item.id"
							:id="`msg${item.id}`"
							class="u-p-b-20"
						>
							<u-transition show >
								<MsgChatCard
									:msg="item"
									@reset="handleResetMsg"
									@ready="handleRenderStatus"
								></MsgChatCard>
							</u-transition>
							
							
						</view>
					</view>
					
				</scroll-view>
			</template>
		</view>
		
		<tabBar
			:theme="typeActive"
			:customStyle="{
				boxShadow: '0 0 10rpx rgba(0,0,0,.1)'
			}"
			:mainStyle="{
				minHeight: '60px',
				height: 'auto',
			}"
			>
			<view class="msg-tabbar-wrapper"
				:style="{
					color: themeConfig.tabText,
					backgroundColor: themeConfig.tabBg,
				}"
			>
				<view class="msg-tabbar u-flex u-flex-items-end u-flex-between u-p-20 ">	
					<!-- <view 
						@click="moreShow = !moreShow"
						class="plus-btn u-flex u-flex-items-center u-flex-center">
						<i class="custom-icon-roundadd custom-icon"></i>
					</view> -->
					<view class="content u-flex-1">
						<u--textarea 
							v-model="val" 
							placeholder="请输入内容..."
							autoHeight
							fixed
							disableDefaultPadding
							@focus="moreShow = false"
							:cursorSpacing="50"
							:showConfirmBar="false"
							:customStyle="{
								background: themeConfig.msg.detail.areaBg,
								color: themeConfig.msg.detail.areaColor,
								minHeight: '40px',
								border: 0,
								boxSizing: 'border-box'
							}"
							@linechange="linechange"
							maxlength="200"
							></u--textarea>
					</view>
					<view class="btn u-p-l-20">
						<u-button
							:customStyle="{
								background: themeConfig.msg.detail.btnBg,
								color: themeConfig.msg.detail.btnColor,
								height: '40px',
								width: '80px',
								border: 0
							}"
							@click="sendMsg"
						>发送</u-button>
					</view>
				</view>
				<u-transition :show="moreShow" mode="fade-up" duration="200">
					<view class="more-rows transition u-p-10 u-p-l-30 u-p-r-30" :style="{height: tabMoreRows + 'px'}">
						<u-scroll-list 
							:indicator="moreRows.length > 4"
							:indicatorColor="themeConfig.followCard.indicatorColor" 
							:indicatorActiveColor="themeConfig.followCard.indicatorActiveColor">
							<view 
								@click="handleClickMore(item)"
								class="more-rows-item u-flex u-flex-column u-flex-items-center u-flex-center"
								v-for="(item, index) in moreRows" 
								:key="index">
								<view class="icon u-p-20 u-flex u-flex-items-center u-flex-items-center u-m-b-10"
									:style="{
										background: themeConfig.msg.detail.labelBg
									}"
								>
									<i :class="['custom-icon u-font-40', item.icon]"
										:style="{
											color: themeConfig.msg.detail.labelColor
										}"
									></i>
								</view>
								<view class="label u-line-1 u-font-28">{{item.label}}</view>
							</view>
						</u-scroll-list>
					</view>
				</u-transition>
				
			</view>
			
			
		</tabBar>
		<u-popup 
			:show="showInfo" 
			@close="closeInfo" 
			:bgColor="themeConfig.navBg"
			round="8"
			mode="center"
		>
			<view class="info-list">
				<scroll-view scroll-y height="100%" class=" u-p-t-30">
					<u-cell-group :border="false">
						<u-cell :titleStyle="titleStyle" 
							:name="item.key"
							:title="item.label" 
							v-for="item in info"
							:key="item.key"
							:border="false"
							v-if="item.value"
							:isLink="item.rightIcon != '' ? true : false"
							:rightIcon="item.rightIcon"
							@click="handleClickInfoCell"
						 >
							<view 
								slot="value" 
								class="u-text-right" 
								:style="[valueStyle]"
							>{{item.value}}</view>
						</u-cell>
					</u-cell-group>
				</scroll-view>
			</view>
			
		</u-popup>
	</view>
</template>

<script>
	let query
	import {mapState, mapGetters, mapMutations} from 'vuex'
	import MsgChatCard from '@/pages/my/components/MsgChatCard/MsgChatCard.vue'
	export default {
		data() {
			return {
				login: '',
				loading: true,
				moreShow: false,
				indexList: [],
				sendingList: [],
				cpy: {},
				refresher: false,
				curP: 1,
				loadstatus: 'loadmore',
				loadmoreText: '下拉刷新历史消息',
				scrollTop: 0,
				val: '',
				tabHeight: 60,
				tabMoreRows: 80,
				target: '',
				timer: null,
				lunxunLoading: false,
				showInfo: false,
				moreRows: [
					{
						label: '对方名片',
						name: 'info',
						icon: 'custom-icon-my'
					},
					{
						label: '拨打电话',
						name: 'makecall',
						icon: 'custom-icon-dianhua'
					},
				],
				info: [
					{
						label: '账号类型',
						key: 'type',
						value: '',
					},
					{
						label: '名称',
						key: 'name',
						value: '',
					},
					{
						label: '联系人',
						key: 'contact',
						value: '',
					},
					{
						label: '手机',
						key: 'mobile',
						value: '',
						func: 'makecall',
						rightIcon: 'phone-fill',
					},
					{
						label: '电话',
						key: 'tel',
						value: '',
						func: 'makecall',
						rightIcon: 'phone-fill',
					},
					{
						label: '邮箱',
						key: 'email',
						value: '',
					},
					{
						label: '传真',
						key: 'fax',
						value: '',
					},
					{
						label: '地址',
						key: 'address',
						value: '',
					},
				],
				typeActive: 'white'
			};
		},
		watch: {
			moreShow(n) {
				if(n) this.tabHeight += this.tabMoreRows
				else this.tabHeight -= this.tabMoreRows
			},
			cpy: {
				deep: true,
				handler(n) {
					this.info.forEach(ele => {
						if(n[ele.key]) {
							if(ele.key == 'type') {
								if(n[ele.key] == 'B') {
									ele.value = '企业用户'
								}else {
									ele.value = '个人用户'
								}
							}
							else {
								ele.value = n[ele.key]
							}
						}
					})
				}
			}
		},
		components: {
			MsgChatCard
		},
		computed: {
			...mapState({ 
				typeConfig: state => state.theme.typeConfig,
				myLogin: state => state.user.login,
			}),
			...mapGetters({ 
				sys: 'theme/sys'
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
			paramsObj() {
				return {
					// p: this.curP,
					login: this.login
				}
			},
			list() {
				return this.filterData([...this.indexList, ...this.sendingList].sort((a,b) => b.sendtime - a.sendtime)).reverse()
			},
			title() {
				return this.cpy.name || this.login
			},
			titleStyle() {
				return {
					color: this.themeConfig.msg.detail.infoColor
				}
			},
			valueStyle() {
				return {
					color: this.themeConfig.msg.detail.contentColor,
					flex:' 0 0 70% ',
				}
			}
		},
		
		async onLoad(options) {
			if(options.hasOwnProperty('login')) {
				this.login = options.login
			}else {
				uni.reLaunch({
					url: '/pages/my/msg/msg',
					success() {
						uni.showToast({
							title: 'login参数有误',
							icon: 'none'
						})
					}
				})
				return
			}
			if(options.hasOwnProperty('content')) {
				this.val = options.content
			}
			
			
			// this.getInfo()
			await this.refreshList()
			this.$nextTick(() => {
				this.scrollToBottom()  
			})
			
			this.lunxun()
			this.$api.timsNews({params: {login: this.login}})
		},
		onUnload() {
			console.log('onUnload')
			clearInterval(this.timer)
			this.timer = null
		},
		mounted() {  
			query = uni.createSelectorQuery()
			query.select('#scrollview').boundingClientRect()  
			query.select('#msglistview').boundingClientRect()  
		},  
		// updated() {  
		// 	// this.scrollToBottom()  
		// },  
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			handleRenderStatus() {
				this.scrollToBottom()
			},
			scrollToBottom() {  
				let that = this  
				
				query.exec((res) => {  
					
					if(!res[0] || !res[1]) return
					if(res[1].height > res[0].height){  
						that.scrollTop = res[1].height - res[0].height  
					}  
				})  
			},  
			async refreshList() {
				this.initParamas()
				await this.getData()
			},
			async getInfo() {
				const res = await this.$api.getCompanyDetail({params: {login: this.login}});
				if(res.code == 1) {
					this.cpy = res.list
				}
			},
			initParamas() {
				this.curP = 1;
				// this.indexList = [];
				this.loadstatus = 'loadmore'
			},
			handleBackEvent() {
				uni.navigateBack()
			},
			async scrolltoupper() {
				const target = 'msg' + this.list[0]?.id
				this.refresher = true
				await this.getData('history')
				this.target = target
				this.refresher = false
			},
			async getData(type = 'new') {
				if(this.loadstatus != 'loadmore' && type != 'new') return
				this.loadstatus = 'loading'
				let func = 'timsLoginDetail'
				let paramsObj = {
					...this.paramsObj,
				}
				if (type != 'new') {
					paramsObj.offset1 = this.list[0]?.sendtime
				}
				const res = await this.$api[func]({params: paramsObj})
				
				if(res.code == 1) {
					
					if(type == 'new') this.indexList = this.filterIndexList(res.list.reverse(), this.indexList, 'new') //[...this.indexList, ...res.list.reverse()] //新消息 拼接 去重
					else this.indexList = this.filterIndexList(res.list.reverse(), this.indexList, 'history') //历史消息 
					
					// this.cpy = res.cpy
					// console.log(this.indexList)
					// if(type == 'history') {
					// 	this.loadstatus = 'nomore'
					// }else {
						this.loadstatus = 'loadmore'
					// }
				}
				this.loading = false
			},
			filterIndexList(newData, oldData, type) {
				if(type == 'new') {
					
					return [
								...oldData, 
								...newData.filter(ele => {
									return oldData.findIndex(item => item.id == ele.id) == -1
								})
							]
							
				}else {
					
					return [
								...newData.filter(ele => {
									ele.msgType = '1'
									return oldData.findIndex(item => item.id == ele.id) == -1
								}),
								...oldData, 
							]
				}
				
			},
			async getMoreData(type) {
				if(this.loadstatus != 'loadmore') return
				this.curP ++
				await this.getData(type)
			},
			linechange(e) {
				this.moreShow = false
				// console.log(e.detail)
				if(e.detail.lineCount <= 1) this.tabHeight = 60
				else this.tabHeight = e.detail.height + 18 + 20
				this.$nextTick(() => {
					this.scrollToBottom()
				})
				
			},
			filterData(data) {
				data.forEach((ele, index) => {
					if(index == data.length - 1 ) {
						ele.pre = '0'
						ele.showTime = '1'
					}else {
						ele.pre = (ele.sender == data[index + 1].sender ? '1' : '0')
						ele.showTime = Math.abs(ele.sendtime - data[index + 1].sendtime) > 5*60  ? '1' : '0'
					}
					
				})
				return data
			},
			lunxun() {
				if(this.timer) return;
				clearInterval(this.timer)
				this.timer = null
				this.timer = setInterval(async () => {
					this.lunxunLoading = true;
					let flag = await this.getData('new')
					
					// this.$nextTick(() => {
					// 	this.scrollToBottom()
					// })
					this.lunxunLoading = false;
				}, 10000)
			},
			async sendMsg() {
				console.log(this.val)
				if(!this.val.trim()) {
					uni.showToast({
						title: '不能发送空的内容',
						icon: 'none'
					})
					return
				}
				let obj = this.toSendingList(this.val)
				this.val = ""
				this.$nextTick(() => {
					this.scrollToBottom()
				})
				// await uni.$u.sleep(2000)
				// const res = {code : 0}
				const res = await this.$api.timsSend({login: this.login, body: obj.body});
				let i = this.sendingList.findIndex(ele => ele.id == obj.id)
				
				if(res.code == 1) {
					await this.getData('new')
					this.sendingList.splice(i, 1)
					
					// this.indexList.push(obj)
					// this.indexList[this.indexList.length - 1].state = 'success'
					this.$nextTick(() => {
						this.scrollToBottom()
					})
				}else {
					
					this.sendingList[i].state = 'error'
				}
			},
			toSendingList(val) {
				let id = "send_" + new Date().getTime()
				let data = {
						body: val,
						id: id,
						receiver: this.login,
						sender: this.myLogin,
						sendtime: new Date().getTime()/1000,
						state: 'loading',
						showTime: this.sendingList.length == 0? '1' : '0',
						pre: '1'
					}
				this.sendingList.push(data)
				return data
			},
			handleResetMsg(data) {
				uni.showModal({
					title: '提示',
					content: '重发该条消息？',
					success: async (result) => {
						if (result.confirm) {
							this.sendingList.splice(this.sendingList.findIndex(ele => ele.id == data.id), 1)
							let obj = this.toSendingList(data.body)
							
							const res = await this.$api.timsSend({login: this.login, body: data.body});
							let i = this.sendingList.findIndex(ele => ele.id == obj.id)
							if(res.code == 1) {
								await this.getData('new')
								// obj.state = 'success'
								this.sendingList.splice(i, 1)
								// this.indexList.push(obj)
							}else {
								this.sendingList[i].state = 'error'
							}
						} else if (result.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			handleClickMore(data) {
				if(data.name == 'info') {
					this.showInfo = true
				}
				else if(data.name == 'makecall') {
					uni.makePhoneCall({
						phoneNumber: this.cpy.mobile ||  this.cpy.tel
					});
				}
			},
			closeInfo() {
				this.showInfo = false
			},
			handleClickInfoCell(obj) {
				let item = this.info.filter(ele => ele.key == obj.name)[0]
				if(!item.hasOwnProperty('func')) return;
				if(item.func == 'makecall') {
					uni.makePhoneCall({
						phoneNumber: item.value
					})
				}
				
			}
		},
	}
</script>
<style lang="scss">
	
	
	.dark /deep/ {
		.u-skeleton {
			&__wrapper {
				&__avatar {
					background: #1e1f31!important;
					&--circle {}
					&--square {}
				}
				&__content {
					&__rows,
					&__title {
						background: #1e1f31!important;
					}
				}
			}
		}
		.u-textarea {
			&__field {
				color: #c8dbf0!important;
			}
			textarea {
				transition: all .3s!important;
			}
		}
		.u-cell {
			border-bottom: 1rpx solid #313351;
		}
	}
	.white /deep/ {
		.u-skeleton {
			&__wrapper {
				&__avatar {
					background: #eee!important;
					&--circle {}
					&--square {}
				}
				&__content {
					&__rows,
					&__title {
						background: #eee!important;
					}
				}
			}
		}
		.u-textarea {
			&__field {
				color: #333!important;
			}
			textarea {
				transition: all .3s!important;
			}
		}
		.u-cell {
			border-bottom: 1rpx solid #ccc;
		}
	}
</style>
<style lang="scss" scoped>
	.more-rows {
		// height: 120px;
		box-sizing: border-box;
		.more-rows-item {
			flex: 0 0 25%;
			.icon {
				border-radius: 5px;
			}
		}
	}
	.info-list {
		width: 80vw;
		height: 50vh;
	}
	.w {
		padding-bottom: 60px;
		height: 100vh;
		box-sizing: border-box;
	}
	.msg-tabbar {
		min-height: 60px;
		box-sizing: border-box;
		.plus-btn {
			height: 40px;
			width: 40px;
			.custom-icon {
				font-size: 26px;
			}
		}
		.item-btn {
			height: 100%;
			&.share-btn {
				
			}
		}
	}
</style>
