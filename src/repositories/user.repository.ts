import { pool } from "../config/database.js";
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  SafeUser,
} from "../types/user.types.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
// Repository is the only layer that talks to MySQL.

export const findAll = async (): Promise<SafeUser[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select id, name, email, role from users"
  );
  return rows as SafeUser[];
};

export const findById = async (id: number): Promise<User | undefined> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select id, name, email, role, refresh_token from users where id = ?",
    [id]
  );
  return rows[0] as User | undefined;
};

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select id, name, email, role, password, refresh_token from users where email = ?",
    [email]
  );
  return rows[0] as User | undefined;
};

export const create = async (
  data: CreateUserDto & { password?: string }
): Promise<number> => {
  const password = data.password || "";
  const [result] = await pool.query<ResultSetHeader>(
    "insert into users(name, email, password) value(?,?,?)",
    [data.name, data.email, password]
  );
  return result.insertId;
};

export const update = async (
  id: number,
  data: Partial<User & UpdateUserDto>
): Promise<ResultSetHeader> => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.password !== undefined) {
    fields.push("password = ?");
    values.push(data.password);
  }
  if (data.role !== undefined) {
    fields.push("role = ?");
    values.push(data.role);
  }
  if (data.refreshToken !== undefined) {
    fields.push("refresh_token = ?");
    values.push(data.refreshToken);
  }

  if (fields.length === 0) {
    return {
      affectedRows: 0,
      fieldCount: 0,
      info: "",
      insertId: 0,
      serverStatus: 0,
      warningStatus: 0,
      changedRows: 0,
    } as ResultSetHeader;
  }

  values.push(id);
  const [result] = await pool.query<ResultSetHeader>(
    `update users set ${fields.join(", ")} where id = ?`,
    values
  );

  return result;
};

export const remove = async (id: number): Promise<ResultSetHeader> => {
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
