/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export const createCrudHandlers = (tableName: string) => {
  const extractData = (result: any) => result.rows;

  const GET = async () => {
    try {
      const result = await sql.query(`SELECT * FROM ${tableName}`);
      return NextResponse.json(extractData(result));
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
  };

  const POST = async (req: Request) => {
    const body = await req.json();
    const id = body.id || uuidv4();

    // Вставляем id в начало
    const keys = ['id', ...Object.keys(body).filter((k) => k !== 'id')];
    const values = [
      id,
      ...Object.values(body).filter((v, i) => Object.keys(body)[i] !== 'id'),
    ];

    try {
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const result = await sql.query(
        `INSERT INTO ${tableName} (${keys.join(
          ', '
        )}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return NextResponse.json(extractData(result)[0]);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to insert' }, { status: 500 });
    }
  };

  const PUT = async (req: Request) => {
    const { id, newData } = await req.json();
    const keys = Object.keys(newData);
    const values = Object.values(newData);
    const setString = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    try {
      const result = await sql.query(
        `UPDATE ${tableName} SET ${setString} WHERE id = $${
          values.length + 1
        } RETURNING *`,
        [...values, id]
      );
      if (result.rowCount === 0)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // ⬇️ Изменено: возвращаем только success вместо полной записи
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
  };

  const DELETE = async (req: Request) => {
    const { id } = await req.json();
    try {
      const result = await sql.query(`DELETE FROM ${tableName} WHERE id = $1`, [
        id,
      ]);
      if (result.rowCount === 0)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
  };

  return { GET, POST, PUT, DELETE };
};
