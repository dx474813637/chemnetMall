<template>
	<view class="u-p-20" >
		<u-loading-page :loading="!list.id"></u-loading-page>
		<template v-if="list.id">
			<view class="addr-content-box u-m-b-30" >
				<view class="addr-content u-p-30">
					<view class="addr-row u-m-b-10 u-flex u-flex-items-start u-flex-between">
						<view class="item text-light item-label">交收方式</view>
						<view class="item u-text-right">{{list.transport | settleMode}}</view>
					</view>
					<view class="addr-row u-m-b-10 u-flex u-flex-items-start u-flex-between" v-if="list.delivery_place1">
						<view class="item text-light item-label">交收区域</view>
						<view class="item u-text-right" v-if="list.Regionals">{{list.Regionals.map(ele => ele.Particular.name).join('/')}}</view>
					</view>
					<view class="addr-row u-m-b-10 u-flex u-flex-items-start u-flex-between" v-if="list.address">
						<view class="item text-light item-label">交收地址</view>
						<view class="item u-text-right" style="word-break: break-all;">{{list.address}}</view>
					</view>
					<view class="addr-row u-m-b-10 u-flex u-flex-items-start u-flex-between" >
						<view class="item text-light item-label">联系人</view>
						<view class="item u-text-right" style="word-break: break-all;">{{list.contact}}</view>
					</view>
					<view class="addr-row u-m-b-10 u-flex u-flex-items-start u-flex-between" >
						<view class="item text-light item-label">联系电话</view>
						<view class="item u-text-right" style="word-break: break-all;">{{list.tel}}</view>
					</view>
				</view>
				
			</view>
			<view class="main u-p-30">
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">订单编号</view>
					<view class="item u-text-right">{{list.id}}</view>
				</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" >
					<view class="item text-light item-label">来源询盘</view>
					<view class="item text-primary" @click="handleGoto({url: '/pages/my/inquiry/inquiry_detail', params: {id: list.inquiry_id }})">查看详情</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" >
					<view class="item text-light item-label">商品名称</view>
					<view class="item text-primary" @click="handleGoto({url: '/pages/index/product/productDetail', params: {id: list.Info.product_id}})">{{list.Info.name}}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" >
					<view class="item text-light item-label">CAS号</view>
					<view class="item u-text-right u-line-3">
						<rich-text :nodes="list.Info.cas_no"></rich-text>
					</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">卖方</view>
					<view class="item u-text-right" v-if="list.Sinfo">{{list.Sinfo.name}}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">成交量</view>
					<view class="item u-text-right">{{list.Info.quantity}} × {{list.Info.pack}}{{list.Info.unit}}</view>
				</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.price > 0">
					<view class="item text-light item-label">单价</view>
					<view class="item u-text-right">{{list.price}} 元/{{list.Info.pack}}{{list.Info.unit}}</view>
				</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.amount > 0">
					<view class="item text-light item-label">订单总额</view>
					<view class="item u-text-right">{{list.amount}} 元</view>
				</view>
				<!-- <view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">订单类型</view>
					<view class="item u-text-right">{{list.order_type | orderType2str}}</view>
				</view> -->
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">下单日期</view>
					<view class="item u-text-right">{{list.cdate}}</view>
				</view> 
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" >
					<view class="item text-light item-label">是否在线签约</view>
					<view class="item u-text-right">{{list.is_line == '1' ? '是' : '否'}}</view>
				</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" >
					<view class="item text-light item-label">支付方式</view>
					<view class="item u-text-right">{{list.payment | paymode2str}}</view>
				</view>
				<!-- <view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.pay_state && list.order_type == '1'">
					<view class="item text-light item-label">支付状态</view>
					<view class="item u-text-right" v-if="list.pay_mode"> 
						<template v-if="list.pay_mode.includes('FUNDPAY')">{{list.pay_state | payFundState2Str}}</template>
						<template v-else-if="list.pay_mode.includes('BILLPAY')">{{list.pay_state | payBillState2Str}}</template>
					</view>
				</view> -->
				<!-- <view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">交收状态</view>
					<view class="item u-text-right">{{list.settle_state == '1'? '已交收' :'未交收'}}</view>
				</view> -->
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between">
					<view class="item text-light item-label">订单状态</view>
					<view class="item u-text-right">{{list.state | orderState2Str}}</view>
				</view>
				<view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.remark">
					<view class="item text-light item-label">备注</view>
					<view class="item u-text-right" style="word-break: break-all;">
						<rich-text :nodes="list.remark"></rich-text>
					</view>
				</view>
				<!-- <view class="main-row u-m-b-30 u-flex u-flex-items-start u-flex-between" v-if="list.remark_audit">
					<view class="item text-light item-label">审核备注</view>
					<view class="item u-text-right" style="word-break: break-all;">
						<rich-text :nodes="list.remark_audit"></rich-text>
					</view>
				</view> -->
			</view>
			<view class="main u-m-t-30">
				<view class="btn-wrap u-flex u-flex-items-center u-flex-wrap">
					<view class="item u-p-12" 
							v-if="btnList.button1"
						> <!-- 完成订单 -->
						<u-button type="primary" @click="order_define">{{btnList.button1_title}}</u-button>
					</view>
					<view class="item u-p-12"
							v-if="btnList.button2"
						> <!-- 拒绝订单 -->
						<u-button type="primary" @click="order_refuse">{{btnList.button2_title}}</u-button>
					</view> 
				</view>
			</view>
			<u-popup 
				:show="show" 
				mode="bottom"  
				@close="show = false"  
				round="25"
				bgColor="#fff"
				>
				<view class="wrapper" :style="{
					backgroundColor: themeConfig.pageBg,
					color: themeConfig.baseText,
				}">
					<view class="header u-p-18"  :style="{
						backgroundColor: themeConfig.navBg,
					}">
						<view class="title-bar u-p-20 u-flex u-flex-between u-flex-items-center u-font-30">
							<view class="item u-flex-1">
								<text class="u-info" @click="show = false">取消</text>
							</view>
							<view class="item u-flex-1 u-text-center">
								<text class="u-font-34">
									<template v-if="formActive.mode == 'send'">{{fahuo}}表单</template>
									<template v-else-if="formActive.mode == 'audit'">审核表单</template>
									<template v-else-if="formActive.mode == 'create_pay'">支付确认</template>
									<template v-else-if="formActive.mode == 'confirm'">收货确认</template>
								</text>
							</view>
							<view class="item u-flex-1 u-text-right">
							
							</view>
						</view>
					</view>
					<view class="main" :style="{
						backgroundColor: themeConfig.pageBg,
					}">
						<u-list height="100%">
							<view class="form-content u-p-20"> 
								<template v-if="formActive.mode == 'audit'">
									<u--form
										labelPosition="left" 
										labelWidth="80"
										v-if="list.order_type == '1'"
										>
										<u-form-item
											label="交付方式" 
											>
											<view>{{list.settle_type | settleType2str}}</view>
										</u-form-item>
										<u-form-item
											label="支付工具" 
											>
											<view>{{list.pay_mode | paymode2str}}</view>
										</u-form-item>
									</u--form>
									<u--form
										labelPosition="left"
										:model="form_audit"
										ref="form_audit"
										labelWidth="80"
										>
										<!-- <u-form-item
											label="交付方式" 
											v-if="ordertype == 'B'"
										>
											<view>{{list.settle_type | settleType2str}}</view>
										</u-form-item>
										<u-form-item
											label="支付工具" 
											v-if="ordertype == 'B'"
										>
											<u-radio-group
											    v-model="zfgjValue"
											    placement="row"
											  >
											    <u-radio
											      :customStyle="{marginRight: '8px'}"
											      v-for="(item, index) in zfgj"
											      :key="index"
											      :name="item.value"
											      :label="item.name"
												  :disabled="item.disabled"
											    >
											    </u-radio>
											  </u-radio-group>
										</u-form-item> -->
										<u-form-item
											label="审核意见" 
										>
											<u-radio-group
											    v-model="form_audit.audit"
											    placement="row"
											  >
											    <u-radio
											      :customStyle="{marginRight: '8px'}"
											      v-for="(item, index) in shyj"
											      :key="index"
											      :name="item.value"
											      :label="item.name"
											    >
											    </u-radio>
											  </u-radio-group>
										</u-form-item>
										<u-form-item
											label="议价总额" 
										>
											<u--input
												:value="list.total_price2" 
												disabled 
											></u--input>
										</u-form-item>
										<u-form-item
											label="收款票据" 
											 required
											v-if="list.pay_mode.includes('BILLPAY')"
										>
											<view class="" @click="show_billacc = true">
												<u--input
													:value="form_audit.pyeeInfo" 
													placeholder="选择收款票据账户"
													suffixIcon="arrow-down"
													suffixIconStyle="color: #909399"
													readonly
													:customStyle="{background: '#fff'}"
												></u--input>
											</view>
											
										</u-form-item>
										<u-form-item
											label="审核备注" 
										>
											<u--textarea
												v-model="form_audit.remark_audit" 
												placeholder="审核备注" 
												height="90"
												maxlength="-1"
											></u--textarea>
										</u-form-item>
										 
									</u--form>
								</template>
								
								<template v-if="formActive.mode == 'send'">
									<u--form
										labelPosition="left"
										:model="form_send"
										ref="form_send"
										labelWidth="80"
										>
										<u-form-item
											:label="`${fahuo}备注`" 
										>
											<u--textarea
												v-model="form_send.remark_send" 
												:placeholder="`${fahuo}备注`" 
												height="90"
												maxlength="-1"
											></u--textarea>
										</u-form-item>
									</u--form>
								</template>
								
								<template v-if="formActive.mode == 'create_pay' || formActive.mode == 'confirm' ">
									<u--form
										labelPosition="left" 
										labelWidth="80"
										>
											<u-form-item
												label="交付方式" 
												>
												<view>{{list.settle_type | settleType2str}}</view>
											</u-form-item>
											<u-form-item
												label="支付工具" 
												>
												<view>{{list.pay_mode | paymode2str}}</view>
											</u-form-item>
											<u-form-item
												label="支付订单" 
												>
												<view class="u-flex u-flex-items-center"> 
													<view class="item text-primary"
														@click="handleGoto({ url: '/pages/my/money/bill_detail', params: {id: list.pay_id, paytype: ordertype} })" >
														查看当前支付订单详情
													</view>
												</view>
											</u-form-item>
											<u-form-item
												label="支付状态" 
												>
												<view v-if="!formActive.isBill">{{list.pay_state | payFundState2Str}}</view>
												<view v-else>{{list.pay_state | payBillState2Str}}</view>
											</u-form-item>
										</u--form>
									
								</template>
								
								<template v-if="formActive.mode == 'create_pay'">
									<u--form
										labelPosition="left"
										:model="form_pay"
										ref="form_pay"
										labelWidth="80"
										v-if="formActive.isBill == false"
										> 
										<template v-if="payOrderLoading">
											<view class="u-p-20">
												<u-loading-icon mode="circle" ></u-loading-icon>
											</view> 
										</template>
										<template v-else-if="paylist.hasOwnProperty('Sino_fund_order') && paylist.Sino_fund_order.paymode == '2'">
											<u-form-item
												label="支付方式" 
												>
												<view class="text-error">
													两站式-请财务登录电脑端sinopay平台完成支付
												</view>
											</u-form-item>
										</template>
										<template v-else>
											<u-form-item
												label="支付方式" 
												>
												<u-radio-group
													v-model="form_pay.paymode"
													placement="row"
													>
													<u-radio
													  :customStyle="{marginRight: '8px'}"
													  v-for="(item, index) in paymode_radios"
													  :key="index"
													  :name="item.value"
													  :label="item.name"
													  :disabled="item.disabled"
													>
													</u-radio>
												  </u-radio-group>
											</u-form-item>
											<u-form-item
												label="支付密码" 
												v-if="form_pay.paymode == '1'"
												required
											>
												<u--input
													type="password"
													v-model="form_pay.paypwd"  
													:customStyle="{background: '#fff'}"
													placeholder="支付密码" 
												></u--input>
											</u-form-item> 
										</template>
										
										
									</u--form>
								</template>
								
								<template v-if="formActive.mode == 'confirm'">
									<u--form
										labelPosition="left"
										:model="form_confirm"
										ref="form_confirm"
										labelWidth="80"
										v-if="formActive.isGRT && paylist.Sino_fund_order.paymode == '1'"
										>
										
										<u-form-item
											label="支付密码" 
											type="password"
											required
										>
											<u--input
												type="password"
												v-model="form_confirm.paypwd"  
												:customStyle="{background: '#fff'}"
												placeholder="支付密码" 
											></u--input>
										</u-form-item>
									</u--form>
									<view v-if="formActive.isGRT && paylist.Sino_fund_order.paymode == '2'" class="text-error">
										请财务登录sinopay平台完成确认付款。
									</view>
								</template>
							</view>
						</u-list>
					</view>
					<view class="confirm-rows u-p-20" :style="{
							backgroundColor: themeConfig.navBg,
						}"
						v-if="!paylist.hasOwnProperty('Sino_fund_order') || paylist.Sino_fund_order.paymode == '0' || paylist.Sino_fund_order.paymode == '1' "
						>
						<u-button :customStyle="{backgroundColor: themeConfig.badgeBg, color: '#fff', border: 'none'}" shape="circle" 
						@click="handleConfirm">确认并提交</u-button>
					</view>
				</view>
			</u-popup>
				
			<menusPopupBillAcc
				:show="show_billacc" 
				theme="white"  
				:params="{
					source_id: id,
					source: ordertype == 'S' ? 'BUY' : 'SELL'
				}"
				@close="show_billacc = false"
				@confirm="menusConfirm"
			></menusPopupBillAcc>
			<u-toast ref="uToast"></u-toast>
		</template>
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default { 
		data() {
			return {
				id: '',
				ordertype: '',
				list: {},
				paylist: {},
				payOrderLoading: false,
				show_billacc: false,
				show: false,
				formActive: {}, 
				form_audit: {
					audit: '1',
					pyeeInfo: '',
					remark_audit: '',
				},
				form_send: {
					remark_send: '',
				},
				form_pay: {
					paymode: '1',
					paypwd: '',
				},
				form_confirm: {
					paypwd: '',
				},
				btnList: {},
				shyj: [
					{
						name: '退回订单',
						value: '0',
						disabled: false,
					},
					{
						name: '同意订立',
						value: '1',
						disabled: false,
					},
					{
						name: '废止订单',
						value: '2',
						disabled: false,
					},
				],
				zfgjValue: 'xianjin',
				zfgj: [
					{
						name: '现金',
						value: 'xianjin',
						disabled: false,
					},
					{
						name: '票据',
						value: 'piaoju',
						disabled: true,
					},
				],
				paymode_radios: [
					{
						name: '一站式',
						value: '1',
						disabled: false,
					},
					{
						name: '两站式',
						value: '2',
						disabled: false,
					},
				],
				fahuo: '发货'
			};
		},
		onLoad(options) {
			if(options.hasOwnProperty('id')) {
				this.id = options.id
			} else {
				uni.showToast({
					title: 'id参数有误',
					icon: 'none'
				})
				return
			}
			if(options.hasOwnProperty('ordertype')) {
				this.ordertype = options.ordertype
			}  
			uni.showLoading()
			this.getData()
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
			}),
			themeConfig() {
				return this.typeConfig.white
			},
		},
		filters: {
			source2pan: v => {
				console.log(v)
				if(v == 'BUY') return 'b'
				return 's'
			},
			source2str: v => {
				if(v == 'BUY') return '买盘'
				return '卖盘'
			}
		},
		methods: { 
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			showToast(params) {
				this.$refs.uToast.show({
					position: 'bottom',
					...params, 
				})
			},
			async handleShowPopup(data) {
				this.formActive = data; 
				if(data.mode == 'create_pay') {
					//发起支付 如未发起过则先执行发起接口（仅1次），再弹窗；
					if(this.list.state == '6') {
						//state=6 为待支付
						const res = await this.order_pay()
						if(!res) return
					}else {
						this.get_pay_order()
					}
					
				}
				if(data.mode == 'confirm') {
					this.get_pay_order()
				} 
				if(data.mode == 'audit') {
					if(this.list.pay_mode.includes('BILLPAY')) {
						this.form_audit.pyeeInfo = this.list.payeeAccNm
					}
				}  
				this.show = true
			},
			menusConfirm(data) {
				console.log(data)
				this.form_audit.pyeeInfo = data.pyeeInfo
			}, 
			async getData() {
				const res = await this.$api.order_detail({
					params: {
						// ordertype: this.ordertype,
						id: this.id,
					}
				})
				if(res.code == 1) {
					this.list = res.list[0]
					this.btnList = res.button
					// this.fahuo = res.fahuo
					// if(this.list.settle_type == 'GRT') {
					// 	this.zfgj[1].disabled = false
					// }
				}
			},
			// async unsubmit_order() {
			// 	//撤回已发送的订单
			// 	uni.showLoading()
			// 	const res = await this.$api.unsubmit_order({
			// 		params: {
			// 			ordertype: this.ordertype,
			// 			id: this.id,
			// 		}
			// 	})
			// 	if(res.code == 1) {
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 	}
			// },
			async order_refuse() {
				uni.showLoading({
					title: '操作中...'
				})
				const res = await this.$api.refuse_order({
					params: { 
						id: this.id,
					}
				})
				if(res.code == 1) {
					this.showToast({
						type: 'success',
						message: res.msg, 
					})
					uni.showLoading({
						title: '获取最新数据中'
					})
					await this.getData()
				}
			},
			async order_define() {
				uni.showLoading({
					title: '操作中...'
				})
				const res = await this.$api.define_order({
					params: { 
						id: this.id,
					}
				})
				if(res.code == 1) {
					this.showToast({
						type: 'success',
						message: res.msg, 
					})
					uni.showLoading({
						title: '获取最新数据中'
					})
					await this.getData()
				}
			},
			// async order_send() {
			// 	uni.showLoading({
			// 		title: '发货中...'
			// 	})
			// 	const res = await this.$api.order_send({
			// 		params: {
			// 			remark_send: this.form_send.remark_send,
			// 			id: this.id,
			// 		}
			// 	})
			// 	if(res.code == 1) {
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 	}else {
			// 		throw new Error(res.msg)
			// 	}
			// },
			// async order_submit() {
			// 	uni.showLoading({
			// 		title: '发送对方议价...'
			// 	})
			// 	const res = await this.$api.order_submit({
			// 		params: {
			// 			ordertype: this.ordertype,
			// 			id: this.id,
			// 		}
			// 	})
			// 	if(res.code == 1) {
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 	}
			// },
			// async get_pay_order() {
			// 	this.payOrderLoading = true
			// 	const res = await this.$api.sino_fund_order_detail_order({
			// 		params: { 
			// 			pay_id: this.list.pay_id,
			// 			paytype: 'B'
			// 		}
			// 	})
			// 	if(res.code == 1) {  
			// 		this.paylist = res.list
			// 	}
			// 	this.payOrderLoading = false
			// },
			// async order_pay() {
			// 	uni.showLoading({
			// 		title: '发起支付中...'
			// 	})
			// 	const res = await this.$api.order_pay({
			// 		params: { 
			// 			id: this.id,
			// 		}
			// 	})
			// 	if(res.code == 1) { 
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 		return true
			// 	}else {
			// 		this.showToast({
			// 			type: 'error',
			// 			message: res.msg, 
			// 		})
			// 		return false
			// 	}
			// },
			// async order_paying() {
				
			// 	let func = 'sino_fund_order_pay';
			// 	let params = {
			// 		...this.form_pay,
			// 		pay_id: this.list.pay_id
			// 	};
			// 	if(this.formActive.isBill) {
			// 		func = 'sino_bill_order_pay';
			// 		params = {
			// 			pay_id: this.list.pay_id
			// 		}
			// 	}
			// 	if(params.paymode != '2' && params.hasOwnProperty('paypwd') && !params.paypwd ) {
			// 		uni.showToast({
			// 			title: '请输入支付密码',
			// 			icon: 'none'
			// 		})
			// 		throw new Error('请输入支付密码')
			// 	}
			// 	uni.showLoading({
			// 		title: '操作中...'
			// 	}) 
			// 	const res = await this.$api[func]({ params })
			// 	if(res.code == 1) { 
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '刷新订单数据中'
			// 		})
			// 		await this.getData()
			// 		uni.showLoading({
			// 			title: '刷新支付数据中'
			// 		})
			// 		await this.get_pay_order()
			// 	} 
			// 	else { 
			// 		if(res.errcode == '6012') {
			// 			uni.showModal({
			// 				title: '提示',
			// 				content: res.msg,
			// 				success: async (r) => {
			// 					if (r.confirm) {
			// 						this.handleGoto({
			// 							url: '/pages/my/money/sino_paypw_forget'
			// 						})
			// 					} else if (r.cancel) {
			// 						console.log('用户点击取消');
			// 					}
			// 				}
			// 			});
			// 		}
			// 		throw new Error(res.msg)
			// 	}
			// },
			// async order_audit() {
			// 	uni.showLoading({
			// 		title: '提交审核中...'
			// 	}) 
			// 	if(this.list.pay_mode.includes('BILLPAY') && !this.form_audit.pyeeInfo ) {
			// 		uni.showToast({
			// 			title: '票据账户不能为空',
			// 			icon: 'none'
			// 		})
			// 		throw new Error('票据账户不能为空')
			// 	}
			// 	const res = await this.$api.order_audit({
			// 		params: { 
			// 			...this.form_audit,
			// 			id: this.id,
			// 			ordertype: this.ordertype,
			// 		}
			// 	})
			// 	if(res.code == 1) { 
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 	}else {
			// 		throw new Error(res.msg)
			// 	}
			// },
			// async confirm_shouhuo() {
			// 	let func = 'sino_fund_order_order_confirm'
			// 	let params = {
			// 		pay_id: this.list.pay_id
			// 	} 
			// 	console.log(this.formActive)
			// 	if(!this.formActive.isBill && this.formActive.isGRT) { 
			// 		func = 'sino_fund_order_confirm';
			// 		params = {
			// 			...params,
			// 			paypwd: this.form_confirm.paypwd
			// 		}
			// 		if(this.paylist.Sino_fund_order.paymode == '2') {
			// 			func = 'sino_fund_order_confirm_apply';
			// 			params = {
			// 				...params, 
			// 			} 
			// 		}
			// 	}
			// 	else if(this.formActive.isBill) {
			// 		func = 'sino_bill_order_order_confirm';
			// 	}else if(this.formActive.isGRT) {
			// 		func = 'sino_bill_order_confirm';
			// 		params = {
			// 			...params,
			// 			paypwd: this.form_confirm.paypwd
			// 		}
			// 	}
			// 	console.log(func)
			// 	if(params.hasOwnProperty('paypwd') && !params.paypwd ) {
			// 		uni.showToast({
			// 			title: '请输入支付密码',
			// 			icon: 'none'
			// 		})
			// 		throw new Error('请输入支付密码')
			// 	}
			// 	uni.showLoading({
			// 		title: '提交确认收货...'
			// 	})
			// 	const res = await this.$api[func]({ params })
			// 	if(res.code == 1) { 
			// 		this.showToast({
			// 			type: 'success',
			// 			message: res.msg, 
			// 		})
			// 		uni.showLoading({
			// 			title: '获取最新数据中'
			// 		})
			// 		await this.getData()
			// 	}else {
			// 		throw new Error(res.msg)
			// 	}
			// },
			// async handleConfirm() { 
			// 	if(this.formActive.mode == 'audit') {
			// 		await this.order_audit()
			// 	}
			// 	else if(this.formActive.mode == 'send') {
			// 		await this.order_send()
			// 	}
			// 	else if(this.formActive.mode == 'create_pay') {
			// 		//提交支付密码支付表单
			// 		await this.order_paying() 
					
			// 	}
			// 	else if(this.formActive.mode == 'confirm') {
			// 		await this.confirm_shouhuo()
			// 	}
			// 	this.show = false
			// },
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-bg2;
	}
</style>
<style lang="scss" scoped>
	.addr-content-box {
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
		// border: 1rpx solid #f8f8f8;
		border: 3px solid transparent;
		background: 
			linear-gradient(white, white) padding-box,
			repeating-linear-gradient(
				-45deg, 
				red 0, 
				red 12.5%, 
				transparent 0, 
				transparent 25%, 
				#58a 0, 
				#58a 37.5%, 
				transparent 0, 
				transparent 50%
			) 0/2em 2em;
		// &:after {
		// 	content: "";
		// 	position: absolute;
		// 	bottom: 0;
		// 	left: 0;
		// 	height: 6rpx;
		// 	width: 100%;
		// 	background-image: url("../static/img/addr-bottom.jpg");
		// 	background-repeat: repeat-x;
		// 	background-size: auto 100%;
		// 	background-position: 0 0;
		// }
		.addr-content {
			
		}
	}
	.item {
		color: #444;
	}
	.item-label {
		flex: 0 0 100px;
	}
	.main {
		background-color: #fff;
	}
	.btn-wrap {
		.item {
			flex: 0 0 50%;
			box-sizing: border-box;
		}
	}
	.wrapper {
		width: 100%;
		border-radius: 30rpx 30rpx 0 0 ;
		overflow: hidden;
		.header {
		}
		.main {
			background-color: #f8f8f8;
			height: 50vh;
			width: 100%;
			box-sizing: border-box;
			.item-card {
				width: 100%;
				box-sizing: border-box;
				.card-title {
					color: #666;
				}
			}
			.card-content {
				// background-color: #fff;
				border-radius: 10rpx;
				width: 100%;
				box-sizing: border-box;
				
			}
			.card-label {
				flex: 0 0 30%;
				margin-right: 4%;
				height: 30px;
				line-height: 30px;
				transition: all .3s;
				font-size: 14px;
				text-align: center;
				border-radius: 8rpx;
				position: relative;
				border: 1rpx solid #eee;
				&.rows {
					flex: 0 0 100%;
					margin-right: 0;
					text-align: left;
				}
				&.normal_white {
					border-color: #eee;
					color: #666;
				}
				&.normal_dark {
					border-color: #3a3352;
					color: #c8cfff;
				}
				&.active_white {
					border-color: #98c9ff;
					color: #007aff;
					background-color: #e6f2ff;
				}
				&.disabled_white {
					border-color: #c373ff !important;
					color: #7d3df7 !important;
					background-color: #ead9f7 !important;
				}
				&.active_dark {
					border-color: #025688;
					color: #00ffff;
					// background-color: #e6f2ff;
				}
				&.disabled_dark {
					border-color: #503f17 !important;
					color: #f7823d !important;
					// background-color: #ead9f7 !important;
				}
				&:nth-of-type(3n) {
					margin-right: 0;
				}
			}
		}
		.bottom {
			
		}
	}
</style>
