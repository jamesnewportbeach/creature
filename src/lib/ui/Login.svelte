<script>
	import { privateStore, userStore } from '$lib/stores/gun/store';
	import { page } from '$app/stores';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';
	import Toast from '$lib/common/Toast.svelte';

	$: isLogin = true;
	$: isError = false;
	$: errorText = '';
	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : '';

	let formDataLogin = {
			email: { label: 'Email', type: 'email', value: 'bostondevin@hotmail.com' },
			password: { label: 'Password', type: 'password', value: 'Appleisdumb1' }
		},
		formDataRegister = {
			'first-name': { label: 'First Name', type: 'text', value: null },
			'last-name': { label: 'Last Name', type: 'text', value: null },
			email: { label: 'Email', type: 'email', value: null },
			password: { label: 'Password', type: 'password', value: null }
		};

	const signIn = () => {
			privateStore.login(formDataLogin.email.value, formDataLogin.password.value, tenant, (res) => {
				// console.log(res);
			});
		},
		register = (e) => {
			const d = e.detail;
			privateStore.register(
				{
					first_name: formDataRegister['first-name'].value,
					last_name: formDataRegister['last-name'].value,
					alias: formDataRegister.email.value,
					password: formDataRegister.password.value,
					tenant
				},
				(res) => {
					if (res.err) {
						errorText = res.err;
						isError = true;
					}
				}
			);
		};
</script>

{#if !$userStore}
	{#if isLogin}
		<Form bind:data={formDataLogin} on:submit={signIn}>
			<div class="mt-3 text-right">
				<a
					href="./"
					class="mr-3"
					on:click={() => {
						isLogin = false;
					}}>Not a member? Sign up FREE</a
				>
				<Button classNames="inline-block" on:buttonClick={signIn}>Log in</Button>
			</div>
		</Form>
	{:else}
		<Form bind:data={formDataRegister} on:submit={register}>
			<div class="mt-3 text-right">
				<a
					href="./"
					class="mr-3"
					on:click={() => {
						isLogin = true;
					}}>Already a member? Login</a
				>
				<Button classNames="inline-block" on:buttonClick={register}>Sign up</Button>
			</div>
		</Form>
	{/if}

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
