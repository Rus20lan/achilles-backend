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
      },
      brevis: {
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        required: true,
        isVisible: true,
        placeholder: 'Пример: ГК',
      },
      full_name: {
        type: 'textarea',
        label: 'Наименование',
        priority: 2,
        isVisible: true,
        required: true,
        placeholder: 'Пример: Главный корпус',
      },
      title_code: {
        type: 'text',
        label: 'Код',
        priority: 2,
        isVisible: true,
        required: true,
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
      },
      brevis: {
        type: 'text',
        label: 'Кр.наименование',
        priority: 1,
        required: true,
        isVisible: true,
        placeholder: 'Пример: 1-ОЗР',
      },
      full_name: {
        type: 'textarea',
        label: 'Наименование',
        priority: 2,
        isVisible: true,
        required: true,
        placeholder: 'Пример: Котлован под строительство главного корпуса',
      },
      mark: {
        type: 'text',
        label: 'Марка',
        priority: 2,
        isVisible: true,
        required: true,
        placeholder: 'Пример: ОЗР',
      },
      code: {
        type: 'text',
        label: 'Шифр',
        priority: 3,
        isVisible: true,
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
      },
      name: {
        type: 'text',
        label: 'Наименование',
        priority: 1,
        required: true,
        isVisible: true,
        placeholder: 'Пример: Бетон',
      },
      unit: {
        type: 'text',
        label: 'Ед.изм',
        priority: 2,
        required: true,
        isVisible: true,
        placeholder: 'Пример: м3',
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
        getIdDesign(designArray, searchField, searchWord) {
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
        getIdResource(resourceArray, searchField, searchWord) {
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
