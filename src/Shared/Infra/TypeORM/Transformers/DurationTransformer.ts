import { IPostgresInterval } from 'postgres-interval';

export default class DurationTransformer {
  from(data: IPostgresInterval): Duration {
    return {
      years: data.years || null,
      months: data.months || null,
      weeks: null, // IPostgresInterval does not support weeks
      days: data.days || null,
      hours: data.hours || null,
      minutes: data.minutes || null,
      seconds: data.seconds || null,
    };
  }

  to({ years, months, days, hours, minutes, seconds }: Duration): string {
    return `${years || 0} years ${months || 0} months ${days || 0} days ${
      hours || 0
    } hours ${minutes || 0} minutes ${seconds || 0} seconds`;
  }
}
