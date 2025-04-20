export const ENTITY_CONFIG = {
  title: {
    fields: {
      titleId: {
        type: 'number',
        label: 'ИД',
        priority: 3,
        isVisible: false,
      },
      brevis: {
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        required: true,
        isVisible: true,
      },
      full_name: {
        type: 'textarea',
        label: 'Наименование',
        priority: 2,
        isVisible: true,
        required: true,
      },
      title_code: {
        type: 'text',
        label: 'Код',
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
};
