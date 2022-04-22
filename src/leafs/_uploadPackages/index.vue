<script setup lang="ts">
import { ref } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
defineProps<{ }>();

</script>

<template>
	<el-upload
		class="upload"
		drag
		action="http://124.220.16.124:8099/upload/setPackages"
		multiple
	>
		<el-icon class="el-icon--upload"><upload-filled /></el-icon>
		<div class="upload__text">
		    点击或者拖拽你的软件包进来
		</div>
		<template #tip>
		<div class="upload__tip">
			大文件上传会有些慢，上传中请不要关闭此页面
		</div>
		</template>
	</el-upload>
</template>

<style lang="scss" scoped>
.upload {
	padding: 36px;
	&__text {

	}
	&__tip {
		font-size:12px;
		line-height: 200%;
	}
}
</style>
