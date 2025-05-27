import { Op, where } from 'sequelize';
import { Resource } from '../models/associations.js';

async function getResource(id) {
  const resource = await Resource.findByPk(+id, { raw: true });
  if (!resource) {
    throw new Error(`Ресурс с id ${id} не найден`);
  }
  return resource;
}

export async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    const resource = await getResource(id);
    res.status(200).json({ data: resource });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Ошибка на сервере',
      code: error.code,
    });
  }
}
export async function saveResource(req, res) {
  try {
    const resource = req.body;
    const hasAllFields = ['name', 'unit'].every((key) => key in resource);
    if (hasAllFields) {
      const { name, unit } = resource;
      const result = await Resource.findOne({
        where: {
          [Op.or]: {
            name: { [Op.iLike]: name },
          },
        },
      });
      if (result) {
        return res.status(409).json({
          success: false,
          data: result,
          message: 'Конфликт: Ресурс уже существует в системе',
        });
      } else {
        const newResource = await Resource.create({
          name,
          unit,
        });
        if (newResource) {
          return res.status(200).json({
            success: true,
            data: newResource,
            message: `Ресурс ${newResource.name} с ед.измерения ${newResource.unit} успешно создан`,
          });
        } else {
          throw new Error('Ошибка при создании');
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        data: [],
        message:
          'Не все поля переданы корректно. Необходимо обратиться к разработчику',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      data: [],
      error: error.message,
    });
  }
}
export async function updateResource(req, res) {
  try {
    const { id } = req.params;
    const updateResource = req.body;
    const [affectedRows] = await Resource.update(updateResource, {
      where: { id: +id },
      returning: true,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Ресурс не найден' });
    }

    const updatedResource = await Resource.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedResource,
      message: 'Успешное обновление',
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        data: [],
        message: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({
      success: false,
      data: [],
      error: error.message,
    });
  }
}
export async function deleteResource(req, res) {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Запись с ID ${id} не найдена`,
        data: null,
      });
    }

    const count = await Resource.destroy({ where: { id } });

    if (count > 0) {
      return res.status(200).json({
        success: true,
        data: resource,
        message: `Ресурс ${resource.name} ${resource.unit} успешно удален`,
      });
    } else {
      return res.status(404).json({
        success: true,
        data: null,
        message: `Запись с ID ${id} не найдена`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Внутренняя ошибка сервера',
      error: error.message,
    });
  }
}
