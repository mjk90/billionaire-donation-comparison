export const formatCash = num => {
  let n = parseFloat(num);
  if(n < 1e0) return numberWithCommas(n.toFixed(2));
  if (n < 1e3) return numberWithCommas(n.toFixed(2));
  if (n < 1e6) return numberWithCommas(n.toFixed(0));
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + " Million";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + " Billion";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + " Trillion";
};

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const calculateAmount = (donated, totalCash, earn) => {
  let percentage = donated * 100 / totalCash;
  return earn * percentage;
}
