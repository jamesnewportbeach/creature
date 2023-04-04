<script lang="ts">
	import { logout, userPub, userEmail, t, selectedTab } from '$lib/stores/gun/store';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';

	const toggleSignIn = () => {
			if ($userPub) {
				logout();
			} else {
				selectTab({ id: 'login', path: '/login' });
			}
		},
		selectTab = (item) => {
			if (item.path) goto(item.path);
			selectedTab.set(item.id);
		};
</script>

<Tooltip text={$userPub ? $t('Log out') + ' ' + $userEmail : $t('Log in')}>
	<Button ghost={true} on:click={toggleSignIn}>
		<Icon classNames="fas fa-sign-{$userPub ? 'out' : 'in'}" />
	</Button>
</Tooltip>
