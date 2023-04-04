<script>
	import { privateStore, userStore } from '$lib/stores/gun/gunStore';
	import { t } from '$lib/stores/translations/i18n';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';
	import LogInButton from './LogInButton.svelte';

	const submit = (e) => {
			const d = e.detail;
			privateStore.register(formData.register_alias, formData.register_password, (res) => {
				console.log(res);
			});
		},
		formData = {
			register_alias: { label: 'email', type: 'email' },
			register_password: { label: 'password', type: 'password' }
		};
</script>

{#if $userStore}
	<LogInButton />
{:else}
	<Form data={formData} on:submit={submit}>
		<div class="mt-4 text-right">
			<a href="/login" class="mr-10">{$t('Log in')}</a>
			<Button type="submit">{$t('Register')}</Button>
		</div>
	</Form>
{/if}
