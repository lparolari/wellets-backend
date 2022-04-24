interface IQueryOptionsDTO {
  sort:
    | {
        by: 'favorite';
        params: { user_id: string };
      }
    | {
        by: 'acronym';
      };
}

export default IQueryOptionsDTO;
