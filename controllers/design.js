import { Op } from 'sequelize';
import { Design } from '../models/associations.js';

async function getDesign(id) {
  const design = await Design.findByPk(+id, { raw: true });
  if (!design) {
    throw new Error(`Документация с id ${id} не найдена`);
  }
  return design;
}

export async function getDesignById(req, res) {
  try {
    const { id } = req.params;
    const design = await getDesign(id);
    res.status(200).json({ data: design });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Ошибка на сервере',
      code: error.code,
    });
  }
}
export async function saveDesign(req, res) {
  try {
    const design = req.body;
    const hasAllFields = ['brevis', 'full_name', 'mark', 'code'].every(
      (key) => key in design
    );
    console.log('design', design);
    if (hasAllFields) {
      const { brevis, full_name, mark, code } = design;
      const result = await Design.findOne({
        where: {
          [Op.or]: [
            { brevis: { [Op.iLike]: brevis } },
            { full_name: { [Op.iLike]: full_name } },
            { code: { [Op.iLike]: code } },
          ],
        },
      });
      if (result) {
        return res.status(409).json({
          success: false,
          data: result,
          message: 'Конфликт: Документация уже существует в системе',
        });
      } else {
        const newDesign = await Design.create({
          brevis,
          full_name,
          mark,
          code,
        });
        if (newDesign) {
          return res.status(200).json({
            success: true,
            data: newDesign,
            message: `Документация ${newDesign.brevis}. ${newDesign.full_name} успешно создана`,
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
export async function updateDesign(req, res) {
  try {
    const { id } = req.params;
    const updateDesign = req.body;
    const [affectedRows] = await Design.update(updateDesign, {
      where: { id: +id },
      returning: true,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Проект не найден' });
    }

    const updatedDesign = await Design.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedDesign,
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
export async function deleteDesign(req, res) {
  try {
    const { id } = req.params;
    const design = await Design.findByPk(id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: `Запись с ID ${id} не найдена`,
        data: null,
      });
    }
    const count = await Design.destroy({
      where: {
        id,
      },
    });
    if (count > 0) {
      return res.status(200).json({
        success: true,
        data: design,
        message: `Проект ${design.brevis}. ${design.full_name} успешно удален`,
      });
    } else {
      console.log(`Запись с ID ${id} не найдена`);
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
