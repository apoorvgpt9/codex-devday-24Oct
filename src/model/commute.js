import { haversineKm } from './geo.js';
import { openStations, routeToRamwadi } from './network.js';

export function valuesFromAssumptions(assumptions) {
  return Object.fromEntries(
    Object.entries(assumptions)
      .filter(([key]) => key !== '_note')
      .map(([key, detail]) => [key, detail.value]),
  );
}

export function fareForStations(stationCount, fareSlabs) {
  return fareSlabs.find(([maximumStations]) => stationCount <= maximumStations)?.[1]
    ?? fareSlabs.at(-1)[1];
}

export function nearestStation(home, stations, line3Open, assumptions) {
  return openStations(stations, line3Open)
    .map((station) => ({
      station,
      distanceKm: haversineKm(home, station) * assumptions.roadCircuityFactor,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

export function cabTrip(employee, office, assumptions) {
  const roadKm = haversineKm(employee, office) * assumptions.roadCircuityFactor;
  return {
    roadKm,
    minutes: roadKm / assumptions.peakRoadSpeedKmh * 60,
    costPerDay: roadKm * assumptions.cabRatePerKm * 2,
  };
}

export function metroTrip(employee, { stations, line3Open = false, service = 'shuttle', headwayMin }, assumptions) {
  const closest = nearestStation(employee, stations, line3Open, assumptions);
  if (closest.distanceKm > assumptions.accessMaxKm) {
    return { eligible: false, reason: 'too far from any station', boardingStation: closest.station, accessKm: closest.distanceKm };
  }

  const accessByWalk = closest.distanceKm <= assumptions.walkMaxKm;
  const accessMinutes = accessByWalk
    ? closest.distanceKm / assumptions.walkSpeedKmh * 60
    : closest.distanceKm / assumptions.autoSpeedKmh * 60 + assumptions.autoWaitMin;
  const accessCost = accessByWalk ? 0 : closest.distanceKm * assumptions.autoFarePerKm;
  const route = routeToRamwadi(stations, closest.station.id, { line3Open });
  if (!route) return { eligible: false, reason: 'no route to Ramwadi', boardingStation: closest.station, accessKm: closest.distanceKm };

  const effectiveHeadway = service === 'pmpml' ? assumptions.pmpmlHeadwayMin : headwayMin;
  const shuttleWaitMinutes = effectiveHeadway / 2;
  const shuttleRideMinutes = assumptions.ramwadiToOfficeKm / assumptions.shuttleSpeedKmh * 60;
  const shuttleMinutes = shuttleWaitMinutes + shuttleRideMinutes;
  const rideMinutes = route.hops * assumptions.minPerStation + route.transfers * assumptions.transferMin;
  const minutes = accessMinutes + rideMinutes + assumptions.metroEntryExitMin + shuttleMinutes;

  return {
    eligible: true,
    boardingStation: closest.station,
    accessKm: closest.distanceKm,
    accessMode: accessByWalk ? 'walk' : 'auto',
    accessMinutes,
    accessCost,
    route,
    metroFare: fareForStations(route.hops, assumptions.fareSlabs),
    rideMinutes,
    shuttleWaitMinutes,
    shuttleRideMinutes,
    shuttleMinutes,
    minutes,
  };
}

export function evaluateEmployee(employee, context, assumptions) {
  const cab = cabTrip(employee, context.office, assumptions);
  const metro = metroTrip(employee, context, assumptions);
  if (!metro.eligible) {
    return { employee, cab, metro, canSwitch: false, deltaMin: null, reason: metro.reason };
  }

  const deltaMin = metro.minutes - cab.minutes;
  const canSwitch = metro.minutes <= cab.minutes + context.toleranceMin;
  return {
    employee,
    cab,
    metro,
    canSwitch,
    deltaMin,
    reason: canSwitch ? 'Metro + last mile is within tolerance' : 'Metro + last mile is slower than tolerance',
  };
}

export function fleetSize(switchers, { service = 'shuttle', headwayMin }, assumptions) {
  if (service === 'pmpml' || switchers.length === 0) {
    return { buses: 0, busesForHeadway: 0, busesForDemand: 0, peakRiders: 0, roundTripMin: 0, seatsPerBusPerShift: 0 };
  }
  const shuttleRideMinutes = assumptions.ramwadiToOfficeKm / assumptions.shuttleSpeedKmh * 60;
  const roundTripMin = 2 * shuttleRideMinutes + assumptions.shuttleTurnaroundMin;
  const ridersByShift = new Map();
  for (const result of switchers) {
    ridersByShift.set(result.employee.shiftStart, (ridersByShift.get(result.employee.shiftStart) ?? 0) + 1);
  }
  const peakRiders = Math.max(...ridersByShift.values());
  const seatsPerBusPerShift = assumptions.busSeats * Math.max(1, Math.floor(assumptions.shiftWindowMin / roundTripMin));
  const busesForHeadway = Math.ceil(roundTripMin / headwayMin);
  const busesForDemand = Math.ceil(peakRiders / seatsPerBusPerShift);
  return {
    buses: Math.max(busesForHeadway, busesForDemand),
    busesForHeadway,
    busesForDemand,
    peakRiders,
    roundTripMin,
    seatsPerBusPerShift,
  };
}

function applyPmpmlCapacity(results, assumptions) {
  const capacityPerShift = Math.floor(assumptions.shiftWindowMin / assumptions.pmpmlHeadwayMin)
    * assumptions.pmpmlSpareSeatsPerBus;
  const acceptedEmployeeIds = new Set();

  for (const shiftStart of new Set(results.map((result) => result.employee.shiftStart))) {
    results
      .filter((result) => result.canSwitch && result.employee.shiftStart === shiftStart)
      .sort((a, b) => a.deltaMin - b.deltaMin)
      .slice(0, capacityPerShift)
      .forEach((result) => acceptedEmployeeIds.add(result.employee.id));
  }

  return results.map((result) => {
    if (!result.canSwitch || acceptedEmployeeIds.has(result.employee.id)) return result;
    return { ...result, canSwitch: false, reason: 'PMPML feeder full at peak' };
  });
}

export function analyseCommute(employees, context, assumptionDocument) {
  const assumptions = valuesFromAssumptions(assumptionDocument);
  const evaluated = employees.map((employee) => evaluateEmployee(employee, context, assumptions));
  const results = context.service === 'pmpml' ? applyPmpmlCapacity(evaluated, assumptions) : evaluated;
  const switchers = results.filter((result) => result.canSwitch);
  const fleet = fleetSize(switchers, context, assumptions);
  const cabSpendAvoided = switchers.reduce((sum, result) => sum + result.cab.costPerDay * assumptions.workDaysPerMonth, 0);
  const reimbursedFares = assumptions.companyReimbursesFares
    ? switchers.reduce((sum, result) => {
      const pmpmlFare = context.service === 'pmpml' ? assumptions.pmpmlFare : 0;
      const roundTripFare = 2 * (result.metro.metroFare + result.metro.accessCost + pmpmlFare);
      return sum + roundTripFare * assumptions.workDaysPerMonth;
    }, 0)
    : 0;
  const co2TonnesPerYear = switchers.reduce(
    (sum, result) => sum + result.cab.roadKm * 2 * assumptions.cabCo2KgPerKm * assumptions.workDaysPerMonth * 12 / 1000,
    0,
  );
  const byBoardingStation = [...switchers.reduce((groups, result) => {
    const station = result.metro.boardingStation;
    const current = groups.get(station.id) ?? { stationId: station.id, name: station.name, switchers: 0 };
    current.switchers += 1;
    groups.set(station.id, current);
    return groups;
  }, new Map()).values()]
    .sort((a, b) => b.switchers - a.switchers)
    .slice(0, 5);

  return {
    results,
    switchers,
    fleet,
    totals: {
      workforce: employees.length,
      switchers: switchers.length,
      switcherPercent: employees.length ? switchers.length / employees.length * 100 : 0,
      cabSpendAvoided,
      shuttleCost: fleet.buses * assumptions.busMonthlyCost,
      reimbursedFares,
      netMonthlySaving: cabSpendAvoided - fleet.buses * assumptions.busMonthlyCost - reimbursedFares,
      co2TonnesPerYear,
      byBoardingStation,
    },
  };
}

export function compareHeadways(employees, context, assumptionDocument) {
  const assumptions = valuesFromAssumptions(assumptionDocument);
  const options = [
    { service: 'pmpml', headwayMin: assumptions.pmpmlHeadwayMin },
    ...[30, 25, 20, 15, 10].map((headwayMin) => ({ service: 'shuttle', headwayMin })),
  ];

  return options.map((option) => ({
      ...option,
      analysis: analyseCommute(employees, { ...context, ...option }, assumptionDocument),
    }));
}

export function recommendHeadway(employees, context, assumptionDocument) {
  return compareHeadways(employees, context, assumptionDocument)
    .sort((left, right) => right.analysis.totals.netMonthlySaving - left.analysis.totals.netMonthlySaving)[0];
}
