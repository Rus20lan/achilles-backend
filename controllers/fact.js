//  Функция для получения Fact из таблицы Facts по внешнему ключу volumeId
export async function setFact(req, res) {
  try {
    const jsonData = req.body;
    res.status(200).json({ message: "JSON received", data: jsonData });
  } catch (error) {
    res.status(500).json({ message: "Есть ошибка" });
  }
}
