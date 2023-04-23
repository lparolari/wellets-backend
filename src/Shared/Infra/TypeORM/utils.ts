// eslint-disable-next-line import/prefer-default-export
export const toTimestamp = (column: string, alias: string): string =>
  `to_timestamp(cast(${column} as varchar), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as ${alias}`; // TODO: cast as varchar is required?
