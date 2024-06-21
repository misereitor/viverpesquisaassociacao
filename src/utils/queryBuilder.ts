import UserAdmin from '../model/userAdmin';

export const buildUpdateQuery = (
  table: string,
  data: Partial<UserAdmin>,
  id: number
): { query: string; values: unknown[] } => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    throw new Error('No fields to update');
  }

  const setString = keys.map((key) => `${key} = ?`).join(', ');

  const query = `UPDATE ${table} SET ${setString} WHERE id = ?`;
  values.push(id);

  return { query, values };
};
