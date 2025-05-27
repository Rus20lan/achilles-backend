export function getRequestQueryObject(req, keys) {
  if (!Array.isArray(keys)) return null;
  const result = {};
  for (const key of keys) {
    if (req.query.hasOwnProperty(key)) {
      result[key] = req.query[key];
    }
  }
  return result;
}

export async function getEntitysByPage(
  req,
  res,
  model,
  keys,
  orderValue = null
) {
  try {
    const { page = 1, limit = 10 } = getRequestQueryObject(req, keys);

    const correctCount = await model.count();
    const totalPages = Math.ceil(correctCount / limit);
    const offset = page > totalPages ? (page - 2) * limit : (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({
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
