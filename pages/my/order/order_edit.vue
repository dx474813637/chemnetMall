<template>
	<view class="u-p-20 u-p-l-40 u-p-r-40">
		<view :style="{
			opacity: pageLoading ? 0 : 1,
			position: 'relative',
			zIndex: 0,
		}">
			<u--form
				labelPosition="left"
				:model="form"
				ref="form"
				labelWidth="80"
				>
					<u-form-item
						:label="ordertype == 'S' ? '买方' : '卖方'"
					>
						<view class="">{{company}}</view>
					</u-form-item>
					<u-form-item
						label="商品" 
					>
						<view class="">
							{{type == 'edit' ? order.source_name : panRes.list.name}}
						</view>
					</u-form-item>
					<u-form-item
						label="数量" 
					>
						<view class=""> 
							{{panRes.list.amount}}{{panRes.list.unit}}
						</view>
					</u-form-item>
					<u-form-item
						label="可售量" 
						v-if="ordertype=='B'"
					>
						<view class="">
							{{left_amount}}{{panRes.list.unit}}
						</view>
					</u-form-item>
					<u-form-item
						:label="ordertype == 'S' ? '供应量' : '采购量'"
						prop="amount"
						ref="amount"
						required
					>
						<view class="u-flex u-flex-items-center">
							<view class="u-flex-1">
								<u--input
									v-model="form.amount"
									clearable
									type="digit"
								></u--input>
							</view>
							<view class="u-p-l-10">{{type == 'edit' ? order.Source.unit : panRes.list.unit}}</view>
						</view>
						
					</u-form-item>
					<u-form-item
						label="单价"
						prop="price"
						ref="price"
						required
					>
						<view class="u-flex u-flex-items-center">
							<view class="u-flex-1">
								<u--input 
									v-model="form.price"
									clearable
									:disabled="panRes.list.trade_mode == '2'"
									type="digit"
									@focus="tar = 'price'"
								></u--input> 
							</view>
							<view class="u-p-l-10">元/{{type == 'edit' ? order.Source.unit : panRes.list.unit}}</view>
						</view>
						
					</u-form-item>
					<u-form-item
						label="商品总额"
						prop="total_price"
						ref="total_price"
						required
					>
						<view class="u-flex u-flex-items-center">
							<view class="u-flex-1">
								<u--input
									v-model="form.total_price"
									clearable
									:disabled="panRes.list.trade_mode == '2'"
									type="digit"
									@focus="tar = 'total_price'"
								></u--input>
							</view>
							<view class="u-p-l-10">元</view>
						</view>
						
					</u-form-item>
					<u-form-item
						label="交收方式"
						prop="settle_mode"
						ref="settle_mode"
					>
						<u-radio-group
							v-model="form.settle_mode"
							placement="row"
						  >
							<u-radio
							  :customStyle="{marginRight: '8px'}"
							  v-for="(item, index) in settle_mode_radios"
							  :key="index"
							  :name="item.value"
							  :label="item.name"
							  :disabled="item.disabled"
							>
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item
						label="交付方式"
						prop="pay_option1"
						ref="pay_option1"
						required
						v-if="panRes.list.order_type == '1'"
					>
						<u-radio-group
							v-model="form.pay_option1"
							placement="row"
						  >
							<u-radio
							  :customStyle="{marginRight: '8px'}"
							  v-for="(item, index) in pay_option1_radios"
							  :key="index"
							  :name="item.value"
							  :label="item.name"
							  :disabled="item.disabled"
							>
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item
						label="支付工具"
						prop="pay_option2"
						ref="pay_option2"
						v-if="panRes.list.order_type == '1'"
						required
					>
						<u-radio-group
							v-model="form.pay_option2"
							placement="row"
						  >
							<u-radio
							  :customStyle="{marginRight: '8px'}"
							  v-for="(item, index) in pay_option2_radios"
							  :key="index"
							  :name="item.value"
							  :label="item.name"
							  :disabled="item.disabled"
							>
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item
						label="卖方票据" 
						prop="pyeeInfo"
						ref="pyeeInfo"
						required
						v-if="form.pay_option2 == 'BILLPAY'"
					>
						<view class="" @click="show_billacc = true">
							<u--input
								:value="form.pyeeInfo" 
								placeholder="选择卖方收款票据账户"
								suffixIcon="arrow-down"
								suffixIconStyle="color: #909399"
								readyonly
								:customStyle="{background: '#fff'}"
							></u--input>
						</view>
						
					</u-form-item>
					
					<u-form-item
						:label="form.settle_mode == 'S' ? '收货区域' : '提货区域' "
						prop="delivery_place"
						ref="delivery_place"
						:required="!qiehuan"
					>
						<view style="width: 255px;">
							<uni-data-picker
								v-if="!qiehuan"
								placeholder="请选择所在地区" 
								popup-title="请选择所在地区" 
								:localdata="addressArea" 
								v-model="form.delivery_place"
							></uni-data-picker>
							<view v-else>
								{{panRes.list.delivery_place}}
								<!-- <template v-if="type == 'add'">
									{{panRes.list.delivery_place}}
								</template>
								<template v-else-if="order.Regionals">
									{{order.Regionals.map(ele => ele.Particular.name).join('/')}}
									{{panRes.list.delivery_place1}}
								</template> -->
								
							</view>
						</view>
						
					</u-form-item>
					<u-form-item
						:label="form.settle_mode == 'S' ? '收货地址' : '提货地址' "
						prop="settle_address"
						ref="settle_address"
						:required="!qiehuan"
					>
						<view>
							<u--input
								v-if="!qiehuan"
								v-model="form.settle_address"
								placeholder="填写地址" 
								clearable
							></u--input>
							<view v-else>
								<rich-text :nodes="panRes.list.delivery_address"></rich-text> 
								<!-- <template v-if="type == 'add'">
									<rich-text :nodes="panRes.list.delivery_address"></rich-text> 
								</template>
								<template v-else>
									<rich-text :nodes="order.settle_address"></rich-text>  
								</template> -->
							</view>
						</view>
					</u-form-item>
					<u-form-item
						label="商品详情"
						prop="intro"
						ref="intro"
					>
						<u--textarea
							v-model="form.intro" 
							placeholder="商品详情" 
							height="90"
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="备注"
						prop="remark"
						ref="remark"
					>
						<u--textarea
							v-model="form.remark" 
							placeholder="备注" 
							height="90"
						></u--textarea>
					</u-form-item>
				
			</u--form>
			<view class="u-p-t-20 u-m-b-40">
				<u-button type="primary" @click="submit">提 交</u-button>
			</view> 
		</view>
		<u-loading-page 
			:loading="pageLoading"
			loading-text="loading..."
			loadingMode="semicircle" 
		></u-loading-page>
		
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
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				type: 'add',
				ordertype: '',
				id: '',
				panRes: {
					list: {}
				},
				left_amount: null,
				order: {},
				tar: '',
				pageLoading: true,
				show_billacc: false,
				form: { 
					source: '',
					source_id: '',
					amount: '',
					price: '',
					total_price: '',
					pay_option1: '',
					pay_option2: '',
					pyeeInfo: '',
					settle_mode: '',
					delivery_place: '',
					settle_address: '',
					intro: '',
					remark: '', 
				},
				settle_mode_radios: [
					{
						name: '买家自提',
						value: 'B'
					},
					{
						name: '卖家送货',
						value: 'S'
					},
				],
				pay_option1_radios: [
					{
						name: '款到发货',
						value: 'D_P',
						disabled: false,
					},
					{
						name: '担保支付',
						value: 'GRT',
						disabled: false,
					},
					{
						name: '货到付款',
						value: 'COD',
						disabled: false,
					},
				],
				pay_option2_radios: [
					{
						name: '现金',
						value: 'FUNDPAY',
						disabled: false,
					},
					{
						name: '票据-小程序端暂不支持',
						value: 'BILLPAY',
						disabled: true,
					},
				],
			}
		},
		computed: {
			...mapState({
				addressArea: state => state.user.addressArea,
				sinoBillAccount: state => state.sinopay.sinoBillAccount,
				sinoBillAccountList: state => state.sinopay.sinoBillAccountList,
			}),
			company() {
				let company = ''
				if(this.type == 'edit') {
					if(this.ordertype == 'S') {
						company = this.order.b_company
					}else {
						company = this.order.s_company
					}
				}else {
					company = this.panRes?.login_company?.name
				} 
				return company 
			},
			qiehuan() {
				let qiehuan
				if(this.ordertype == 'S') {
					if(this.form.settle_mode == 'S') {
						qiehuan = true
					}else {
						qiehuan = false
					}
				}else {
					if(this.form.settle_mode == 'S') {
						qiehuan = false
					}else {
						qiehuan = true
					}
				}
				return qiehuan
			},
			rules() {
				let base = {
					amount: {
						required: true, 
						validator: (rule, value, callback) => {
							return uni.$u.test.number(value)
						},
						message: '请填写正确的数值',
						trigger: ['blur', 'change']
					},
					total_price: {
						required: true,
						validator: (rule, value, callback) => {
							return uni.$u.test.number(value)
						},
						message: '请填写正确的数值',
						trigger: ['blur', 'change']
					},
					price: {
						required: true,
						validator: (rule, value, callback) => {
							return uni.$u.test.number(value)
						},
						message: '请填写正确的数值',
						trigger: ['blur', 'change']
					},
				}	 
				if(this.panRes.list?.amount ) {
					base.amount.validator = (rule, value, callback) => {
						return uni.$u.test.number(value) && value > 0 && value <= +(uni.$u.test.number(this.left_amount) ? this.left_amount :this.panRes.list.amount)
					}
					base.amount.message = `请填写0-${ uni.$u.test.number(this.left_amount) ? this.left_amount :this.panRes.list.amount}范围内的数值` 
				}
				if(this.panRes.list?.order_type == '1') {
					base = {
						...base,
						pay_option1: {
							required: true, 
							message: '请选择',
							trigger: ['blur', 'change']
						},
						pay_option2: {
							required: true, 
							message: '请选择',
							trigger: ['blur', 'change']
						},
					}
				} 
				if(this.form.pay_option2 == 'BILLPAY') {
					base = {
						...base,
						pyeeInfo: {
							required: true, 
							message: '请选择卖方票据账户',
							trigger: ['blur', 'change']
						},
					}
				} 
				if(!this.qiehuan) {
					base = {
						...base,
						delivery_place: {
							required: true,
							message: '请选择所在区域',
							trigger: ['blur', 'change']
						},
						settle_address: {
							required: true,
							message: '请填写地址',
							trigger: ['blur', 'change']
						},
					}
				}
				if(this.$refs.form && this.$refs.form.setRules) {
					this.$refs.form.setRules(base)	 
				}
				return base
			}
		},
		async onLoad(options) {
			if(options.hasOwnProperty('type')) {
				this.type = options.type
			}
			if(options.hasOwnProperty('id')) {
				this.id = options.id
			}
			if(options.hasOwnProperty('ordertype')) {
				this.ordertype = options.ordertype
			}
			this.init()
			
			
		},
		onReady() {
			this.$refs.form.setRules(this.rules) 
		},
		watch: {
			['form.pay_option1'](n, o) {
				if(n == 'GRT') {
					if(this.sinoBillAccount && this.sinoBillAccountList.length > 0) { 
						this.pay_option2_radios[1].disabled = false
					}
				}else {
					this.pay_option2_radios[1].disabled = true
					if(o == 'GRT') {
						this.form.pay_option2 = this.pay_option2_radios[0].value
					}
				}
			}, 
			['form.settle_mode']: {
				immediate: true,
				handler(n, o) {
					// console.log(this.type, this.ordertype, n, this.order.delivery_place)
					  
					this.pay_option1_radios.some(ele => {
						if(ele.value == 'COD') {
							ele.disabled = n == 'B'? true : false
							return true
						}
						return false
					})
					if(this.form.pay_option1 == 'COD') this.form.pay_option1 = 'D_P'
						
					if(this.type == 'add') {
						if(this.ordertype == 'B') {
							if(n == 'S') {
								this.form.delivery_place = ''
								this.form.settle_address = ''
								return
							} 
						}else {
							if(n == 'B') {
								this.form.delivery_place = ''
								this.form.settle_address = ''
								return
							} 
						} 
						this.form.delivery_place = this.panRes.list.delivery_place1
						this.form.settle_address = this.panRes.list.delivery_address
					}else { 
						if(this.order.delivery_place == this.panRes.list.delivery_place1
							&& this.order.settle_address == this.panRes.list.delivery_address) {
							if(this.ordertype == 'B') {
								if(n == 'S') {
									this.form.delivery_place = ''
									this.form.settle_address = ''
									return
								} 
							}else {
								if(n == 'B') {
									this.form.delivery_place = ''
									this.form.settle_address = ''
									return
								} 
							} 
						}else {
							
							this.form.delivery_place = this.order.delivery_place
							this.form.settle_address = this.order.settle_address 
						}
						
					}
				}
			}, 
			['form.amount'](n, o) {
				if(this.form.price === '') return
				this.form.total_price =  Number((this.form.price * n).toFixed(2))
			}, 
			['form.price'](n, o) {
				if(this.panRes.list.trade_mode == '2') {
					this.form.price = this.panRes.list.price1
					return 
				}
				if(this.form.amount === '' || this.tar == 'total_price') return
				this.form.total_price =  Number((this.form.amount * n).toFixed(2))
			}, 
			['form.total_price'](n, o) {
				if(o === '' || this.tar == 'price') return
				this.form.price = Number((n / this.form.amount).toFixed(2))
			}, 
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				getAddressArea: 'user/getAddressArea',
				getSinoBillAccount: 'sinopay/getSinoBillAccount',
				getSinoBillAccountList: 'sinopay/getSinoBillAccountList',
			}),
			menusConfirm(data) {
				console.log(data)
				this.form.pyeeInfo = data.pyeeInfo
				this.$refs.form.validateField('pyeeInfo')
			}, 
			async init() {
				this.getAddressArea()
				if(this.ordertype == 'B') {
					const res = await this.$api.order_query_amount_active({
						params: {
							 source_id: this.id
						}
					})
					this.left_amount = res.list?.left_amount
				}
				if(this.type == 'add') {
					uni.setNavigationBarTitle({
						title: '创建订单'
					})
					uni.showLoading({
						title: '获取商品信息'
					})
					await this.getPan()
					
					this.form.delivery_place = this.panRes.list.delivery_place1
					this.form.settle_address = this.panRes.list.delivery_address
					//订单类型为销售订单时，settle_mode直接从买盘信息里读取 BS
					this.form.source_id = this.id
					this.form.source = this.ordertype == 'S'? 'BUY' : 'SELL'
					this.settle_mode_radios = this.settle_mode_radios.filter(ele => this.panRes.list.settle_mode.includes(ele.value) )
					this.form.settle_mode = this.settle_mode_radios[1] ? this.settle_mode_radios[1].value : this.settle_mode_radios[0].value
					this.form.price = this.panRes.list.price1
					
					if(this.panRes.list.order_type == '1') {
						this.form.pay_option1 = 'GRT'
						this.form.pay_option2 = 'FUNDPAY'
					}
				}else {
					uni.setNavigationBarTitle({
						title: '修改订单'
					})
					uni.showLoading({
						title: '获取订单信息'
					})
					await this.getOrder()
					
				}
				
				this.pageLoading = false
				 // if(!this.sinoBillAccount) {
					//  await this.getSinoBillAccount()
					//  if(this.sinoBillAccount) {
					// 	 await this.getSinoBillAccountList()
					//  }else {
					// 	 this.pay_option2_radios[1].name = '票据-您未开通票据账户'
					//  }
				 // }
				
			},
			async getPan() {
				let func = ''
				if(this.ordertype == 'B') func = 'getSellDetail'
				else func = 'getBuyDetail'
				const res = await this.$api[func]({
					params: { 
						id: this.id
					}
				})
				if(res.code == 1) {
					this.panRes = res 
				}
			},
			async getOrder() {
				const res = await this.$api.order_detail({
					params: {
						ordertype: this.ordertype,
						id: this.id
					}
				})
				if(res.code == 1) {
					this.pan = res.list.Order.Source
					this.panRes = {
						list: res.list.Order.Source
					}
					this.order = res.list.Order  
					this.form.id = this.id
					this.form.source_id = res.list.Order.source_id
					this.form.amount = res.list.Order.amount
					this.form.price = res.list.Order.price1
					this.form.total_price = res.list.Order.total_price1
					this.form.pay_option1 = res.list.Order.settle_type
					this.form.pay_option2 = res.list.Order.pay_mode.includes == 'BILLPAYGUARANTE' ? 'BILLPAY' : 'FUNDPAY'
					this.form.pyeeInfo = res.list.Order.payeeAccNm || ''
					this.form.settle_mode = res.list.Order.settle_mode
					this.form.delivery_place = res.list.Order.delivery_place
					this.form.settle_address = res.list.Order.settle_address
					this.form.intro = res.list.Order.intro
					this.form.remark = res.list.Order.remark
					
				}
			},
			async submit() {
				this.$refs.form.validate().then(async r => {
					console.log(r)
					if(r) {
						uni.showLoading()
						let func = this.type == 'add' ? 'create_order' : 'change_order'; 
						const res = await this.$api[func]({
							...this.form
						})
						if(res.code == 1) {
							if(this.type == 'add') {
								uni.redirectTo({
									url: `/pages/my/order/order?ordertype=${this.ordertype}`,
									success: () => {
										uni.showToast({
											title: '创建订单成功'
										})
									}
								}) 
							}else {
								const p = uni.$u.pages();
								p[p.length - 2].$vm.getData();
								uni.navigateBack({
									success: () => {
										uni.showToast({
											title: '修改成功'
										})
									}
								})
							}
							
							
						}
					}
					
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.wrapper {
		
	}
</style>
