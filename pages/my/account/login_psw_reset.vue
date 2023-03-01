<template>
	<view class="u-p-20">
		
		<u--form
			labelPosition="left"
			:model="model"
			ref="from"
			labelWidth="80"
		>
			<u-form-item prop="mobile" label="手机号"  >
				<u--input 
					v-model="model.mobile" 
					clearable
				/>
			</u-form-item>
			<u-form-item
				label="新密码"
				prop="passwd"
				ref="passwd"
			>
				<u--input
					v-model="model.passwd"
					clearable
					password
				></u--input>
			</u-form-item>
			<u-form-item
				label="确认密码"
				prop="passwd2"
				ref="passwd2"
			>
				<u--input
					v-model="model.passwd2"
					clearable
					password
				></u--input>
			</u-form-item>
			<u-form-item prop="captcha"
				label="验证码" >
				<u-input 
					v-model="model.captcha" 
					clearable
				>
					<template slot="suffix">
						<u-code
							ref="uCode"
							@change="codeChange"
							seconds="60"
							changeText="X秒重新获取"
						></u-code>
						<u-button
							@tap="getCode"
							:text="tips"
							type="warning"
							size="mini"
						></u-button>
					</template>
				</u-input>
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
				tips: '获取验证码',
				model: {
					mobile: '',
					passwd: '',
					passwd2: '',
					captcha: '',
				},
				rules: {
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value)
							},
							message: '请输入正确的11位手机号',
							trigger: ['blur', 'change']
						},
					],
					passwd: [{
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
					passwd2: [{
							required: true,
							message: '请确认密码',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return this.model.passwd == value
							},
							message: '密码不一致',
							trigger: ['blur', 'change']
						},
					],
					
					captcha: {
						required: true,
						message: '请输入验证码',
						trigger: ['blur', 'change']
					}
				}
			}
		},
		onReady() {
			this.$refs.from.setRules(this.rules)
		},
		methods: {
			
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				this.$refs.from.validateField('mobile', async (err) => {
					console.log(err)
					if(err && err.length > 0) return
					if (this.$refs.uCode.canGetCode) {
					  // 模拟向后端请求验证码
					  uni.showLoading()
					  const res = await this.$api.passwdReset({
						  params: {
							  ...this.model,
							  flag: 1
						  }
					  })
					  if(res.code == 1) {
						  uni.$u.toast('验证码已发送');
						  this.$refs.uCode.start();
					  }
					} else {
					  uni.$u.toast('倒计时结束后再发送');
					}
				})
				
			},
			submit() {
				
				this.$refs.from.validate().then(async res => {
					uni.showLoading()
					const r = await this.$api.passwdReset({
						params: {
							...this.model,
							flag: 2
						},
					})
					
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
