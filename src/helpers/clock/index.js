
import moment from 'moment';
import { CLOCK_OPS } from '../../utils/constants';
import { Clock } from '../../models/clock';

export const getClocksSummary = async (filter) => {
  const clocks = await Clock
    .find(filter)
    .populate('project', 'name');
  const clocksByDay = clocks.reduce((total, clock) => {
    const hour = moment(clock.hour);
    const date = hour.format('DD/MM/YYYY');
    total[date] = total[date] || [];
    total[date].push(clock);
    return total;
  }, {});
  const summary = {};
  for (const day in clocksByDay) {
    const dayResult = clocksByDay[day]
      .reduce((result, clock) => {
        const hour = moment(clock.hour);
        if (clock.type === CLOCK_OPS.IN) {
          if (result.lastStart) { // two 'ins' in a row
            result.smm.push({
              start: result.lastStart,
              end: null,
              duration: 0,
              project: result.currentProject,
            });
          }
          result.currentProject = clock.project;
          result.lastStart = hour;
          return result;
        } else if (!result.lastStart) { // two 'outs' in a row
          result.smm.push({
            start: null,
            end: hour.format('HH:mm:ss'),
            duration: 0,
            project: null,
          });
        } else { // 'in' & 'out'
          const diff = hour.diff(result.lastStart, 'minutes');
          result.minutes += diff;
          result.smm.push({
            start: result.lastStart.format('HH:mm:ss'),
            end: hour.format('HH:mm:ss'),
            duration: diff,
            project: result.currentProject,
          });
        }
        result.lastStart = null;
        result.currentProject = null;
        return result;
      }, { smm: [], lastStart: null, minutes: 0, currentProject: null });

    if (dayResult.lastStart) { // last 'in' without 'out'
      dayResult.smm.push({ start: dayResult.lastStart, end: null, duration: 0 });
      dayResult.lastStart = null;
    }
    const getHoursMinutes = (mins) => ({
      hours: Math.floor(mins / 60),
      minutes: mins % 60,
    });
    const durationsByProject = dayResult.smm
      .reduce((resultsByProj, proj) => {
        const projName = proj.project ? proj.project.name : 'Sin Proyecto';
        resultsByProj[projName] = (resultsByProj[projName] || 0) + proj.duration;
        return resultsByProj;
      }, {});
    for (const [key, value] of Object.entries(durationsByProject)) {
      durationsByProject[key] = getHoursMinutes(value);
    }
    summary[day] = {
      schedule: dayResult.smm,
      total: getHoursMinutes(dayResult.minutes),
      totalsByProject: durationsByProject,
    };
  }
  return summary;
};
