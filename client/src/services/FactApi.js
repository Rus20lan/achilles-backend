class FactApi {
  constructor(newFact) {
    this.fact = newFact.fact;
    this.dateString = newFact.date;
    this.dateObject = new Date(newFact.date);
    this.year = this.dateObject.getFullYear();
    this.month = this.dateObject.getMonth() + 1;
    this.day = this.dateObject.geDay();
    this.valueId = newFact.valueId;
    this.creating = newFact.id;
  }

  toString = () => {
    return `
            fact: ${this.fact}, 
            dateString:${this.dateString}, 
            dateObject:${this.dateObject}, 
            year:${this.year}, 
            month:${this.month}, 
            day:${this.day}, 
            valueId:${this.valueId}, 
            creating:${this.creating}
        `;
  };
}

export default FactApi;
