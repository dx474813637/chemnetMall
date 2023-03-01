<template>
	<view class="u-p-20">
		<view class="u-p-l-20 u-p-r-20 u-p-t-40">
			<u--form
				labelPosition="left"
				:model="model"
				:rules="rules"
				ref="from"
				labelWidth="80"
			>
					<u-form-item
						label="已绑定手机"
						prop="ophone"
						ref="ophone"
					>
						<u--input
							:value="model.ophone | filterPhone"
							clearable
							disabled
							inputAlign='right'
							disabledColor="#fff"
							border="none"
						></u--input>
					</u-form-item>
					<u-form-item
						label="解绑理由"
						prop="remark"
						ref="remark"
					>
						<u--textarea v-model="model.remark" placeholder="请输入内容" ></u--textarea>
					</u-form-item>
					<u-form-item
						label="验证码"
						prop="ocode"
						ref="ocode"
						required
					>	
						<u-input
							v-model="model.ocode"
							clearable
						>
							<template slot="suffix">
								<u-code
									ref="uCode"
									@change="codeChange"
									keep-running
									change-text="XS后重新获取"
									unique-key="a"
									@start="disabled = true"
									@end="disabled = false"
								></u-code>
								<u-button
									type="primary"
									@tap="getCode"
									:text="tips"
									size="small"
									:disabled="disabled"
								></u-button>
							</template>
						</u-input>
						
					</u-form-item>
			</u--form>
			
			<view class="u-p-t-60 u-m-b-40">
				<u-button type="primary" @click="submit" >提交解绑</u-button>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				tips: '',
				disabled: false,
				current: 0,
				model: {
					ophone: '',
					ocode: '',
					remark: '',
				},
				rules: {
					ocode: {
						type: 'string',
						required: true,
						message: '请填写验证码',
						trigger: ['blur', 'change']
					}
				},
				btnSec: 60,
				btnLoading: false,
				timer: null,
			}
		},
		filters: {
			filterPhone(v) {
				return v.slice(0, 3) + '****' + v.slice(7, 11)
			}
		},
		async onLoad() {
			if(!this.wodeObj.mobile) {
				const res = await this.$api.wode()
				if(!res.list.mobile) {
					if(uni.getStorageSync('prePage')) {
						uni.redirectTo({
							url: uni.getStorageSync('prePage')
						})
						uni.removeStorageSync('prePage')
					}else {
						uni.reLaunch({
							url: '/pages/my/user/index'
						})
					}
					return
				}
			}
			this.model.ophone = this.wodeObj.mobile
			
		},
		computed: {
			...mapState({
				myCpy: state => state.user.myCpy,
				wodeObj: state => state.user.wode,
				bd: state => state.user.bd,
			}),
			btnText() {
				return this.timer ? `${this.btnSec}s重新获取` :'获取验证码'
			}
		},
		onReady() {
			this.$refs.from.setRules(this.rules)
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			...mapActions({
				myCompany: 'user/myCompany',
				clearLogout: 'user/clearLogout',
				// wode: 'user/wode',
			}),
			async handleLogout() {
				const res = await this.$api.logout()
				uni.reLaunch({
					url: '/pages/index/login/login',
					success() {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			async getCode() {
				if(this.disabled) return
				uni.showLoading({
					title: '正在获取验证码'
				})
				this.$refs.uCode.start();
				const res = await this.$api.jiebangMob({
					params: {
						flag: 1,
					}
				})
				if(res.code == 1) {
					uni.showToast({
						title: '验证码已发送'
					})
				}
			},
			async submit() {
				this.$refs.from.validate().then(async () => {
					uni.showLoading()
					let params = {
						flag: 2,
						mobile_code: this.model.ocode,
						unbind_remark: this.model.remark
					}
					const res = await this.$api.jiebangMob({
						params,
					})
					if(res.code == 1){
						
						await this.$api.logout()
						this.clearLogout()
						uni.reLaunch({
							url: '/pages/index/login/login',
							success() {
								uni.showToast({
									title: res.msg,
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

<style>

</style>
