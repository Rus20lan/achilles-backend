import { useEffect, useRef, useState } from "react";
import { ENTITY_CONFIG } from "../../config/entities";
import "./style.scss";
import PostgresApi from "../../services/PostgresApi";

const entityRus = { title: "Титул", resource: "Ресурс", design: "Проект" };

const UniversalEntityForm = ({
  entityType,
  mode = "create",
  entityId = null,
}) => {
  const config = ENTITY_CONFIG[entityType];
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // 1. Добавляем состояние для ошибок
  const [errors, setErrors] = useState({});
  // 2. Создаем функцию валидации
  const validateForm = () => {
    const newErrors = {};
    const fields = config.fields;

    Object.entries(fields).forEach(([fieldName, fiedConfig]) => {
      const value = data[fieldName];
      const fieldErrors = [];
      // Проверка обязательных полей
      if (fiedConfig.required && !value?.toString().trim())
        fieldErrors.push(fiedConfig.errorMessage || "Обязательное поле");
      // Кастомная проверка
      if (fiedConfig.validate) {
        const error = fiedConfig.validate(value);
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
          const res = await postgresApi.getEntity(
            `/api/${entityType}/${entityId}`
          );
          setData(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Ошибка загрузки данных:", error);
        }
      };
      fethData();
    }
  }, [entityId, mode, config]);
  console.log("Данные для редактирования", data);
  // console.log(Object.entries(config.fields));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Форма содержит ошибки");
      return;
    }
    console.log("Отправляем данные формы", data);
    // Здесь будет логика отправки данных
  };
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <button type="button">Отмена</button>
        </div>
      </form>
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
