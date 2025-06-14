import { useSelector } from 'react-redux';
import { getIdEntity } from '../services/getIdEntity';

export const ENTITY_CONFIG = {
  title: {
    fields: {
      titleId: {
        type: 'number',
        label: 'ИД',
        priority: 3,
        isVisible: false,
        isFilter: false,
      },
      brevis: {
        index: 'brevis',
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        required: true,
        isVisible: true,
        isFilter: true,
        placeholder: 'Пример: ГК',
      },
      full_name: {
        type: 'textarea',
        label: 'Наименование',
        priority: 2,
        isVisible: true,
        required: true,
        isFilter: false,
        placeholder: 'Пример: Главный корпус',
      },
      title_code: {
        index: 'title_code',
        type: 'text',
        label: 'Код',
        priority: 2,
        isVisible: true,
        required: true,
        isFilter: true,
        placeholder: 'Пример: 1',
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
        type: 'number',
        label: 'ИД',
        priority: 3,
        isVisible: false,
        isFilter: false,
      },
      brevis: {
        index: 'brevis',
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        required: true,
        isVisible: true,
        isFilter: true,
        placeholder: 'Пример: 1-ОЗР',
      },
      full_name: {
        type: 'textarea',
        label: 'Наименование',
        priority: 2,
        isVisible: true,
        isFilter: false,
        required: true,
        placeholder: 'Пример: Котлован под строительство главного корпуса',
      },
      mark: {
        index: 'mark',
        type: 'text',
        label: 'Марка',
        priority: 2,
        isVisible: true,
        isFilter: true,
        required: true,
        placeholder: 'Пример: ОЗР',
      },
      code: {
        index: 'code',
        type: 'text',
        label: 'Шифр',
        priority: 3,
        isVisible: true,
        isFilter: true,
        required: true,
        placeholder: 'Пример: 05КА-П009-РТК-1-ОЗР',
      },
    },
  },
  resource: {
    fields: {
      id: {
        type: 'number',
        priority: 3,
        isVisible: false,
        isFilter: false,
      },
      name: {
        index: 'name',
        type: 'text',
        label: 'Наименование',
        priority: 1,
        required: true,
        isVisible: true,
        placeholder: 'Пример: Бетон',
        isFilter: true,
      },
      unit: {
        index: 'unit',
        type: 'text',
        label: 'Ед.изм',
        priority: 2,
        required: true,
        isVisible: true,
        placeholder: 'Пример: м3',
        isFilter: true,
      },
    },
  },
  volume: {
    fields: {
      id: {
        type: 'number',
        label: 'ИД',
        priority: 3,
        isVisible: false,
        isFilter: false,
      },
      value: {
        index: 'value',
        type: 'number',
        label: 'Объем',
        priority: 1,
        required: true,
        isVisible: true,
        isFilter: true,
        placeholder: 'Пример: 1',
      },
      title: {
        index: 'title',
        type: 'autocomplete',
        label: 'Титул',
        priority: 2,
        isVisible: true,
        isFilter: true,
        placeholder: 'Пример: ГК',
        getOptions() {
          const titles = useSelector((state) => state.titles?.data);
          return titles ? titles : null;
        },
        getId(titleArray, searchField, searchWord) {
          return getIdEntity(titleArray, searchField, searchWord);
        },
      },
    },
  },
  fact: {
    fields: {
      id: {
        type: 'number',
        label: 'ИД',
        priority: 3,
        isVisible: false,
      },
      date: {
        type: 'date',
        priority: 1,
        label: 'Дата',
        isVisible: true,
        required: true,
      },
      brevis: {
        type: 'autocomplete',
        label: 'Проект',
        priority: 1,
        isVisible: true,
        required: true,
        getOptions() {
          const designs = useSelector((state) => state.designs?.data);
          return designs ? designs : null;
        },
        getId(designArray, searchField, searchWord) {
          return getIdEntity(designArray, searchField, searchWord);
        },
      },
      name: {
        type: 'autocomplete',
        label: 'Ресурс',
        priority: 1,
        isVisible: true,
        required: true,
        getOptions() {
          const resources = useSelector((state) => state.resources?.data);
          return resources ? resources : null;
        },
        getId(resourceArray, searchField, searchWord) {
          return getIdEntity(resourceArray, searchField, searchWord);
        },
      },
      fact: {
        type: 'number',
        priority: 2,
        label: 'Факт',
        isVisible: true,
        required: true,
        validate: (value) => {
          const number = +value;
          if (isNaN(number)) {
            return 'Не число';
          }
          if (number <= 0) return 'Факт должен быть больше 0';
        },
      },
    },
  },
};
export const ENTITY_LINKS = [
  { index: 1, name: 'Титула', entity: 'title', url: '/api/titles' },
  { index: 2, name: 'Документация', entity: 'design', url: '/api/designs' },
  { index: 3, name: 'Ресурсы', entity: 'resource', url: '/api/resources' },
  { index: 4, name: 'Объемы', entity: 'volume', url: '/api/volumes' },
  { index: 5, name: 'Факт', entity: 'fact', url: '/api/facts' },
];
