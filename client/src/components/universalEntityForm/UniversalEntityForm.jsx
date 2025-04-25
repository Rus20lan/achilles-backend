import { useEffect, useRef, useState } from "react";
import { ENTITY_CONFIG } from "../../config/entities";
import "./style.scss";
import PostgresApi from "../../services/PostgresApi";
import Modal from "../modal/Modal";
import { ModalContext } from "../authForm/AuthForm";
import { isEqual } from "lodash-es";
import createObjectEditFields from "../../services/createObjectEditFields";

const entityRus = {
  title: "Титул",
  resource: "Ресурс",
  design: "Проект",
  fact: "Факт",
};

const UniversalEntityForm = ({
  entityType,
  mode = "create",
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
    message: "",
    status: false,
  });
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
        fieldErrors.push(fieldConfig.errorMessage || "Обязательное поле");
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
    if (mode !== "create" && entityId) {
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
          setData(initData.current);
          setIsLoading(false);
          // console.log(createObjectEditFields(entityType, initData.current));
        } catch (error) {
          console.error("Ошибка загрузки данных:", error);
        }
      };
      fethData();
    }
  }, [entityId, mode, config]);
  // console.log("Данные для редактирования", data);
  // console.log(Object.entries(config.fields));

  useEffect(() => {
    if (resultAction.message) {
      setIsOpenModal(true);
      // onSuccess?.(false);
      setTimeout(() => {
        setIsOpenModal(false);
        // setTimeout(() => {
        //   onClose?.();
        // }, 500);
      }, 1000);
    }
    if (resultAction.status) {
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    }
  }, [resultAction]);

  // Обработчик события нажатия кнопки СОХРАНИТЬ
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setResultAction({ message: "Форма содержит ошибки", status: false });
      return;
    }
    const postData = createObjectEditFields(entityType, data);
    // {
    //   // Поля для Title
    //   ...(data.brevis && { brevis: data.brevis }),
    //   ...(data.full_name && { full_name: data.full_name }),
    //   ...(data.title_code && { title_code: data.title_code }),
    // };

    if (isEqual(initData.current, postData)) {
      setResultAction({ message: "Изменения не внесены", status: false });
      return;
    }

    // console.log(`initData: ${initData.current}`, initData.current);
    // console.log("Отправляем данные формы", postData);
    // Здесь будет логика отправки данных
    const postgresApi = new PostgresApi();
    const respond = await postgresApi.putEntity(
      `/api/${entityType}/${entityId}`,
      postData
    );
    if (respond.message) {
      setResultAction({ message: respond.message, status: true });
      // console.log("Значение в поле success: ", respond.success);
      // if (respond.success) {
      //   onSuccess?.();
      // }
    }
    // console.log(respond);
  };
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Обработчик события нажатия кнопки ОТМЕНА
  const handleClickOnCancel = () => {
    onCancel?.();
  };

  if (isLoading) return null;
  return (
    <div className="universal-form">
      <div className="universal-form__header">
        <h2>
          {mode === "create" ? "Создание" : "Редактирование:"}{" "}
          {entityRus[entityType]}
        </h2>
      </div>

      <form className="universal-form__body" onSubmit={handleSubmit}>
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
  // console.log(config);
  const renderInput = () => {
    switch (config.type) {
      case "number":
        return (
          <input
            className="universal-form__field-input"
            type="number"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      case "text":
        return (
          <input
            className="universal-form__field-input"
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      case "textarea":
        return <EditableDiv name={name} value={value} onChange={onChange} />;
    }
  };

  return (
    <div
      className={`universal-form__field ${
        error ? "universal-form__field--error" : ""
      }`}
    >
      <label className="universal-form__field-label">
        {config.label}
        {/* {config.required && <span className="required">*</span>} */}
      </label>
      {renderInput()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
export default UniversalEntityForm;

const EditableDiv = ({ name, value = "", onChange }) => {
  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== value) {
      divRef.current.innerHTML = value;
    }
  }, [value]);
  const handleInput = (e) => {
    const newValue = e.target.innerHTML;
    onChange(name, newValue);
  };
  return (
    <div
      ref={divRef}
      className="universal-form__field-textarea"
      contentEditable="true"
      onInput={handleInput}
    />
  );
};
