import { Op } from 'sequelize';

export function getRequestQueryObject(req) {
  const result = {};
  const query = req.query;
  if (query.page) result.page = parseInt(query.page, 10);
  if (query.limit) result.limit = parseInt(query.limit, 10);

  if (query.filter) {
    try {
      result.filter = JSON.parse(query.filter);
    } catch (error) {
      result.filter = {};
    }
  }
  return result;
}

export function filterEntities(model, filterObject) {
  const where = {};
  const attributes = model.rawAttributes;

  for (const [field, value] of Object.entries(filterObject)) {
    if (!attributes[field]) continue;
    const fieldType = attributes[field].type.constructor.key;

    switch (fieldType) {
      case 'STRING':
      case 'TEXT':
        where[field] = { [Op.like]: `%${value}%` };
        break;
      default:
        where[field] = { [Op.like]: `%${value}%` };
    }
  }
  return where;
}

export async function getEntitysByPage(req, res, model, orderValue = null) {
  try {
    const { page = 1, limit = 10, filter = null } = getRequestQueryObject(req);
    const where = filter ? filterEntities(model, filter) : null;
    const correctCount = where
      ? await model.count({ where })
      : await model.count();
    if (correctCount === 0)
      return res.status(404).json({
        success: false,
        data: null,
        message: 'По данным критериям ничего не найдено',
        // isEmpty: true,
      });
    const totalPages = Math.ceil(correctCount / limit);
    const offset = page > totalPages ? (page - 2) * limit : (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({
      ...(where && { where }),
      ...(orderValue && { order: orderValue }),
      limit,
      offset,
    });
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: null, message: 'Not found' });
    }

    const correctPage = page > totalPages ? page - 1 : page;
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: correctPage,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: correctPage < totalPages,
        hasPrevPage: correctPage > 1,
      },
    });
  } catch (error) {
    console.error('Ошибка при выборе факта: ', error);
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ succes: false, error: message });
  }
}

export async function getBrevis(model, res, fields, orderField) {
  try {
    const result = await model.findAll({
      attributes: fields,
      order: [[orderField, 'ASC']],
      raw: true,
    });
    if (result.length === 0)
      return res
        .status(404)
        .json({ succes: false, data: [], message: 'Not Found' });
    return res
      .status(200)
      .json({ succes: true, data: result, message: 'Успешно' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ succes: false, data: null, error: error.message });
  }
}
