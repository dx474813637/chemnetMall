<template>
	<view class="">
		<u-notice-bar text="请真实发布！若因信息不实而被投诉，将进入黑名单。"></u-notice-bar> 
		<view class="u-content" v-if="detail != 1">
			<u-parse :content="infoa" :previewImg="false" :showImgMenu="false"></u-parse>
		</view>
		<view class="u-p-20 u-p-l-40 u-p-r-40">
			<u--form
				labelPosition="top"
				:model="xpForm"
				ref="from"
				labelWidth="100%" 
				>
				<u-form-item label="CAS/名称" prop="name" required > 
					<view @click="searchProduct">
						<u--input
							v-model="xpForm.name" 
							readonly
							placeholder="请输入CAS号或商品名称"
						></u--input>
					</view>
					
					
				</u-form-item> 
				<u-form-item label="需求量" prop="pack" required > 
					<view class="u-flex u-flex-items-center">
						<view class="item">
							<u-number-box 
								:min="1" 
								:step="1" 
								integer 
								v-model="xpForm.quantity"
								buttonSize="35"
								></u-number-box>
						</view>
						<view class="item u-p-10 u-info">
							×
						</view>
						<!-- 重量 pack -->
						<template v-if="packList.length > 0">
							<view class="item u-flex-1" @click="packColumnsShow = true"> 
								<u--input
									type="digit"
									v-model="xpForm.pack"
									readonly
									suffixIcon="arrow-down"
									placeholder="重量(数字)"
								></u--input>
							</view>
						</template>
						<view class="item u-flex-1" v-else>
							<u--input
								type="digit"
								v-model="xpForm.pack"  
								placeholder="重量(数字)"
							></u--input>
						</view>
						
						<!-- 单位unit -->
						<template v-if="productData.hasOwnProperty('unit')">
							<view class="u-p-10">
								{{productData.unit}}
							</view>
						</template>
						<view class="item u-m-l-10" style="width: 75px;" @click="unitColumnsShow = true" v-else>
							<u--input  
								v-model="xpForm.unit"  
								placeholder="计量单位"	
								suffixIcon="arrow-down"
								readonly
								></u--input>
						</view>
					</view>
					
				</u-form-item> 
				<u-form-item label="收货区域" prop="address_id" required >
					<view class="u-flex u-p-15 u-border u-radius-4" 
						@click="handleGoto({url: '/pages/my/address/address', params: {source: 1}})"	
						style="background-color: #eee;"
					>
						<view class="u-flex-1"
							:class="{
								'u-info': !xpForm.addr
							}"
						>{{xpForm.addr || '点击选择地址'}}</view>
						<view class="u-p-t-6 u-p-l-10">
							<u-icon name="arrow-down"></u-icon>
						</view>
					</view>
					
				</u-form-item> 
				<u-form-item label="备注" prop="remark"  > 
					<u--textarea v-model="xpForm.remark" placeholder="请输入内容" ></u--textarea>
					
				</u-form-item> 
				
			</u--form> 
		</view>
		<view class="u-p-t-20 u-p-l-40 u-p-r-40 u-m-b-40">
			<u-button type="primary" @click="submit">发 布</u-button>
		</view>
		
		<view class="u-content " v-if="detail != 1" > 
			<view style="background-color: #eee;height: 5px;"></view>
			<u-parse :content="infob" :previewImg="false" :showImgMenu="false"></u-parse>
		</view>
		<menusPopupProd
			:show="menusShow"
			@close="menusShow = false"
			@confirm="menusPopupProdConfirm"
		></menusPopupProd>
		
		<u-picker 
			:show="unitColumnsShow" 
			keyName="name"
			ref="uPicker"  
			:columns="unitColumns" 
			closeOnClickOverlay
			@close="unitColumnsShow = false"
			@confirm="unitConfirm"></u-picker>
		
		<u-picker  
			:show="packColumnsShow"  
			:columns="packList" 
			keyName="pack"
			closeOnClickOverlay
			@close="packColumnsShow = false"
			@confirm="packConfirm"></u-picker>
		<u-safe-bottom></u-safe-bottom>
		<menusBar activeIndex="0" theme="chemnet"></menusBar>
	</view>
</template>

<script>
	// const INIT_START_TIME = new Date().getTime()+3600*24*1000;
	// const INIT_END_TIME = INIT_START_TIME + 3600*1000;
	import {mapState, mapMutations, mapActions} from "vuex"
	import menusBar from '@/components/menusBar/menusBar.vue'
	import menusPopupProd from '@/pages/my/components/menusPopupProd/menusPopupProd.vue'
	// import uniSection from '@/pages/my/components/uni-section/uni-section'
	export default {
		data() {
			return {
				// pid: '',
				// pan: 'b',
				// picMaxCount: 5,
				// cpy: '',
				// product: '',
				// prodInfo: '',
				// prodUnit: '',
				// prodInfoLoading: false, 
				xpForm: {
					product_id: '',
					name: '',  
					quantity: 1,
					attr_id: '',
					pack: '', 
					unit: 'kg', 
					address_id: '',
					addr: '', 
					remark: ''
				},
				addressData: {},
				menusShow: false,
				unitColumnsShow: false,
				// unitColumns: [
				// 	[{
				// 		label: 'kg', 
				// 		value: 'kg'
				// 	},{
				// 		label: 'g', 
				// 		value: 'g'
				// 	},{
				// 		label: 'T', 
				// 		value: 'T'
				// 	},{
				// 		label: 'L', 
				// 		value: 'L'
				// 	},{
				// 		label: 'bbl', 
				// 		value: 'bbl'
				// 	},{
				// 		label: 'bag', 
				// 		value: 'bag'
				// 	},{
				// 		label: 'TEU', 
				// 		value: 'TEU'
				// 	},]
				// ],
				productData: {},
				packColumnsShow: false,
				list_unit: [],
				infoa: '',
				infob: '',
				detail: 0
			}
		},
		computed: {  
			rules() { 
				return {
					'name': {
						type: 'string',
						required: true,
						message: '请选择商品',
						trigger: ['blur', 'change']
					},
					'address_id': {
						type: 'string',
						required: true,
						message: '地址不能为空',
						trigger: ['blur', 'change']
					},
					'pack': {
						type: 'string',
						required: true,
						message: '重量不能为空',
						trigger: ['blur', 'change']
					},
				}
			},
			packList() {
				if(!this.productData.hasOwnProperty('list_attr') || this.productData.list_attr.length == 0) return [];
				return [
					this.productData.list_attr
				]
			}, 
			unitColumns() {
				return [
					this.list_unit.map(ele => {
						ele.name = `${ele.name} - ${ele.eng_name}`
						return {
							...ele
						}
					})
				]
			}
		},
		async onLoad(options) { 
			
			if(options.hasOwnProperty('data')) { 
				this.detail = 1
				this.productData = JSON.parse(decodeURIComponent(options.data))
				console.log(this.productData)
				this.setBaseData2Form()
			} 
			else {
				await this.getUnitData()
			}
			this.getAddr()
			 
		},
		components: {
			menusBar,
			menusPopupProd
		},
		watch: {
			addressData(n) {
				console.log(n)
				this.xpForm.address_id = n.id
				this.xpForm.addr = n.contact + '-' + n.Regionals.reduce((pre, cur) => pre + cur.Particular.name, '') + n.address
			},
			
		},
		onReady() {
			this.$refs.from.setRules(this.rules)
		}, 
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),  
			searchProduct() {
				if(this.productData.hasOwnProperty('id')) return;
				this.menusShow = true
			},
			async getAddr() {
				const res = await this.$api.myAddress()
				if(res.code == 1 ) {
					this.infoa = res.infoa
					this.infob = res.infob
					let moren = res.list.filter(ele => ele.def == 1)[0]
					if(moren) {
						this.addressData = moren
					}
					
				}
			},
			async getUnitData() {
				const res = await this.$api.list_unit();
				if(res.code == 1) {
					this.list_unit = res.list || []
				}
			},
			setBaseData2Form() {
				this.xpForm.name = this.productData.name 
				this.setAttrData2Form(this.productData.list_attr[0])  
			}, 
			setAttrData2Form(item) {
				let curAttrItem = item
				this.xpForm.attr_id = curAttrItem.id
				this.xpForm.product_id = curAttrItem.product_id
				this.xpForm.pack = curAttrItem.pack
			},
			menusPopupProdConfirm(data) {
				console.log(data)
				this.productData = data
				this.xpForm.name = data.name 
				this.xpForm.product_id = data.id 
			}, 
			packConfirm(e) {
				console.log(e)
				this.setAttrData2Form(e.value[0])  
				this.packColumnsShow = false
				// this.xpForm.pack = e.value[0]
			},
			unitConfirm(e) {
				console.log(e)
				this.xpForm.unit = e.value[0].eng_name
				this.unitColumnsShow = false
			}, 
			submit() {
				
				this.$refs.from.validate().then(async res => {
					// uni.showLoading()
					
					let func = 'create_inquiry'
					let params = {
						...this.productData, 
						...this.xpForm
					};
					// if(this.pan == 's') {
						 
					// 	if(this.pid) {
					// 		func = 'changeSell'
					// 	}else {
					// 		func = 'createSell'
					// 	}
					// }else {
					// 	if(this.pid) {
					// 		func = 'changeBuy'
					// 	}else {
					// 		func = 'createBuy'
					// 	}
					// }
					// if(this.pid) params.id = this.pid
					console.log(params)
					const r = await this.$api.create_inquiry({
						params: {
							...this.productData, 
							...this.xpForm
						}
					})
					if(r.code == 1) {
						const p = uni.$u.pages();
						uni.showToast({
							title: r.msg,
							icon: 'none', 
						})
							setTimeout(() => {
								if(p.length > 1) {
									uni.navigateBack( )
									return
								}else {
									uni.redirectTo({
										url: `/pages/my/inquiry/inquiry_list`,
										success() {
											uni.showToast({
												title: r.msg,
												icon: 'none'
											})
										}
									})
								}
								
							}, 2000)
						
					}
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
			}, 
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 80px;
		/deep/ {
			
			.u-number-box__minus,
			.u-number-box__plus  { 
				// width: 25px!important;
			} 
		}
	} 
</style>
<style scoped lang="scss">
	.wrapper {
		
	}
	.data-pickerview {
		height: 400px;
		border: 1px #e5e5e5 solid;
	}
</style>
