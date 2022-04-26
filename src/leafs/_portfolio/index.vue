<template>
	<section class="container">
		<el-row justify="space-between">
			<nav class="path">{{superior}}</nav>
			<el-button @click="setPortfolio" type="primary">添加文件夹</el-button>
		</el-row>
		<el-row justify="space-between">
			<div>
				<el-button size="small" @click="upperLevel">返回上一级</el-button>
				<el-button size="small" type="warning" @click="unLogin">切换账号</el-button>
			</div>
			<p style="padding-top:12px;font-size:12px;color: #fff"><i>tip :</i> 长按两秒删除目录或文件</p>
		</el-row>
		<article class="portfolio">
			<figure @touchstart="getTouchStart(port, 'port')" @touchend="getTouchEnd" v-for="(port, i) in portfolioList" :key="i">
				<img @click="openPortfolio(port)" :src="require('@/assets/logo.png')" alt="">
				<figcaption>
					{{ port.substring(port.lastIndexOf("/") + 1, port.length) }}
				</figcaption>
			</figure>
			<figure @touchstart="getTouchStart(pack, 'pack')" @touchend="getTouchEnd" v-for="(pack, i) in packageList" :key="i">
				<img @click="openPackage(pack)" :src="pack"  alt="">
				<figcaption>
					{{ pack.substring(pack.lastIndexOf("/") + 1, pack.length) }}
				</figcaption>
			</figure>
		</article>
		<el-upload
		    :on-change="getPackages"
			:limit="6"
			class="upload"
			drag
			:data="{
			  uid: userInfo.userName,
			  superior
			}"
			action="http://124.220.16.124:8099/upload/setPackages"
			multiple
		>
			<el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="upload__text">点击或者拖拽你的软件包进来</div>
			<template #tip>
				<div class="upload__tip">
					大文件上传会有些慢，上传中请不要关闭此页面
				</div>
			</template>
		</el-upload>
	</section>
	<!-- 登陆弹窗 -->
    <dialogLogin
        :dialogVisible="loginDialog"
        :changeRegister="changeRegisterDialog"
        :changeLoginDialog="changeLoginDialog"
        />
    <!-- 注册弹窗 -->
    <dialogRegister
        :dialogVisible="registerDialog"
        :changeLogin="changeLoginDialog"
        :changeRegisterDialog="changeRegisterDialog"
    />
</template>

<style lang="scss" scoped>
@import "@/styles/style.scss";
.path {
	color: aliceblue;
	max-width: 60vw;
	@extend %OVT;
}

.container {
	-webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
	@extend %Max;
	background: midnightblue;
	padding: 4% 4% 10%;
	overflow-y: auto;
	.portfolio {
		height: 54vh;
		@include BR(8px);
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		margin: 2vh 0;
		background: mintcream;
		figure {
			img {
				@include WH(8vh);
				margin: 6px 0;
			}
			// border: 10px solid rgb(163, 163, 160);
			// background:rgb(125, 184, 125) ;
			@include BR(10px);
			font-size: 14px;
			font-family:monospace;
			padding: 6px 0 12px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 25%;
			figcaption {
				width: 80%;
				@extend %OVT;
				text-align: center;
			}
		}
	}
	.upload ::v-deep .el-upload-dragger {
		background-color: rgb(110, 207, 219);
		letter-spacing: 1px;
		font-size: 14px;
	}
	.upload {
		&__tip {
			font-size: 14px;
			color: cornsilk;
			padding-top: 10px;
		}
		&__text {
			color: rgb(83, 89, 94);
		}
	}
}
</style>
<script src="./index.ts" />
