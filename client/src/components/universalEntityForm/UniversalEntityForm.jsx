import { useEffect, useState } from 'react';
import { ENTITY_CONFIG } from '../../config/entities';
import './style.scss';
import PostgresApi from '../../services/PostgresApi';

const UniversalEntityForm = ({
  entityType,
  mode = 'create',
  entityId = null,
}) => {
  const config = ENTITY_CONFIG[entityType];
  const [data, setData] = useState(null);

  useEffect(() => {
    if (mode !== 'create' && entityId) {
      const fethData = async () => {
        const postgresApi = new PostgresApi();
        try {
          const res = await postgresApi.getEntity(
            `/api/${entityType}/${entityId}`
          );
          setData(res.data);
        } catch (error) {
          console.error(error);
        }
      };
    }
  }, [entityId, mode, config]);

  return (
    <div>
      <p>Универсальная форма для всех сущностей</p>
    </div>
  );
};

export default UniversalEntityForm;
