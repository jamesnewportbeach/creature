const commonInputClass = "mb-1 text-xs"; // flex flex-col w-full
const buttonClassName = "p-2";

export const components = {
  "/components": {
    id: "/components",
    tagName: "div",
    className: "flex flex-wrap flex-row",
    itemClassName: "p-2 inline-block cursor-grab opacity-50 hover:opacity-100",
    dragEnabled: true,
    dragCopy: true,
    items: [
      { id: "div" },
      { id: "p" },
      { id: "button" },
      { id: "i" },
      { id: "ul" },
      { id: "ol" },
      { id: "li" },
      { id: "text" },
      { id: "number" },
      { id: "textarea" },
      { id: "tel" },
      { id: "email" },
      { id: "password" },
      { id: "color" },
      { id: "checkbox" },
      { id: "radio" },
      { id: "range" },
      { id: "datetime-local" },
      { id: "date" },
      { id: "time" },
      { id: "select" },
      { id: "h1" },
      { id: "h2" },
      { id: "h3" },
      { id: "h4" },
      { id: "h5" },
      { id: "h6" },
      { id: "form" },
    ],
  },

  div: {
    tagName: "span",
    title: "DIV Container",
    items: [{ id: "div_icon" }],
    className: buttonClassName,
    copyProps: { tagName: "div" },
  },
  div_icon: {
    tagName: "i",
    className: "fa-light fa-square-dashed",
  },

  p: {
    tagName: "span",
    title: "Paragraph",
    items: [{ id: "p_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-base font-light leading-relaxed mt-0 mb-5",
      tagName: "p",
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  },
  p_icon: {
    tagName: "i",
    className: "fa-light fa-paragraph",
  },

  button: {
    tagName: "span",
    title: "Button",
    items: [{ id: "button_icon" }],
    className: buttonClassName,
    copyProps: {
      className:
        "bg-blue-500 hover:bg-blue-500 rounded-md text-white text-sm p-2 shadow cursor-pointer select-none",
      tagName: "span",
      type: "button",
    },
  },
  button_icon: {
    tagName: "i",
    className: "fa-light fa-bullseye-pointer",
  },

  i: {
    tagName: "span",
    title: "Icon",
    items: [{ id: "button_icon" }],
    className: buttonClassName,
    copyProps: { tagName: "i", className: "fa-light fa-home" },
  },
  i_icon: {
    tagName: "i",
    className: "fa-light fa-chart-pyramid",
  },

  ul: {
    tagName: "span",
    title: "Unordered List",
    items: [{ id: "ul_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "list-disc pl-4 text-sm",
      tagName: "ul",
    },
  },
  ul_icon: {
    tagName: "i",
    className: "fa-light fa-list-ul",
  },

  ol: {
    tagName: "span",
    title: "Ordered List",
    items: [{ id: "ol_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "list-decimal pl-4 text-sm",
      tagName: "ol",
    },
  },
  ol_icon: {
    tagName: "i",
    className: "fa-light fa-list-ol",
  },

  li: {
    tagName: "span",
    title: "List Item",
    items: [{ id: "li_icon" }],
    className: buttonClassName,
    copyProps: { tagName: "li" },
  },
  li_icon: {
    tagName: "i",
    className: "fa-light fa-block-quote",
  },

  text: {
    tagName: "span",
    title: "Text Input",
    items: [{ id: "text_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "text",
      label: "Text",
      autocomplete: "off",
      className: commonInputClass,
    },
  },
  text_icon: {
    tagName: "i",
    className: "fa-light fa-input-pipe",
  },

  number: {
    tagName: "span",
    title: "Number Input",
    items: [{ id: "number_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "number",
      label: "Number",
      autocomplete: "off",
      className: commonInputClass,
    },
  },
  number_icon: {
    tagName: "i",
    className: "fa-light fa-input-numeric",
  },

  textarea: {
    tagName: "span",
    title: "Text Area",
    items: [{ id: "textarea_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "textarea",
      label: "Comments",
      autocomplete: "off",
      className: commonInputClass,
    },
  },
  textarea_icon: {
    tagName: "i",
    className: "fa-light fa-align-justify",
  },

  tel: {
    tagName: "span",
    title: "Phone Input",
    items: [{ id: "tel_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "tel",
      label: "Phone",
      autocomplete: "off",
      className: commonInputClass,
    },
  },
  tel_icon: {
    tagName: "i",
    className: "fa-light fa-phone",
  },

  email: {
    tagName: "span",
    title: "Email Input",
    items: [{ id: "email_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "email",
      label: "Email",
      autocomplete: "off",
      className: commonInputClass,
    },
  },
  email_icon: {
    tagName: "i",
    className: "fa-light fa-at",
  },

  password: {
    tagName: "span",
    title: "Password Input",
    items: [{ id: "password_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "password",
      label: "Password",
      autocomplete: "new-password",
      className: commonInputClass,
    },
  },
  password_icon: {
    tagName: "i",
    className: "fa-light fa-key",
  },

  color: {
    tagName: "span",
    title: "Color Input",
    items: [{ id: "color_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "color",
      label: "Color",
      className: commonInputClass,
    },
  },
  color_icon: {
    tagName: "i",
    className: "fa-light fa-eye-dropper",
  },

  checkbox: {
    tagName: "span",
    title: "Checkbox",
    items: [{ id: "checkbox_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "checkbox",
      label: "Checkbox",
    },
  },
  checkbox_icon: {
    tagName: "i",
    className: "fa-light fa-square-check",
  },

  radio: {
    tagName: "span",
    title: "Radio Button",
    items: [{ id: "radio_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "radio",
      label: "Radio",
    },
  },
  radio_icon: {
    tagName: "i",
    className: "fa-light fa-circle-dot",
  },

  range: {
    tagName: "span",
    title: "Slider",
    items: [{ id: "range_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "range",
      label: "Slider",
      className: commonInputClass,
    },
  },
  range_icon: {
    tagName: "i",
    className: "fa-light fa-slider",
  },

  "datetime-local": {
    tagName: "span",
    title: "Date/Time Input",
    items: [{ id: "datetime_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "datetime-local",
      label: "Date",
      className: commonInputClass,
    },
  },
  datetime_icon: {
    tagName: "i",
    className: "fa-light fa-calendar-clock",
  },

  date: {
    tagName: "span",
    title: "Date Input",
    items: [{ id: "date_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "date",
      label: "Date",
      className: commonInputClass,
    },
  },
  date_icon: {
    tagName: "i",
    className: "fa-light fa-calendar-days",
  },

  time: {
    tagName: "span",
    title: "Time Input",
    items: [{ id: "time_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "input",
      type: "time",
      label: "Time",
      className: commonInputClass,
    },
  },
  time_icon: {
    tagName: "i",
    className: "fa-light fa-clock",
  },

  select: {
    tagName: "span",
    title: "Select",
    items: [{ id: "select_icon" }],
    className: buttonClassName,
    copyProps: {
      tagName: "select",
      label: "Choose one",
      className: commonInputClass,
      buttonIcon: "fa-light fa-caret-down",
      items: {
        one: { value: 1, label: "One" },
        two: { value: 2, label: "Two" },
        three: { value: 3, label: "Threesome" },
      },
    },
  },
  select_icon: {
    tagName: "i",
    className: "fa-light fa-list-dropdown",
  },

  h1: {
    tagName: "span",
    title: "H1",
    items: [{ id: "h1_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-6xl mt-0 mb-6",
      tagName: "h1",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h1_icon: {
    tagName: "i",
    className: "fa-light fa-h1",
  },

  h2: {
    tagName: "span",
    title: "H2",
    items: [{ id: "h2_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-5xl font-normal leading-normal mt-0 mb-5",
      tagName: "h2",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h2_icon: {
    tagName: "i",
    className: "fa-light fa-h2",
  },

  h3: {
    tagName: "span",
    title: "H3",
    items: [{ id: "h3_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-4xl font-normal leading-normal mt-0 mb-2",
      tagName: "h3",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h3_icon: {
    tagName: "i",
    className: "fa-light fa-h3",
  },

  h4: {
    tagName: "span",
    title: "H4",
    items: [{ id: "h4_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-3xl font-normal leading-normal mt-0 mb-2",
      tagName: "h4",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h4_icon: {
    tagName: "i",
    className: "fa-light fa-h4",
  },

  h5: {
    tagName: "span",
    title: "H5",
    items: [{ id: "h5_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-2xl font-normal leading-normal mt-0 mb-2",
      tagName: "h5",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h5_icon: {
    tagName: "i",
    className: "fa-light fa-h5",
  },

  h6: {
    tagName: "span",
    title: "H6",
    items: [{ id: "h6_icon" }],
    className: buttonClassName,
    copyProps: {
      className: "text-xl font-normal leading-normal mt-0 mb-2",
      tagName: "h6",
      value: "Lorem ipsum dolor sit amet",
    },
  },
  h6_icon: {
    tagName: "i",
    className: "fa-light fa-h6",
  },

  form: {
    tagName: "span",
    title: "Form",
    items: [{ id: "form_icon" }],
    className: buttonClassName,
    copyProps: { tagName: "form" },
  },
  form_icon: {
    tagName: "i",
    className: "fa-light fa-input-pipe",
  },
};

/*
export const baseComponents = [
  {
    tagName: "div",
    title: "Diagram",
    buttonIcon: "fa-light fa-diagram-project",
  },

  {
    tagName: "div",
    title: "Grid",
    buttonIcon: "fa-light fa-table",
  },

  {
    tagName: "div",
    title: "Video",
    buttonIcon: "fab fa-youtube",
  },
];
*/
