<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ref, onMounted } from "vue";
import API from "@/api";

defineProps<{}>();
let list = ref([]);

onMounted(() => {
	getPackages()
});
const getPackages = async () => {
	const { data } = await API.getPackages({});
	list.value = data;
}
</script>

<template>
	<section class="packages">
		<article class="files">
			<a class="files__item" :href="ev" v-for="(ev, i) in list" :key="i">
				<img  class="img" :src="ev" @error="(e)=>(e.target.src='http://124.220.16.124:8099/files/noteFiles/icon.png')" alt="" />
				<div class="txt">
					{{ ev.substring(ev.lastIndexOf("/") + 1, ev.length) }}
				</div>
			</a>
		</article>
		<el-upload
		    :on-success="getPackages"
			class="upload"
			drag
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
</template>

<style lang="scss" scoped>
@import "@/styles/style.scss";
.packages {
	@include BR(12px);
	height: calc(100vh - 48px);
	margin: 24px;
	background: rgb(81, 83, 78);
	.upload {
		margin:0 1rem;
		::v-deep .el-upload-dragger {
			width: 14rem;
			font-size: .7rem;
			color:linen;
			letter-spacing: 1px;
			background-color: #458686 !important;
		}
		padding: 24px 36px;
		@include BR(12px);
		background: rgb(194, 202, 187);
		&__text {
		}
		&__tip {
			font-size: .7rem;
			white-space: nowrap;
			color:olivedrab;
			font-family:Georgia, 'Times New Roman', Times, serif;
			padding-top: 12px;
		}
	}
	.files {
		display: grid;
		color: #fff;
		overflow-y: auto;
		grid-template-columns: repeat(4, calc((100vw - 72px) / 4));
		padding: 2rem 12px 0;
		&__item {
			background: rgb(96, 105, 86);
			border: 3px solid rgb(112, 128, 69);
			@include BR(12px);
			@include WH(calc((100vw - 130px) / 4));
			margin-left: 6px;
			@extend %Flex-Center-Center;
			position: relative;
			margin-bottom: 2.2rem;
			.img {
				// width: 3rem;
				// max-height: 3rem;
				// height: auto;
				width: 80%;
				height: 80%;
			}
			.txt {
				font-size: .8rem;
				@extend %OVT;
				width: 100%;
				font-family: Cambria, Cochin, Georgia, Times, "Times New Roman",
					serif;
				position: absolute;
				left: 0;
				top: calc(100% + .5rem);
			}
		}
	}
}
</style>
