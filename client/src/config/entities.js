export const ENTITY_CONFIG = {
  title: {
    fields: {
      titleId: {
        type: 'number',
        label: 'ИД',
        priority: 3,
      },
      brevis: {
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        require: true,
      },
      full_name: {
        type: 'text',
        label: 'Наименование',
        priority: 2,
      },
      title_code: {
        type: 'text',
        label: 'Титул',
        priority: 2,
      },
    },
  },
};
