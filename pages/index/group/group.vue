<template>
	<view class="w u-flex u-flex-column" :style="{
		backgroundColor: themeConfig.pageBg,
		transition: 'all .3s'
	}">
		<view class="group-header">
			<view class="group-header-bg"></view>
			<view class="group-header-main">
				<view class="u-flex" style="height: 60px;">
					<view class="item"> 
						<u--image 
						showLoading 
						src="https://cdn.uviewui.com/uview/album/1.jpg" 
						width="60px" 
						height="60px"  
						></u--image>
					</view>
					<view class="item u-flex-1 u-flex u-flex-column u-flex-between u-m-l-30">
						<view class="u-font-36 text-dark u-p-t-10">PTA行业交流行业交流</view>
						<view class="u-font-28 text-light u-flex ">
							<view class="u-flex">
								<u-icon name="eye-fill" color="#fff"></u-icon>
								<view class="">
									
								</view>	
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="group-main">
			
		</view>
		<u-safe-bottom></u-safe-bottom>
		<menusBar activeIndex="0" theme="chemnet"></menusBar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.w {
		height: 100vh;
		padding-bottom: 50px;
		box-sizing: border-box;
	}
	.group-main {
		flex: 1; 
		overflow: hidden;
	}
	.group-header {
		
	}

</style>
