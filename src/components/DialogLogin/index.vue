<template>
	<el-dialog
	    custom-class="login-dialog"
        v-model="dialogVisible"
        title="请先登录"
        :modal="true"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        width="60%"
    >
        <el-autocomplete
            v-model="value"
            :fetch-suggestions="querySearch"
            class="inline-input"
            placeholder="请输入您的昵称"
        />
        <el-input v-model="password" type="password" placeholder="请输入密码" />
        <template #footer>
            <el-button size="small" @click="changeRegister(true)">注册账户</el-button>
            <el-button size="small" type="primary" @click="chatLogin">确认登录</el-button>
        </template>
    </el-dialog>
</template>

<script src="./index.ts" />

<style lang="scss">
.inline-input {
    width: 100%;
    margin-bottom: 12px;
}
.login-dialog {
	min-height: 280px;
	.el-input__inner {
		min-height: 40px;
	}
	.el-dialog__footer {
		display: flex;
	}
}
.el-autocomplete__popper {
    z-index: 4202 !important;
}
</style>
