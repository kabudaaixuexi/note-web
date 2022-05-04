import {
	defineComponent,
	inject,
	onMounted,
	onUnmounted,
	reactive,
	ref,
	toRefs,
	getCurrentInstance,
} from "vue";
import foundEdit from 'xs-editor'

export default defineComponent({
	components: {
	},
	setup() {
		const state: any = reactive({

		});

		onMounted(() => {
			const a = document.querySelector('#test')
		console.log(a);

		console.log(foundEdit(a, {
			onChange: (e: any,c:any) => {
				console.log(e, c);
			}
		}));
		});
		return {
			...toRefs(state)
		};
	},
});
