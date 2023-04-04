<script>
	import { privateStore, userStore } from '$lib/stores/gun/store';
	import { t } from '$lib/stores/translations/i18n';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';
	import Toast from '$lib/common/Toast.svelte';

	$: isError = false;
	$: errorText = '';

	const submit = (e) => {
		const d = e.detail;
		privateStore.register(formData.alias.value, formData.password.value, (res) => {
			if (res.err) {
				errorText = res.err;
				isError = true;
			}
		});
	};

	let formData = {
		alias: { label: 'Email', type: 'email', value: 'bostondevin@hotmail.com' },
		password: { label: 'Password', type: 'password', value: 'Appleisdumb1' }
	};
</script>

{#if !$userStore}
	<Form bind:data={formData} on:submit={submit}>
		<div class="mt-3 text-right">
			<Button classNames="inline-block" type="submit" on:buttonClick={submit}>Register</Button>
		</div>
	</Form>

	<Toast
		show={isError}
		on:cancel={() => {
			isError = false;
			errorText = '';
		}}
	>
		{errorText}
	</Toast>
{/if}
