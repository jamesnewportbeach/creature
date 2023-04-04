<script>
	import { privateStore } from '$lib/stores/gun/gunStore';
	import Form from '$lib/common/Form.svelte';
	import Button from '$lib/common/Button.svelte';

	const signIn = (e) => {
			// const d = e.detail;
			console.log('Logging in...');
			console.log(formData);
			privateStore.login(formData.login_alias, formData.login_password, (res) => {
				console.log(res);
			});
		},
		changeValues = (e) => {
			const d = e.detail;
			console.log(d);
		};

	let formData = {
		login_alias: { label: 'Email', type: 'email', value: 'bostondevin@hotmail.com' },
		login_password: { label: 'Password', type: 'password', value: 'Appleisdumb1' }
	};
</script>

<Form bind:data={formData} on:valuesChanged={changeValues} on:submit={signIn}>
	<div class="mt-4">
		<a href="/register" class="mr-10">Register</a>
		<Button type="button" on:buttonClick={signIn}>Log in</Button>
	</div>
</Form>
