import { useContext, useEffect, useRef, useState } from 'react';
import { ENTITY_CONFIG } from '../../config/entities';
import './style.scss';
import PostgresApi from '../../services/PostgresApi';
import Modal from '../modal/Modal';
import { ModalContext } from '../authForm/AuthForm';
import { isEqual } from 'lodash-es';
import createObjectEditFields from '../../services/createObjectEditFields';
import { useSelector } from 'react-redux';
import AutoCompleteField from './AutoCompleteField';
import { Fact } from '../../services/FactApi';
import Loader from '../loader/Loader';
import { InstallerContext } from '../App/App';

const entityRus = {
  title: 'Титул',
  resource: 'Ресурс',
  design: 'Проект',
  fact: 'Факт',
};

const UniversalEntityForm = ({
  entityType,
  mode = 'create',
  entityId = null,
  valueId = null,
  onClose,
  onSuccess,
  onCancel,
}) => {
  const config = ENTITY_CONFIG[entityType];
  const [data, setData] = useState(null);
  const initData = useRef(null); // храниться изначальный объект
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [resultAction, setResultAction] = useState({
    message: '',
    status: false,
  });
  const designOptions = useSelector((state) => state.designs.data);
  const resourceOptions = useSelector((state) => state.resources.data);
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  // 1. Добавляем состояние для ошибок
  const [errors, setErrors] = useState({});
  // 2. Создаем функцию валидации
  const validateForm = () => {
    const newErrors = {};
    const fields = config.fields;

    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      const value = data[fieldName];
      const fieldErrors = [];
      // Проверка обязательных полей
      if (fieldConfig.required && !value?.toString().trim())
        fieldErrors.push(fieldConfig.errorMessage || 'Обязательное поле');
      // Кастомная проверка
      if (fieldConfig.validate) {
        const error = fieldConfig.validate(value);
        if (error) {
          fieldErrors.push(error);
        }
      }
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (mode !== 'create' && entityId) {
      const fethData = async () => {
        const postgresApi = new PostgresApi();
        try {
          let url = `/api/${entityType}/${entityId}`;
          if (valueId) {
            url += `/value/${valueId}`;
          }
          const res = await postgresApi.getEntity(url);
          if (!res.data) throw new Error();
          initData.current = createObjectEditFields(entityType, res.data);
          console.log('Данные из базы данных', res.data);
          setData(initData.current);
          setIsLoading(false);
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
        }
      };
      fethData();
    }
    if (mode === 'create') {
      initData.current = createObjectEditFields(entityType, null, mode);
      console.log('Данные в initData', initData.current);
      setData(initData.current);
      setIsLoading(false);
    }
  }, [entityId, mode, config]);

  // console.log('Данные для редактирования', data);

  useEffect(() => {
    if (resultAction.message) {
      setIsOpenModal(true);
      setTimeout(() => {
        setIsOpenModal(false);
      }, 1500);
    }
    if (resultAction.status) {
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  }, [resultAction]);

  // Обработчик события нажатия кнопки SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setResultAction({ message: 'Форма содержит ошибки', status: false });
      return;
    }
    let postData = createObjectEditFields(entityType, data);

    if (isEqual(initData.current, postData) && mode === 'edit') {
      setResultAction({ message: 'Изменения не внесены', status: false });
      return;
    }

    try {
      // Здесь будет логика отправки данных
      const postgresApi = new PostgresApi();
      const url = `/api/${entityType}/${entityId}`;
      let respond = null;
      console.log('postData', postData);

      if (entityType === 'fact' && (mode === 'create' || mode === 'edit')) {
        if (
          !isEqual(postData.brevis, initData.current.brevis) ||
          !isEqual(postData.name, initData.current.name)
        ) {
          postData['idDesign'] = config.fields['brevis'].getIdDesign(
            designOptions,
            'brevis',
            postData.brevis
          );
          postData['idResource'] = config.fields['name'].getIdResource(
            resourceOptions,
            'name',
            postData.name
          );
        } else {
          postData['idDesign'] = null;
          postData['idResource'] = null;
        }

        if (mode === 'create') {
          const date = new Date(postData.date);
          postData.id = date.getTime();
        }

        const newFact = new Fact(postData);
        postData = { ...postData, ...newFact };
      }

      switch (mode) {
        case 'create':
          console.log('Здесь будет создание сущности в базе');
          respond = await postgresApi.createEntity(
            `/api/${entityType}/create`,
            postData
          );
          break;
        case 'edit':
          respond = await postgresApi.putEntity(url, postData);
          break;
        case 'delete':
          if (entityType === 'fact') {
            respond = await postgresApi.deleteEntity(url, postData);
          } else {
            respond = await postgresApi.deleteEntity(url, postData);
          }
          break;
      }
      console.log('Ответ после обновления: ', respond);
      if (respond.message) {
        setResultAction({ message: respond.message, status: true });
      }
    } catch (error) {
      if (error.message) {
        setResultAction({ message: error.message, status: false });
      }
    }
  };

  const handleChange = (field, value) => {
    console.log('value', value);
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Обработчик события нажатия кнопки ОТМЕНА
  const handleClickOnCancel = () => {
    onCancel?.();
  };

  if (isLoading) return <Loader />;

  const warningLine =
    entityType !== 'fact' ? (
      <span className="error-message">
        {/* <span className="error-message__icon">&#9888;</span> */}
        {`При удалении ${entityRus[entityType]}(a) будут потеряны связанные данные`}
      </span>
    ) : null;

  return (
    <div className={`universal-form ${theme}-theme`}>
      <div className="universal-form__header">
        <h2>
          {mode === 'create' && `Создание: ${entityRus[entityType]}`}
          {mode === 'edit' && `Редактирование: ${entityRus[entityType]}`}
          {mode === 'delete' && 'Удаление'}
        </h2>
      </div>
      <form className="universal-form__body" onSubmit={handleSubmit}>
        {mode === 'edit' && (
          <>
            {Object.entries(config.fields)
              .filter(([, val]) => val.isVisible)
              .sort(([, a], [, b]) => a.priority - b.priority)
              .map(([fieldName, fieldConfig]) => (
                <InputField
                  key={fieldName}
                  name={fieldName}
                  config={fieldConfig}
                  value={data[fieldName]}
                  onChange={handleChange}
                  error={errors[fieldName]}
                />
              ))}
            <div className="universal-form__actions">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={handleClickOnCancel}>
                Отмена
              </button>
            </div>
          </>
        )}
        {mode === 'delete' && (
          <>
            <p>{`Вы хотите удалить ${entityRus[entityType]}`}</p>
            {entityType === 'title' && (
              <>
                <span>
                  {`${data.brevis}`}
                  <br />
                  {`${data.full_name}`}
                </span>
                {warningLine}
              </>
            )}
            {entityType === 'design' && (
              <>
                <span>
                  {`${data.code}`}
                  <br />
                  {`${data.full_name}`}
                </span>
                {warningLine}
              </>
            )}
            {entityType === 'resource' && (
              <>
                <span>
                  {`${data.name}`}
                  <br />
                  {`${data.unit}`}
                </span>
                {warningLine}
              </>
            )}
            {entityType === 'fact' && (
              <span>{`${data.date && new Date(data.date).toLocaleDateString()} 
            ${data?.name} ${data?.brevis} ${data?.fact} ${data.unit}`}</span>
            )}

            <div className="universal-form__actions">
              <button type="submit">Удалить</button>
              <button type="button" onClick={handleClickOnCancel}>
                Отмена
              </button>
            </div>
          </>
        )}
        {mode === 'create' && (
          <>
            {Object.entries(config.fields)
              .filter(([, val]) => val.isVisible)
              .sort(([, a], [, b]) => a.priority - b.priority)
              .map(([fieldName, fieldConfig]) => (
                <InputField
                  key={fieldName}
                  name={fieldName}
                  config={fieldConfig}
                  value={data[fieldName]}
                  onChange={handleChange}
                  error={errors[fieldName]}
                />
              ))}
            <div className="universal-form__actions">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={handleClickOnCancel}>
                Отмена
              </button>
            </div>
          </>
        )}
      </form>
      {isOpenModal && (
        <Modal>
          <ModalContext>
            <p>{resultAction.message}</p>
          </ModalContext>
        </Modal>
      )}
    </div>
  );
};

const InputField = ({ name, config, value, onChange, error }) => {
  const handleInputChange = (e) => {
    onChange(name, e.target.value);
  };
  const renderInput = () => {
    switch (config.type) {
      case 'number':
        return (
          <input
            className="universal-form__field-input"
            type="number"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      case 'text':
        return (
          <input
            className="universal-form__field-input"
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={config?.placeholder}
          />
        );
      case 'textarea':
        return (
          <EditableDiv
            name={name}
            value={value}
            onChange={onChange}
            placeholder={config?.placeholder}
          />
        );
      case 'date':
        return (
          <input
            className="universal-form__field-input"
            type="date"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      case 'autocomplete':
        return (
          <AutoCompleteField
            name={name}
            value={value}
            onChange={onChange}
            // onChange={handleInputChange}
            options={config?.getOptions()}
          />
        );
    }
  };

  return (
    <div
      className={`universal-form__field ${
        error ? 'universal-form__field--error' : ''
      }`}
    >
      <label className="universal-form__field-label">{config.label}</label>
      {renderInput()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
export default UniversalEntityForm;

const EditableDiv = ({ name, value = '', onChange, placeholder = '' }) => {
  const divRef = useRef(null);
  useEffect(() => {
    if (!divRef.current) return;

    if (placeholder && value === '') {
      divRef.current.innerHTML = placeholder;
      togglePlaceholderClass(true);
    }
  }, [value, placeholder]);

  const togglePlaceholderClass = (isEmpty) => {
    if (!divRef.current) return;
    divRef.current.classList.toggle('placeholder-mode', isEmpty);
  };
  const handleInput = (e) => {
    const newValue = e.target.innerHTML;
    togglePlaceholderClass(false);
    onChange(name, newValue);
  };
  const handleFocus = () => {
    // setIsFocused(true);
    if (divRef.current.textContent === placeholder) {
      divRef.current.innerHTML = '';
    }
  };
  const handleBlur = () => {
    // setIsFocused(false);
    if (divRef.current.textContent === '') {
      divRef.current.innerHTML = placeholder;
      togglePlaceholderClass(true);
    }
  };
  return (
    <div
      ref={divRef}
      className="universal-form__field-textarea"
      contentEditable="true"
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={!value ? {} : {}}
    />
  );
};
