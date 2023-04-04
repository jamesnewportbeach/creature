<script>
	import { locales, t, userLanguage } from '$lib/stores/gun/store';
</script>

<select
	on:change={({ target }) => userLanguage.set(target.value)}
	style="width: 120px"
	class="select select-ghost"
	>{#each locales as l}
		<option value={l} selected={l === $userLanguage}>{$t('language.' + l)}</option>
	{/each}</select
>
