<script>
	import { privateStore, userStore } from '$lib/stores/gun/gunStore';
	import { t } from '$lib/stores/translations/i18n';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';
	import Toast from '$lib/common/Toast.svelte';

	$: isError = false;
	$: errorText = '';

	const submit = (e) => {
		const d = e.detail;
		privateStore.register(
			formData.register_alias.value,
			formData.register_password.value,
			(res) => {
				if (res.err) {
					errorText = res.err;
					isError = true;
				}
			}
		);
	};

	let formData = {
		register_alias: { label: 'Email', type: 'email', value: 'bostondevin@hotmail.com' },
		register_password: { label: 'Password', type: 'password', value: 'Appleisdumb1' }
	};
</script>

{#if !$userStore}
	<Form bind:data={formData} on:submit={submit}>
		<div class="mt-4 text-right">
			<!-- a href="/login" class="mr-10">Log in</a -->
			<Button type="submit" on:buttonClick={submit}>Register</Button>
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
