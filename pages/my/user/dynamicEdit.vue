<template>
	<view class="w u-p-20">
		<view class="u-p-20">
			<u--form
				labelPosition="left"
				:model="form"
				ref="form"  
				>
				<u-form-item prop="info" >   
					<u--textarea 
					v-model="form.info" 
					placeholder="请输入自己想说的话"  
					:customStyle="{border: 'none'}"
					autoHeight
					></u--textarea>
				</u-form-item> 
				<u-form-item >
					<view>
						<u-upload
							:fileList="fileList1"
							@afterRead="afterRead"
							@delete="deletePic"
							name="1"
							:maxCount="9"
							:maxSize="2048000"
							multiple
							@oversize="handleoversize"
						></u-upload>
						<view class="u-info u-font-28">建议上传2M以内的图片</view>
					</view>
				</u-form-item>
			</u--form>
		</view>
		
		<view class="u-p-20 u-m-t-30 u-m-b-30">
			<u-button type="primary" @click="handleConfirm">发表</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				id: '',
				form: {
					info: '',
				},
				fileList1: [],
			}
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
		
		async onLoad(options) { 
			if (options.hasOwnProperty('id')) {
				this.id = options.id
			}  
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			
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
			async handleConfirm() {
				
				// this.$refs.form.validate().then(async res => { 
					const list = await this.$api.add_dynamiclist({
						params: {
							...this.form,
							id: this.id,
							img: this.fileList1.map(ele => ele.url).join(','),
						}
					})
					if(list.code == 1) { 
						this.form.info = ''
						this.fileList1 = []
						uni.showToast({
							title: list.msg
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}
				// }).catch(errors => {
				// 	console.log(errors)
				// 	uni.$u.toast('校验失败')
				// })
				
			},
		}
	}
</script>

<style>

</style>
