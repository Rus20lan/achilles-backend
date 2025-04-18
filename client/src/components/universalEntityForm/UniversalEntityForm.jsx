import { useEffect, useState } from "react";
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

  const handleSubmit = () => {
    console.log("Отправляем данные формы");
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
          {mode === "create" ? "Создание" : "Редактирование сущности:"}{" "}
          {entityRus[entityType]}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
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
            />
          ))}
        <div className="form-actions">
          <button type="button">Отмена</button>
          <button type="submit">Сохранить</button>
        </div>
      </form>
      <p>Универсальная форма для всех сущностей</p>
    </div>
  );
};

const InputField = ({ name, config, value }) => {
  const handleInputChange = (e) => {
    onChange(name, e.target.value);
  };
  console.log(config);
  const renderInput = () => {
    switch (config.type) {
      case "number":
        return (
          <input
            type="number"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      case "text":
        return (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label>
        {config.label}
        {config.required && <span className="required">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};
export default UniversalEntityForm;
