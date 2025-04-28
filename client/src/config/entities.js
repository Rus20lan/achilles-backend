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
        required: true,
        isVisible: true,
      },
      full_name: {
        type: "textarea",
        label: "Наименование",
        priority: 2,
        isVisible: true,
        required: true,
      },
      title_code: {
        type: "text",
        label: "Код",
        priority: 2,
        isVisible: true,
        required: true,
        // validate: (value) => {
        //   if (!Number.isInteger(value)) {
        //     return 'Не число';
        //   }
        //   return null;
        // },
      },
    },
  },
  design: {
    fields: {
      id: {
        type: "number",
        label: "ИД",
        priority: 3,
        isVisible: false,
      },
      brevis: {
        type: "text",
        label: "Кр.наименование",
        priority: 1,
        required: true,
        isVisible: true,
      },
      full_name: {
        type: "textarea",
        label: "Наименование",
        priority: 2,
        isVisible: true,
        required: true,
      },
      mark: {
        type: "text",
        label: "Марка",
        priority: 2,
        isVisible: true,
        required: true,
      },
      code: {
        type: "text",
        label: "Шифр",
        priority: 3,
        isVisible: true,
        required: true,
      },
    },
  },
  resource: {
    fields: {
      id: {
        type: "number",
        priority: 3,
        isVisible: false,
      },
      name: {
        type: "text",
        label: "Наименование",
        priority: 1,
        required: true,
        isVisible: true,
      },
      unit: {
        type: "text",
        label: "Ед.изм",
        priority: 2,
        required: true,
        isVisible: true,
      },
    },
  },
  fact: {
    fields: {
      id: {
        type: "number",
        label: "ИД",
        priority: 3,
        isVisible: false,
      },
      dateString: {
        type: "date",
        priority: 1,
        label: "Дата",
        isVisible: true,
        required: true,
      },
      brevis: {
        type: "text",
        label: "Проект",
        priority: 1,
        isVisible: true,
        required: true,
      },
      name: {
        type: "text",
        label: "Ресурс",
        priority: 1,
        isVisible: true,
        required: true,
      },
      fact: {
        type: "number",
        priority: 2,
        label: "Факт",
        isVisible: true,
        required: true,
      },
    },
  },
};
