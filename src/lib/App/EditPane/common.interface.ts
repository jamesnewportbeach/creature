export const defaultLinks = [
  /*        {
              href: "/manifest.json",
              rel: "manifest",
              crossorigin: "use-credentials",
          },*/
  {
    href: "/images/favicon/apple-touch-icon.png",
    rel: "apple-touch-icon",
    sizes: "180X180",
    type: "image/png",
  },
  {
    href: "/images/favicon/favicon-16x16.png",
    rel: "apple-touch-icon",
    sizes: "16x16",
    type: "image/png",
  },
  {
    href: "/images/favicon/favicon-32x32.png",
    rel: "apple-touch-icon",
    sizes: "32x32",
    type: "image/png",
  },
  {
    href: "/images/favicon/favicon.ico",
    rel: "icon",
    sizes: "16X16",
    type: "image/x-icon",
  },
  {
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "https://fonts.googleapis.com/css?family=Roboto+Mono",
    rel: "stylesheet",
    type: "text/css",
  },

  {
    href: "/node_modules/@fortawesome/fontawesome-free/css/fontawesome.css",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "/node_modules/@fortawesome/fontawesome-free/css/regular.css",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "/node_modules/@fortawesome/fontawesome-free/css/solid.css",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "/node_modules/@fortawesome/fontawesome-free/css/brands.css",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "/node_modules/flatpickr/dist/themes/dark.css",
    rel: "stylesheet",
    type: "text/css",
  },
  {
    href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons&display=swap",
    rel: "stylesheet",
    type: "text/css",
  },
];

export const defaultMetaNames = [
  {
    name: "theme-color",
    content: "#212121",
  },
  {
    name: "author",
    content: "Devin McQueeney",
  },
  {
    name: "description",
    content:
      "They multiply! Drag and drop web component development for the new age",
  },
  { name: "robots", content: "index, follow" },
  {
    name: "viewport",
    content: "width=device-width, initial-scale=1 ",
  },
  { name: "twitter:title", content: "Mogwai Labs" },
  { name: "twitter:site", content: "http://www.mogwailabs.com" },
  { name: "twitter:image", content: "/images/mogwai.jpg" },
  {
    name: "twitter:description",
    content:
      "They multiply! Drag and drop web component development for the new age",
  },
  { name: "twitter:creator", content: "@bostondevin" },
];

export const defaultMetaProperties = [
  {
    name: "og:description",
    content:
      "They multiply! Drag and drop web component development for the new age",
  },
  { name: "og:image", content: "/images/mogwai.jpg" },
  { name: "og:local", content: "en_US" },
  { name: "og:site_name", content: "Mogwai Labs" },
  { name: "og:title", content: "Gizmo" },
  { name: "og:type", content: "website" },
  { name: "og:url", content: "http://www.mogwailabs.com" },
];

interface Item {
  id: string;
  isDndShadowItem?: boolean;
}

export const InputTypes = {
  span: { label: "Span" },
  text: { label: "Text" },
  textarea: { label: "Text Area" },
  number: { label: "Number" },
  tel: { label: "Phone" },
  password: { label: "Password" },
  color: { label: "Color" },
  email: { label: "Email" },
  date: { label: "Date" },
  "datetime-local": { label: "Date/Time" },
  time: { label: "Time" },
  checkbox: { label: "Checkbox" },
  radio: { label: "Radio" },
  range: { label: "Range" },
  file: { label: "File" },
  select: { label: "Select" },
};

export const ContainerTypes = {
  icon: { label: "Icon" },
  p: { label: "Paragraph" },
  legend: { label: "Legend" },
  label: { label: "Label" },
  h1: { label: "H1" },
  h2: { label: "H2" },
  h3: { label: "H3" },
  h4: { label: "H4" },
  h5: { label: "H5" },
  h6: { label: "H6" },
  div: { label: "Div" },
  form: { label: "Form" },
  fieldset: { label: "Fieldset" },
  article: { label: "Article" },
  section: { label: "Section" },
  header: { label: "Header" },
  nav: { label: "Nav" },
  aside: { label: "Aside" },
  main: { label: "Main" },
  footer: { label: "Footer" },
  button: { label: "Button" },
  a: { label: "Link" },
  ul: { label: "Unordered List" },
  ol: { label: "Ordered List" },
  li: { label: "List Item" },
};

export const ButtonTypes = {
  button: { label: "Button" },
  submit: { label: "Submit" },
  reset: { label: "Reset" },
};

export const formClasses = "grid grid-cols-3 gap-1 p-2";
export const outerClassName = "flex text-xs w-full mb-1 flex-col";
export const labelClassName = "flex text-xs opacity-50 mb-1";
export const inputClassName =
  "w-full break-all outline-none border dark:border-black/25 p-1 rounded break-all";

export function baseAttributes(node, params) {
  params.style && node.setAttribute("style", params.style);
  params.title && node.setAttribute("title", params.title);
  params.name && node.setAttribute("name", params.name);
  params.ariaLabel && node.setAttribute("aria-label", params.ariaLabel);
  params.ariaHidden && node.setAttribute("aria-hidden", params.ariaHidden);
  params.ariaDescribedBy &&
    node.setAttribute("aria-describedby", params.ariaDescribedBy);

  return {
    destroy() {},
  };
}

export interface ElementProperties {
  id?: string;
  parentId?: string;
  editorEnabled?: boolean;
  hovered?: boolean;
  layerHidden?: boolean;

  buttonType?: "button" | "reset" | "submit";
  _buttonIcon?: string;
  labelPath?: string;
  dataList?: any;
  _dataPath?: string;
  removeButton?: boolean;
  labelClassName?: string;
  inputContainerClassName?: string;
  inputClassName?: string;
  hint?: string;
  events?: any;

  items?: any;
  type?:
    | "img"
    | "text"
    | "textarea"
    | "select"
    | "number"
    | "tel"
    | "color"
    | "email"
    | "date"
    | "datetime-local"
    | "time"
    | "password"
    | "checkbox"
    | "radio"
    | "range"
    | "file"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span"
    | "p"
    | "small"
    | "legend"
    | "label"
    | "icon"
    | "img"
    | "video"
    | "picture"
    | "div"
    | "ol"
    | "ul"
    | "li"
    | "header"
    | "nav"
    | "main"
    | "aside"
    | "footer"
    | "fieldset"
    | "form"
    | "section"
    | "article"
    | "button"
    | "a"
    | "image"
    | "video";
  name?: string;
  value?: any;
  className?: string;
  style?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaHidden?: boolean;
  title?: string;
  href?: string;
  label?: string;

  alt?: string;
  for?: string;

  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  spellcheck?: boolean;

  placeholder?: string;
  autocomplete?: string;

  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}
