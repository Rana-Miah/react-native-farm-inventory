import React from "react";
import { ScrollView } from "react-native";
import { DataTable as Table } from "react-native-paper";

/* --------------------
   Types
-------------------- */

export type Column<T> = {
  key: keyof T;
  title: string;
  numeric?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type PaperDataTableProps<T extends { id: string }> = {
  data: T[];
  columns: Column<T>[];
  onRowPress?: (row: T) => void;
};

/* --------------------
   Component
-------------------- */

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowPress,
}: PaperDataTableProps<T>) {
  return (
    <ScrollView horizontal>
      <Table>
        {/* Header */}
        <Table.Header>
          {columns.map((col) => (
            <Table.Title
              key={String(col.key)}
              numeric={col.numeric}
            >
              {col.title}
            </Table.Title>
          ))}
        </Table.Header>

        {/* Rows */}
        {data.map((row) => (
          <Table.Row
            key={row.id}
            onPress={() => onRowPress?.(row)}
          >
            {columns.map((col) => {
              const value = row[col.key];

              return (
                <Table.Cell
                  key={String(col.key)}
                  numeric={col.numeric}
                >
                  {col.render
                    ? col.render(value, row)
                    : String(value)}
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
      </Table>
    </ScrollView>
  );
}
