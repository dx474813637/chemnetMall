<template>
	<view>
		<view class="album u-flex u-flex-items-start">
			<view class="album__avatar u-flex u-flex-center u-flex-items-start" style="flex: 0 0 60px">
				<u--image :src="origin.avatar" bgColor="#eee" mode="" width="45px" height="45px" shape="circle"></u--image>
			</view>
			<view class="album__content u-flex-1 u-m-l-10">
				<view class="u-m-b-20">
					<u--text :text="origin.name" type="primary" bold size="17"></u--text>
				</view>
				<view class="u-m-b-20">
					<u--text margin="0 0 8px 0" :text="origin.content" size="14"></u--text>
				</view>
				<view class="u-m-b-20" v-if="origin.imgList && origin.imgList.length > 0">
					<u-album :urls="origin.imgList"></u-album>
				</view> 
				<view class="album__content__footer u-flex u-flex-between u-flex-items-center u-p-r-5">
					<view class="item text-base u-font-26">{{$u.timeFrom(origin.publishtime*1000)}}</view>
					<view class="item" >
						<view class="u-flex u-flex-items-center u-font-28 text-base">
							<view class="more-btn u-flex u-flex-items-center " @click="likeBtn">
								<u-icon :name="'thumb-up'" :color="'#999'" size="19"></u-icon>
								<text class="u-p-l-5">点赞</text>
								<text class="u-p-l-5" v-if="origin.likenumber > 0">{{origin.likenumber}}</text>
							</view>
							<view class="more-btn u-flex u-flex-items-center u-m-l-30" @click="commentBtn">
								<u-icon :name="'chat'" :color="'#999'" size="19"></u-icon>
								<text class="u-p-l-5">评论</text>
								<text class="u-p-l-5" v-if="origin.chatnumber > 0">{{origin.chatnumber}}</text>
							</view>
							<view class="more-btn u-flex u-flex-items-center u-m-l-30" v-if="manager == 1" >
								<u-icon :name="'trash'" :color="'#999'" size="19"></u-icon>
								<text class="u-p-l-5">删除</text> 
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "groupMsgCard",
		props: {
			origin: {
				type: Object,
				default: () => {
					return {}
				}
			},
			manager: {
				type: String | Number,
				default: 0
			}
		},
		data() {
			return {
				show: false
			};
		},
		methods: {
			commentBtn() {
				this.$emit('comment', {data: this.origin})
			},
			likeBtn() {
				this.$emit('like', {data: this.origin})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.more-btns {
		width: 30px;
		height: 18px;
		border-radius: 4px;
		background-color: #eee;
		.custom-icon {
			color: #999;
		}
	}
	.more-w {
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		background-color: rgba(0,0,0,.8);
		border-radius: 4px;
	}
</style>
