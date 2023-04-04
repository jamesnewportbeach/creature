<script lang="ts">
  import Element from "$lib/App/Element.svelte";

  export let API;

  let form = {
    alias: null,
    password: null,
  };

  const inputClassNames =
    "mt-3 bg-blue-500 hover:bg-blue-500 rounded-md text-white text-sm py-1 uppercase px-3 shadow cursor-pointer select-none";
</script>

<Element {API} on:sendEvent tagName="form" className="p-3">
  <Element {API} on:sendEvent tagName="fieldset">
    <Element
      {API}
      on:sendEvent
      bind:value={form.alias}
      tagName="input"
      type="text"
      id="alias"
      autocomplete="off"
      label="Username"
    />

    <Element
      {API}
      on:sendEvent
      bind:value={form.password}
      tagName="input"
      type="password"
      id="password"
      autocomplete="off"
      label="Password"
    />

    <Element
      {API}
      on:sendEvent
      tagName="button"
      type="button"
      value="Register"
      className={inputClassNames}
      events={{
        click: { register: form },
      }}
    />

    <Element
      {API}
      on:sendEvent
      tagName="button"
      type="button"
      value="Log In"
      className={inputClassNames}
      events={{
        click: { login: form },
      }}
    />
  </Element>
</Element>
