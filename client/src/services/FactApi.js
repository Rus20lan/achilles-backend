export class Fact {
  constructor(fact) {
    this.id = fact.id;
    this.fact = fact.fact;
    this.dateString = fact.date;
    this.dateObject = new Date(fact.date);
    this.year = this.dateObject.getFullYear();
    this.month = this.dateObject.getMonth() + 1;
    this.day = this.dateObject.getDate();
    this.volumeId = fact.volumeId ?? null;
    this.creating = fact.id;
  }
}

class FactApi {
  constructor() {
    this.resultArray = [];
  }

  fillFactArray(factArray) {
    for (const fact of factArray) {
      const newFact = new Fact(fact);
      this.resultArray.push(newFact);
    }
    return this.resultArray;
  }
  async sendFactArray(url, factArray) {
    try {
      const resultArray = { factsArray: this.fillFactArray(factArray) };
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultArray),
      });
      if (!res.ok) {
        const obj = await res.json();
        throw new Error(obj.message);
      }
      return await res.json();
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
}

export default FactApi;
