export const ENTITY_CONFIG = {
  title: {
    fields: {
      titleId: {
        type: "number",
        label: "ИД",
        priority: 3,
        isVisible: false,
      },
      brevis: {
        type: "text",
        label: "Кр.наименование",
        priority: 1,
        require: true,
        isVisible: true,
      },
      full_name: {
        type: "text",
        label: "Наименование",
        priority: 2,
        isVisible: true,
      },
      title_code: {
        type: "text",
        label: "Код",
        priority: 2,
        isVisible: true,
      },
    },
  },
};
