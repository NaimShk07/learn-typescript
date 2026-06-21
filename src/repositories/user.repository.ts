import { pool } from "../config/database.js";
import { CreateUserDto, UpdateUserDto, User } from "../types/user.types.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
// Repository is the only layer that talks to MySQL.

export const findAll = async () => {
  const [rows] = await pool.query("select id, name, email from users");
  return rows;
};

export const findById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select id, name, email, role, refresh_token from users where id = ?",
    [id]
  );
  return rows[0];
};

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select id, name, email, role, password from users where email = ?",
    [email]
  );
  return rows[0] as User | undefined;
};

export const create = async (data: CreateUserDto) => {
  const [result] = await pool.query<ResultSetHeader>(
    "insert into users(name, email, password) value(?,?,?)",
    [data.name, data.email, data.password]
  );
  return result.insertId;
};

export const update = async (id: number, data: Partial<UpdateUserDto>) => {
  const fields = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.refreshToken !== undefined) {
    fields.push("refresh_token = ?");
    values.push(data.refreshToken);
  }

  values.push(id);
  const [result] = await pool.query<ResultSetHeader>(
    `update users set ${fields.join(", ")} where id = ?`,
    values
  );

  return result;
};

export const remove = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    "delete from users where id = ?",
    [id]
  );

  return result;
};

export const isEmailExist = async (email: string): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select email from users where email = ?",
    [email]
  );

  return rows.length > 0;
};
