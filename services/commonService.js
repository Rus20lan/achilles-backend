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

export async function getEntitysByPage(req, res, model, keys) {
  try {
    const { page = 1, limit = 10 } = getRequestQueryObject(req, keys);
    const offset = (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({ limit, offset });
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: [], message: "Not found" });
    }
    const totalPages = Math.ceil(count / limit);
    // console.log(rows);
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Ошибка при выборе факта: ", error);
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ succes: false, error: message });
  }
}
