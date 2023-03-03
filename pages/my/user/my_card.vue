<template>
	<view class="w u-p-20">
		<u--form
			labelPosition="left"
			:model="form"
			ref="form"
			:rules="rules"
			labelWidth="75px" 
			>
			<u-form-item
				label="图片"
				prop="img"
				ref="img"
			>
				<view>
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						:maxCount="1"
						:maxSize="2048000"
						@oversize="handleoversize"
					></u-upload>
					<view class="u-info u-font-28">建议上传2M以内的图片</view>
				</view>
			</u-form-item>
			<u-form-item label="姓名" prop="name" required >  
				<u--input
					v-model="form.name"  
					placeholder="请输入姓名"
				></u--input> 
			</u-form-item> 
			<u-form-item label="公司" prop="company" required >  
				<u--input
					v-model="form.company"  
					placeholder="请输入公司"
				></u--input> 
			</u-form-item> 
			<u-form-item label="职位" prop="position" required >  
				<u--input
					v-model="form.position"  
					placeholder="请输入职位"
				></u--input> 
			</u-form-item>
			<u-form-item label="手机" prop="phone" required >  
				<u--input
					v-model="form.phone"  
					placeholder="请输入手机"
				></u--input> 
			</u-form-item>   
			<u-form-item label="电话" prop="tel" >  
				<u--input
					v-model="form.tel"  
					placeholder="请输入电话"
				></u--input> 
			</u-form-item> 
			<u-form-item label="邮箱" prop="email" >  
				<u--input
					v-model="form.email"  
					placeholder="请输入邮箱"
				></u--input> 
			</u-form-item> 
			<u-form-item label="地址" prop="address" >  
				<u--input
					v-model="form.address"  
					placeholder="请输入地址"
				></u--input> 
			</u-form-item> 
			<u-form-item label="主营业务" prop="info" >  
				<!-- <u--input
					v-model="form.info"  
					placeholder="请输入主营业务"
				></u--input> -->
				<u--textarea v-model="form.info" placeholder="请输入主营业务" height="160" ></u--textarea>
			</u-form-item> 
		</u--form>
		
		<view class="confirm-rows u-m-t-30 u-m-b-30" >
			<u-button type="primary" @click="handleConfirm">提 交</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				form: {
					name: '',
					position: '',
					company: '',
					phone: '',
					tel: '',
					email: '',
					address: '', 
					img: '',
					info: ''
				},
				fileList1: [],
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'position': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'company': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, 
					'phone': [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
						{ 
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确', 
							trigger: ['change','blur'],
						}
					],
				}
			};
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		computed: {
			...mapState({ 
				typeConfig: state => state.theme.typeConfig, 
				configHeader: state => state.user.configHeader,
				configBaseURL: state => state.user.configBaseURL,
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
		},
		async onLoad() {
			uni.showLoading( )
			await this.getData()
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				getImageBase64_readFile: 'user/getImageBase64_readFile'
			}),
			async getData() {
				const res = await this.$api.login_card()
				if(res.code == 1) {
					this.form.name = res.list.name
					this.form.company = res.list.company
					this.form.email = res.list.email
					this.form.phone = res.list.phone
					this.form.position = res.list.position
					this.form.tel = res.list.tel
					this.form.address = res.list.address
					this.form.img = res.list.img
					this.form.info = res.list.info
					if(res.list.img) {
						this.fileList1 = [{url: this.form.img}]
					}
				}
			},
			
			async handleConfirm() {
				
				this.$refs.form.validate().then(async res => { 
					const list = await this.$api.edit_card({
						params: {
							...this.form
						}
					})
					if(list.code == 1) { 
						uni.showToast({
							title: list.msg
						})
					}
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
				
			},
			handleoversize() {
				uni.showToast({
					title: '建议上传2M以内的图片',
					icon: 'none'
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				this.form.img = ''
				 
			},
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					console.log(result)
					this.form.img = result.list
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result.list
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: `${this.configBaseURL}upimg`, 
						filePath: url,
						name: 'file',
						header: {
							...this.configHeader,
							userid: uni.getStorageSync('userid'),
						},
						success: (res) => {
							resolve(JSON.parse(res.data))
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		/deep/ {
			.u-form-item__body__left {
				align-items: flex-start!important;
				padding-top: 10px!important;
			}
		}
	}
</style>
