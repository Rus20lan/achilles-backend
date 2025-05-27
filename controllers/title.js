import {
  Resource,
  Title,
  Volume,
  Design,
  Fact,
} from '../models/associations.js';
import {
  aggregationByDesign,
  aggregationByVolume,
} from '../services/titleService.js';
import { Op } from 'sequelize';

export async function getTitleById(req, res) {
  try {
    const { id } = req.params;

    const title = await Title.findOne({
      where: { titleID: id },
      include: [
        {
          model: Volume,
          as: 'volumes',
          include: [
            { model: Resource, attributes: ['name', 'unit'] },
            { model: Design },
            { model: Fact, attributes: ['id', 'values'] },
          ],
        },
      ],
    });

    // console.log(title.get({ plain: true }));
    const titleWithAggregatedVolumes = {
      ...title.get({ plain: true }),
      aggByVolume: aggregationByVolume(title.get({ plain: true }).volumes),
      aggByDesign: aggregationByDesign(title.get({ plain: true }).volumes),
    };
    res.status(200).json({ data: titleWithAggregatedVolumes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
}

export async function saveTitle(req, res) {
  try {
    const title = req.body;
    // Нужно произвести проверку титула, может есть БД такой титул.
    // Будем проверять по полям: brevis, full_name, title_code
    console.log('title', title);
    // Проверяем существуют необходимые поля в newTitle
    const hasAllFields = ['brevis', 'full_name', 'title_code'].every(
      (key) => key in title
    );
    if (hasAllFields) {
      const { brevis, full_name, title_code } = title;
      const result = await Title.findOne({
        where: {
          [Op.or]: [
            { brevis: { [Op.iLike]: brevis } },
            { full_name: { [Op.iLike]: full_name } },
            { title_code: { [Op.iLike]: String(title_code) } },
          ],
        },
      });
      if (result) {
        return res.status(409).json({
          success: false,
          data: result,
          message: 'Конфликт: Титул уже существует в системе',
        });
      } else {
        const newTitle = await Title.create({
          brevis,
          full_name,
          title_code,
        });
        if (newTitle) {
          return res.status(200).json({
            success: true,
            data: newTitle,
            message: `Титул ${newTitle.brevis}. ${newTitle.full_name} успешно создан`,
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
    res.status(500).json({
      success: false,
      data: [],
      error: error.message,
    });
  }
}
export async function updateTitle(req, res) {
  try {
    const { id } = req.params;
    const updateTitle = req.body;
    const [affectedRows] = await Title.update(updateTitle, {
      where: { titleID: +id },
      returning: true,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Титул не найден' });
    }

    const updatedTitle = await Title.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedTitle,
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
export async function deleteTitle(req, res) {
  try {
    const { id } = req.params;
    const title = await Title.findByPk(id);
    if (!title) {
      return res.status(404).json({
        success: false,
        message: `Запись с ID ${id} не найдена`,
        data: null,
      });
    }

    const count = await Title.destroy({
      where: {
        titleID: +id,
        brevis: title.brevis,
      },
    });
    if (count > 0) {
      console.log(
        `Запись успешно удалена. Количество удаленных записей ${count}`
      );
      return res.status(200).json({
        success: true,
        data: title,
        message: `Титул ${title.brevis}. ${title.full_name} успешно удален `,
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
