import { Fact, Volume, Resource, Design } from '../models/associations.js';
import { validateFactValuesAndNewFact } from '../services/factService.js';
//  Функция для получения Fact из таблицы Facts по внешнему ключу volumeId
export async function setFact(req, res) {
  try {
    const { factsArray } = req.body; // Получаем массив с фактами для сохранения или обновления в базе
    if (!factsArray) {
      res.status(400).json({ message: 'Данные для сохранения не переданы' });
      return;
    }

    // Здесь будет происходить сохранение в базе данных факта
    for (const fact of factsArray) {
      // Необходимо найти fact в БД по внешнему ключу volumeId
      const prevFact = await Fact.findOne({
        where: { volumeId: fact.volumeId },
      });
      if (prevFact) {
        // const values = JSON.parse(JSON.stringify(prevFact.values));
        //  Здесь производится валидация полученных данных с данными из БД на предмет повторных данных
        prevFact.values = validateFactValuesAndNewFact(prevFact.values, fact)
          ? [...prevFact.values]
          : [...prevFact.values, fact];
        prevFact.volumeId = fact.volumeId;
        await prevFact.save(); // Сохраняем изменения
      } else {
        await Fact.create({
          // id: fact.id,
          values: [fact],
          volumeId: fact.volumeId,
        });
      }
    }
    res.status(200).json({
      message: 'Данные успешно сохранены или обновлены',
      data: factsArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Есть ошибка' });
  }
}

export async function getFactInValuesField(req, res) {
  // Нужно из request получить id - строки из таблицы facts и  id - из поля values
  try {
    const { id, idValue } = req.params;
    const fact = await Fact.findByPk(+id, { raw: true });
    if (!fact) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Для факта с id ${id} данные не найдены`,
      });
    }
    const values = fact.values.filter((fact) => fact.id === +idValue);
    if (values.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Запись в поле values с id ${idValue} не найдена`,
      });
    }
    // Добавляем данные по ресурсу (id, name) и документации (id, brevis)
    const volume = await Volume.findByPk(values[0].volumeId, {
      include: [
        { model: Resource, attributes: ['id', 'name', 'unit'] },
        { model: Design, attributes: ['id', 'brevis'] },
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        id: +id,
        valueId: values[0].id,
        value: volume.value,
        fact: values[0].fact,
        date: values[0].dateString,
        volumeId: values[0].volumeId,
        name: volume['Resource.name'],
        resourceId: volume['Resource.id'],
        brevis: volume['Design.brevis'],
        designId: volume['Design.id'],
        unit: volume['Resource.unit'],
      },
    });
  } catch (error) {
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ error: message });
  }
}

export async function saveFact(req, res) {
  // const fact = req.body;
  // const {volumeId, name, brevis} = fact;
  try {
    const { idDesign, idResource, name, brevis, ...newFact } = req.body;
    console.log('idResource', idResource, 'idDesign', idDesign);
    const volume = await Volume.findOne({
      where: { resourceId: idResource, designId: idDesign },
    });
    console.log('volume', volume);
    if (!volume) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Объем в проекте ${brevis ?? 'noname'} и ресурсом ${
          name ?? 'noname'
        } не найден`,
      });
    }

    newFact.volumeId = volume.id;

    // Проверить таблицу facts на наличие записи для объема с volumeId
    const factDB = await Fact.findOne({ where: { volumeId: volume.id } });
    if (factDB) {
      factDB.values = [...factDB.values, newFact];
      await factDB.save();
      return res.status(200).json({
        success: true,
        data: factDB,
        message: 'Факт успешно сохранен',
      });
    } else {
      const createFact = await Fact.create({
        values: [newFact],
        volumeId: volume.id,
      });
      if (createFact) {
        return res.status(200).json({
          success: true,
          data: createFact,
          message: `Факт ${createFact.values[0].fact} для ресурса ${name} в проекте ${brevis} создан`,
        });
      } else {
        throw new Error('Ошибка при создании');
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'мы в блоке catch',
    });
  }
}

export async function updateFact(req, res) {
  const { id, idValue } = req.params;
  const updateFact = req.body;
  const fact = await Fact.findByPk(+id, { raw: true });
}

export async function updateFactById(req, res) {
  try {
    const { id } = req.params;
    const { valueId, idDesign, idResource, name, brevis, unit, ...updateFact } =
      req.body;

    const fact = await Fact.findByPk(id);
    if (!fact)
      return res.status(404).json({
        success: false,
        message: 'Факт с таким id не найден',
        data: null,
      });

    // Преобразование в обычный объект
    const factData = fact.get({ plain: true });

    // Улучшенная проверка условий
    const shouldUpdateLocally = !idDesign && !idResource;

    if (shouldUpdateLocally) {
      const updatedValues = factData.values.map((value) =>
        String(value.id) === String(valueId)
          ? { ...updateFact, id: value.id }
          : value
      );
      const [affectedCount, updatedFacts] = await Fact.update(
        { values: updatedValues },
        { where: { id: +id }, returning: true }
      );
      // console.log('updatedFacts: ', updatedFacts[0]?.get({ plain: true }));
      return res.status(200).json({
        success: true,
        data: updatedFacts[0]?.get({ plain: true }),
        message: 'Факт успешно обновлен',
      });
    } else {
      const volume = await Volume.findOne({
        where: { resourceId: idResource, designId: idDesign },
      });
      if (!volume) {
        return res.status(404).json({
          success: false,
          message: `В документации ${brevis} не существует ресурса ${name}`,
          data: null,
        });
      }
      // Нужно удалить из поля values, а в начале проверить если в массиве values это последний элемент, то нужно удалить полностью запись из БД
      if (factData?.values.length === 1) {
        const deletedRow = await Fact.destroy({ where: { id: +id } });
        if (deletedRow > 0) {
          console.log('Запись успешно удалена');
        } else {
          console.log('Запись не найдена');
        }
      } else {
        // если в массиве values значений больше чем 1, то обновляем values
        const updatedValues = factData.values.filter(
          (value) => String(value.id) !== String(valueId)
        );
        await Fact.update({ values: updatedValues }, { where: { id: +id } });
      }
      const factInBD = await Fact.findOne({ where: { volumeId: volume.id } });
      const currentFact = { ...updateFact, id: valueId, volumeId: volume.id };
      if (factInBD) {
        const [affectedCount, updatedFacts] = await Fact.update(
          { values: [...factInBD.values, currentFact] },
          { where: { id: factInBD.id } }
        );
        console.log('Этот объект сохранен в массив values:', updatedFacts);
        return res.status(200).json({
          success: true,
          message: `Факт ${currentFact.fact} по ресурсу ${name} сохранен в ${brevis}`,
          data: updatedFacts,
        });
      }

      const newFact = await Fact.create({
        values: [currentFact],
        volumeId: volume.id,
      });
      console.log('Новая запись создана:', newFact.toJSON());
      return res.status(200).json({
        success: true,
        message: `Факт ${currentFact.fact} по ресурсу ${name} создан в ${brevis}`,
        data: newFact.get({ plain: true }),
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении факта', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      data: null,
    });
  }
}

export async function deleteFactById(req, res) {
  const { id } = req.params;
  const { valueId } = req.body;
  const fact = await Fact.findByPk(id);
  if (!fact) {
    return res.status(404).json({
      success: false,
      message: 'Факт с таким id не найден',
      data: null,
    });
  }

  // Преобразование в обычный объект
  const factData = fact.get({ plain: true });
  if (factData.values.length === 1) {
    console.log('Надо удалять всю запись в базе данных');
    const deletedCount = await Fact.destroy({
      where: {
        id: +id,
      },
    });
    if (deletedCount > 0) {
      console.log(
        `Запись успешно удалена. Количество удаленных записей ${deletedCount}`
      );
      return res.status(200).json({
        success: true,
        data: deletedCount,
        message: `${id}`,
      });
    } else {
      console.log(`Запись с ID ${id} не найдена`);
    }
  }
  // console.log('valueId', valueId);
  // console.log('factData.values', factData.values);
  if (factData.values.length > 1) {
    const updatedValues = factData.values.filter(
      (value) => value.id !== valueId
    );
    console.log('updatedValues', updatedValues);
    await Fact.update({ values: updatedValues }, { where: { id: +id } });
    return res
      .status(200)
      .json({ success: true, message: `Запись успешно удалена id: ${id}` });
  }
  res.status(200).json({ message: `Пока все в разработки id: ${id}` });
}
