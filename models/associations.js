import sequelize from '../config/db.js';
import Title from './Title.js';
import Resource from './Resource.js';
import Volume from './Volume.js';
import Design from './Design.js';

// Устанавливаем связь между Титул-Объем, как 1 ко многим
Title.hasMany(Volume, { foreignKey: 'titleId', as: 'volumes' });
Volume.belongsTo(Title, { foreignKey: 'titleId' });
// Устанавливаем связь между Ресурс-Объем, как 1 ко многим
Resource.hasMany(Volume, { foreignKey: 'resourceId' });
Volume.belongsTo(Resource, { foreignKey: 'resourceId' });

// Устанавливаем связь между РД-Объем, как 1 ко многим
Design.hasMany(Volume, { foreignKey: 'designId' });
Volume.belongsTo(Design, { foreignKey: 'designId' });

// Синхронизация моделей с базой данных
// sequelize
//   .sync()
//   .then(() => {
//     console.log('Таблицы успешно созданы!');
//   })
//   .catch((error) => {
//     console.error('Ошибка при создании таблиц:', error);
//   });

export { Title, Resource, Volume };
