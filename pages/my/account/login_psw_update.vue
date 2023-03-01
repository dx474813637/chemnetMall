<template>
	<view class="u-p-20">
		
		<u--form
			labelPosition="left"
			:model="model"
			ref="from"
			labelWidth="80"
		>
			<u-form-item
				label="原始密码"
				prop="opasswd"
				ref="opasswd"
			>
				<u--input
					v-model="model.opasswd"
					password
					clearable
				></u--input>
			</u-form-item>
			<u-form-item
				label="新密码"
				prop="npasswd"
				ref="npasswd"
			>
				<u--input
					v-model="model.npasswd"
					clearable
					password
				></u--input>
			</u-form-item>
			<u-form-item
				label="确认密码"
				prop="cpasswd"
				ref="cpasswd"
			>
				<u--input
					v-model="model.cpasswd"
					clearable
					password
				></u--input>
			</u-form-item>
			<u-form-item>
				<text class="text-light">密码可使用任何英文字母及阿拉伯数字组合，不得少于5个字符。</text>
			</u-form-item>
		</u--form>
		
		<view class="u-p-t-20 u-m-b-40">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					cpasswd: '',
					npasswd: '',
					opasswd: ''
				},
				rules: {
					opasswd: {
						type: 'string',
						required: true,
						message: '请填写原始密码',
						trigger: ['blur', 'change']
					},
					npasswd: [{
							required: true,
							message: '请输入密码',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								const RegExpObject = /^[0-9A-Za-z]{5,}$/
								return RegExpObject.test(value)
							},
							message: '密码可使用任何英文字母以及阿拉伯数字组合，不得少于5个字符并区分英文大小写',
							trigger: ['blur', 'change']
						},
					],
					cpasswd: [{
							required: true,
							message: '请确认密码',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return this.model.npasswd == value
							},
							message: '密码不一致',
							trigger: ['blur', 'change']
						},
					],
				}
			}
		},
		onReady() {
			this.$refs.from.setRules(this.rules)
		},
		methods: {
			
			submit() {
				
				this.$refs.from.validate().then(async res => {
					uni.showLoading()
					const r = await this.$api.passwdResetA({params: {...this.model}})
					
					if(r.code == 1) {
						
						uni.navigateBack({
							success() {
								uni.showToast({
									title: r.msg,
									icon: 'none'
								})
							}
						})
					}
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
