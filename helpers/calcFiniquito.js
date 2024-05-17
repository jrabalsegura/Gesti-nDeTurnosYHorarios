const calcFiniquito = (sallary, antiguedad, holidays) => {

  // 33 dias de indemnizacion por año
  const currentDate = new Date(); // Fecha actual// Fecha de inicio de labores
  const startDate = new Date(antiguedad);
  let yearsWorked = currentDate.getFullYear() - startDate.getFullYear(); // Años trabajados

  // Ajuste si el mes actual es menor al mes de inicio o estamos en el mismo mes pero el día actual es menor al día de inicio
  if (currentDate.getMonth() < startDate.getMonth() || 
      (currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() < startDate.getDate())) {
      yearsWorked--;
  }

  const daysPerYear = 33; // Días de indemnización por año trabajado
  let totalDays = yearsWorked * daysPerYear; // Total de días a indemnizar

  if (totalDays > (48 * 30)) {
      totalDays = 48 * 30;
  }

  const dailySalary = sallary * 8 
  const totalFiniquito = dailySalary * totalDays; // Total a pagar de finiquito

  // now la parte de vacaciones no disfrutadas, asumiento 22 dias por año
  // en holidays tengo los dias que se han disfrutado, y tengo que calcular
  // segun la proporcion de año transcurrido los no disfrutados
  const daysPerYearVacaciones = 22; 
  const monthsWorkedThisYear = (currentDate.getMonth() + 1) - (startDate.getMonth() + 1) + 
                               (currentDate.getDate() < startDate.getDate() ? -1 : 0); // Meses trabajados este año, ajuste por día
  const vacationDaysThisYear = (daysPerYearVacaciones / 12) * monthsWorkedThisYear; // Días de vacaciones correspondientes hasta la fecha
  const unusedVacationDays = vacationDaysThisYear - holidays; // Días de vacaciones no disfrutados

  const totalVacation = unusedVacationDays * dailySalary;

  const pago = totalFiniquito + totalVacation;

  return {
      baseSallary: parseFloat((dailySalary * 30).toFixed(2)),
      months: parseFloat((yearsWorked * 12 + monthsWorkedThisYear).toFixed(2)),
      totalVacation: parseFloat(totalVacation.toFixed(2)),
      pago: parseFloat(pago.toFixed(2))
  }
}

module.exports = {
  calcFiniquito
}
