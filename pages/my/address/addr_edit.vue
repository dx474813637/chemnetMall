<template>
	<view class="u-p-20 u-p-l-40 u-p-r-40">
		<u--form
			labelPosition="left"
			:model="addressData"
			ref="addrform"
			labelWidth="80"
		>
			<u-form-item
				label="地址类型"
				prop="type"
				ref="addressData_type"
				required
			>
				<u-radio-group
				    v-model="addressData.type"
				    placement="row"
				    @change="groupChange"
				  >
				    <u-radio
				      :customStyle="{marginRight: '8px'}"
				      v-for="(item, index) in radiolist1"
				      :key="item.value"
				      :label="item.name"
				      :name="item.value"
				    >
				    </u-radio>
				  </u-radio-group>
			</u-form-item>
			<u-form-item
				label="联系人"
				prop="contact"
				ref="addressData_contact"
			>
				<u--input
					v-model="addressData.contact"
					clearable
				></u--input>
			</u-form-item>
			<u-form-item
				label="电话"
				prop="tel"
				ref="addressData_tel"
				required
			>
				<u--input
					v-model="addressData.tel"
					clearable
					type="number"
				></u--input>
			</u-form-item>
			<u-form-item
				label="地区"
				prop="regional"
				ref="addressData_regional"
				required
			>
				<uni-data-picker
					placeholder="所在地" 
					popup-title="请选择所在地区" 
					:localdata="addressArea" 
					v-model="addressData.regional"
					@change="handleValArea"
				></uni-data-picker>
			</u-form-item>
			<u-form-item
				label="详细地址"
				prop="address"
				ref="addressData_address"
				required
			>
				<u--textarea
					v-model="addressData.address" 
					placeholder="详细地址" 
					height="90"
				></u--textarea>
			</u-form-item>
			
			<u-form-item
				label="设为默认"
				v-if="type == 'edit'"
			>
				<u-switch v-model="addressData.autoCheck" :disabled="switchDisabled"></u-switch>
			</u-form-item>
			<u-form-item
				label="备注"
				prop="remark"
				ref="addressData_remark"
			>
				<u--textarea
					v-model="addressData.remark" 
					placeholder="备注" 
					height="90"
				></u--textarea>
			</u-form-item>
		</u--form>
		
		<view class="u-p-t-20">
			<u-button type="primary" @click="confirmAddr">提交</u-button>
		</view>
		<view class="u-p-t-20 u-m-b-40" v-if="type == 'edit'">
			<u-button type="error" @click="delAddrClick">删除地址</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations, mapActions} from "vuex"
	export default {
		// mixins: [mixCheckLogin],
		data() {
			return {
				show: false,
				switchDisabled: false,
				type: 'add',
				radiolist1: [{
						name: '收货',
						value: 'R',
						disabled: false
					},
					{
						name: '发货',
						value: 'S',
						disabled: false
					},
					{
						name: '收/发',
						value: 'RS',
						disabled: false
					}
				],
				addressData: {
					type: "RS",
					address: "",
					tel: '',
					contact: "",
					regional: '',
					regional_name: "",
					remark: "",
					autoCheck: false,
					def: 0
				},
				rules: {
					tel: [
						{ 
							required: true,
							message: '电话不能为空',
							trigger: ['blur', 'change']
						}
						// {
						// 	validator: (rule, value, callback) => {
						// 		if(value == '') return true
						// 		return uni.$u.test.mobile(value)
						// 	},
						// 	message: '电话号码格式不正确',
						// 	trigger: ['change','blur'],
						// }
					],
					regional: {
						type: 'string',
						required: true,
						message: '请选择所在地',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '请填写详细地址',
						trigger: ['blur', 'change']
					}
				}
			}
		},
		onReady() {
			this.$refs.addrform.setRules(this.rules)
		},
		computed: {
			...mapState({
				addressArea: (state) => state.user.addressArea,
			}),
			loading() {
				return this.addressArea.length == 0
			}
		},
		watch: {
			['addressData.autoCheck'](flag) {
				if(flag) {
					this.addressData.def = 1
				}else {
					this.addressData.def = 0
				}
			}
		},
		async onLoad(option) {
			let title = '新增收货地址';
			if (this.addressArea.length == 0) {
				uni.showLoading({
					title: '初始化地区列表中...'
				})
				await this.getAddressArea()
			}
			if (option.type === 'edit') {
				title = '编辑收货地址'
				// let res = await this.$http.get('address_detail', {params: {address_id:option.data.id}})
				this.addressData = JSON.parse(decodeURIComponent(option.data))
				console.log(this.addressData)
				if(this.addressData.def == 1) {
					this.$set(this.addressData, 'autoCheck', true)
					this.switchDisabled = true
				}else {
					this.$set(this.addressData, 'autoCheck', false)
				}
				// this.filterRegionalList(this.addressData.regional, this.addressArea)
			}
			
			// console.log(this.addressData.regional)
			this.type = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				getAddressArea: 'user/getAddressArea'
			}),
			changeSwitch(e) {
				console.log(e)
				this.addressData.autoCheck = e
			},
			groupChange(n) {
				console.log('groupChange', n);
			},
			handleValArea() {
				this.$refs.addrform.validateField('addressData.regional')
			},
			//提交
			async confirmAddr() {
				this.$refs.addrform.validate().then(async res => {
					let flag = await this.submitData(this.addressData)
					if(!flag) {
						uni.showToast({
							title: '提交操作有误',
							icon: 'none'
						})
						return 
					}
					const arr = uni.$u.pages()
					arr[arr.length - 2].$vm.refreshList(this.type);
					uni.showToast({
						icon: 'success',
						title: `地址${this.type=='edit' ? '修改': '添加'}成功`
					})
					setTimeout(() => {
						this.handleGoto({type: 'navigateBack'})
					}, 800)
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
				
				//this.$utils.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				
			},
			async delAddrClick() {
				uni.showModal({
					title: '提示',
					content: '是否删除该地址？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading()
							const res = await this.$api.deleteAddress({params: {id: this.addressData.id}})
							if(res.code == 1) {
								const arr = uni.$u.pages()
								arr[arr.length - 2].$vm.refreshList(this.type);
								uni.showToast({
									icon: 'success',
									title: `删除成功`
								})
								setTimeout(() => {
									this.handleGoto({type: 'navigateBack'})
								}, 800)
							}
						}	
					}
				})
			},
			async submitData(data) {
				uni.showLoading({
					title: '地址提交中...'
				})
				let params = {
					contact: data.contact,
					tel: data.tel,
					to_def: data.def,
					regional: data.regional,
					address: data.address,
					remark: data.remark,
					type: data.type,
				}
				if(this.type == 'edit') {
					params.id = data.id
				}
				let res = await this.$api[this.type == 'add'? 'createAddress' : 'changeAddress'](params)
				
				return res.code == 1
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30rpx;
		height: 110rpx;
		background: #fff;
		&.textarea {
			align-items: flex-start;
			height: auto;
			padding-top: 8rpx;
		}
		.tit {
			flex-shrink: 0;
			width: 140rpx;
			font-size: 30rpx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			font-size: 36rpx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16rpx;

		// .tit {
		// 	flex: 1;
		// }

		switch {
			transform: translateX(16rpx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 30rpx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		// box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		&.del-btn {
			background-color: $uni-color-error;
		}
	}
</style>
