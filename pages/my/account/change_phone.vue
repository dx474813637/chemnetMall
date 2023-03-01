<template>
	<view class="u-p-20">
		<view class="u-p-t-20 u-p-b-20">
			<u-steps :current="current">
				<u-steps-item title="验证信息"></u-steps-item>
				<u-steps-item title="绑定新手机"  ></u-steps-item>
				<u-steps-item title="完成绑定" ></u-steps-item>
			</u-steps>
		</view>
		<view class="u-p-l-20 u-p-r-20 u-p-t-40">
			<u--form
				labelPosition="left"
				:model="model"
				:rules="rules"
				ref="from"
				labelWidth="80"
			>
				<template v-if="current == 0">
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
						label="验证码"
						prop="ocode"
						ref="ocode"
					>	
						<u-input
							v-model="model.ocode"
							clearable
						>
							<template slot="suffix">
								<u-code
									ref="uCode1"
									@change="codeChange1"
									keep-running
									change-text="XS后重新获取"
									unique-key="a"
									@start="disabled1 = true"
									@end="disabled1 = false"
								></u-code>
								<u-button
									type="primary"
									@tap="getCode('1')"
									:text="tips1"
									size="small"
									:disabled="disabled1"
								></u-button>
							</template>
						</u-input>
						
					</u-form-item>
				</template>
				<template v-else-if="current == 1">
					<u-form-item
						label="新手机"
						prop="nphone"
						ref="nphone"
					>
						<u--input
							v-model="model.nphone"
							clearable
						></u--input>
					</u-form-item>
					<u-form-item
						label="验证码"
						prop="ncode"
						ref="ncode"
					>	
						<u-input
							v-model="model.ncode"
							clearable
						>
							<template slot="suffix">
								<u-code
									ref="uCode2"
									@change="codeChange2"
									keep-running
									change-text="XS后重新获取"
									unique-key="b"
									@start="disabled2 = true"
									@end="disabled2 = false"
								></u-code>
								<u-button
									type="primary"
									@tap="getCode('2')"
									:text="tips2"
									size="small"
									:disabled="disabled2"
								></u-button>
							</template>
						</u-input>
						
					</u-form-item>
				</template>
				
				
			</u--form>
			
			<view class="u-p-t-60 u-m-b-40">
				<template  v-if="current != 2">
					<u-button type="primary" @click="submit" >提交</u-button>
				</template>
				<template  v-else>
					<view >
						<u-button type="primary" disabled >等待跳转..</u-button>
					</view>
					
				</template>
				
				<!-- <view class="u-m-t-40" @click="handleGoto({url: '/pages/index/index'})">
					<u-button type="primary" >放弃绑定，回到首页</u-button>
				</view>
				<view class="u-m-t-40" @click="handleLogout">
					<u-button type="error" >账号登出，更换账号登录</u-button>
				</view> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				tips1: '',
				tips2: '',
				disabled1: false,
				disabled2: false,
				current: 0,
				model: {
					ophone: '',
					ocode: '',
					nphone: '',
					ncode: '',
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
			await this.myCompany()
			this.model.ophone = this.wodeInfo.mobile
		},
		computed: {
			...mapState({
				myCpy: state => state.user.myCpy,
				bd: state => state.user.bd,
				wodeInfo: state => state.user.wode,
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
				handleGoto: 'user/handleGoto',
				clearLogout: 'user/clearLogout',
			}),
			...mapActions({
				myCompany: 'user/myCompany',
				wode: 'user/wode',
			}),
			codeChange1(text) {
				this.tips1 = text;
			},
			codeChange2(text) {
				this.tips2 = text;
			},
			async getCode(index) {
				if(this['disabled'+index]) return
				uni.showLoading({
					title: '正在获取验证码'
				})
				this.$refs['uCode' + index].start();
				
				let params = {}
				if(this.current == 1) {
					params = {
						new_mobile: this.model.nphone,
						old_mobile: this.model.ophone,
						old_mobile_code: this.model.ocode,
						flag: 3,
					}
				}
				else {
					params = {
						old_mobile: this.model.ophone,
						flag: 1,
					}
				}
				const res = await this.$api.changeMobile({params})
				if(res.code == 1) {
					uni.showToast({
						title: '验证码已发送'
					})
				}
			},
			async reLogin () {
				uni.showLoading({
					title: '正在登出，需重新登录'
				})
				const res = await this.$api.logout();
				if(res.code == 1) {
					
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
				
				
			},
			async submit() {
				uni.showLoading()
				let params = {}
				if(this.current == 1) {
					params = {
						new_mobile: this.model.nphone,
						new_mobile_code: this.model.ncode,
						old_mobile: this.model.ophone,
						old_mobile_code: this.model.ocode,
						flag: 4,
					}
				}
				else {
					params = {
						old_mobile: this.model.ophone,
						old_mobile_code: this.model.ocode,
						flag: 2,
					}
				}
				
				
				const res = await this.$api.changeMobile({
					params,
				})
				if(res.code == 1){
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					this.current ++;
					this.current == 2 && this.reLogin()
				}
				
			}
		}
	}
</script>

<style>

</style>
