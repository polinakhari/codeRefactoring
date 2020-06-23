const plays = {
  Гамлет: { name: "Гамлет", type: "tragedy" },
  "Ромео и Джульетта": { name: "Ромео и Джульетта", type: "comedy" },
  Отелло: { name: "Отелло", type: "tragedy" },
};

const invoice = {
  customer: "MDT",
  performances: [
    {
      playId: "Гамлет",
      audience: 55,
      type: "tragedy",
    },
    {
      playId: "Ромео и Джульетта",
      audience: 35,
      type: "tragedy",
    },
    {
      playId: "Отелло",
      audience: 40,
      type: "comedy",
    },
  ],
};
function statement(invoice, plays) {
  let result = `Счет для ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    result += ` ${getPlay(perf).name}: ${Format(
      paymentItem(perf, getPlay(perf).type)
    )}`;
    result += ` (${perf.audience} мест)\n`;
  }
  result += `Итого с вас ${Format(totalPayment())}\n`;
  result += `Вы заработали ${totalCredits()} бонусов\n`;
  return result;

  function totalPayment() {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
      totalAmount += paymentItem(perf);
    }
    return totalAmount;
  }
  function paymentItem(performance) {
    let payment = 0;
    switch (getPlay(performance).type) {
      case "tragedy":
        payment = 40000;
        if (performance.audience > 30) {
          payment += 1000 * (performance.audience - 30);
        }
        break;

      case "comedy":
        payment = 30000;
        if (performance.audience > 20) {
          payment += 10000 + 500 * (performance.audience - 20);
        }
        payment += 300 * performance.audience;
        break;

      default:
        throw new Error("неизвестный тип: ${getPlay(performance).type}");
    }
    return payment;
  }
  function totalCredits() {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += creditsItem(perf, getPlay(perf).type);
    }
    return volumeCredits;
  }
  function creditsItem(performance) {
    let credits = 0;
    // Добавление бонусов
    credits += Math.max(performance.audience - 30, 0);
    // Дополнительный бонус за каждые 10 комедий
    if ("comedy" === getPlay(performance).type)
      credits += Math.floor(performance.audience / 5);

    return credits;
  }
  function Format(number) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(number / 100);
  }
  function getPlay(performance) {
    return plays[performance.playId];
  }
}

console.log(statement(invoice, plays));
