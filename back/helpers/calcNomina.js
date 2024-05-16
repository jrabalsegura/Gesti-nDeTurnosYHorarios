export const calcNomina = (sallary, extraHours, daysInMonth) => {

  //sallary is the base sallary per hour, the worker works 40 hours per week
  const weekly = (sallary * 40)

  // Calculate daily wage
  const daily = weekly / 7;

  // Adjust to the specific month based on days in the month
  const baseSallary = daily * daysInMonth;

  const sallaryBefore = baseSallary + (extraHours * (sallary * 2));

  const socialSecurity = sallaryBefore * 0.16;

  const pago = sallaryBefore - socialSecurity;

  return {
      baseSallary: parseFloat(baseSallary.toFixed(2)),
      sallary: parseFloat(sallary.toFixed(2)),
      socialSecurity: parseFloat(socialSecurity.toFixed(2)),
      pago: parseFloat(pago.toFixed(2))
  }
}
