<script>
	import { privateStore, userStore } from '$lib/stores/gun/gunStore';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';
	import Toast from '$lib/common/Toast.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Icon from '$lib/common/Icon.svelte';

	$: isError = false;
	$: errorText = '';

	const signIn = () => {
			console.log('Logging in...');
			console.log(formData);
			privateStore.login(formData.login_alias.value, formData.login_password.value, (res) => {
				console.log(res);
			});
		},
		signOut = () => {
			privateStore.logout(() => {
				console.log('logged out!!!');
			});
		};

	let formData = {
		login_alias: { label: 'Email', type: 'email', value: 'bostondevin@hotmail.com' },
		login_password: { label: 'Password', type: 'password', value: 'Appleisdumb1' }
	};
</script>

{#if $userStore}
	<Tooltip text="Log out {$userStore.alias}">
		<Button ghost={true} on:buttonClick={signOut}>
			<Icon classNames="fas fa-sign-out" />
		</Button>
	</Tooltip>
{:else}
	<Form bind:data={formData} on:submit={signIn}>
		<div class="mt-4">
			<Button type="button" on:buttonClick={signIn}>Log in</Button>
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
