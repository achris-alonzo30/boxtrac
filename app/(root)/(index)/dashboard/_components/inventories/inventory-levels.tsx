"use client"

import { useQuery } from 'convex/react';

import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import { api } from '@/convex/_generated/api';
import { Loader } from '@/components/loader';

export function InventoryLevels({ orgId }: { orgId: string }) {
  const data = useQuery(api.inventories.getStatusCounts, { orgId })

  if (data === undefined || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader text="Loading Chart..." />
      </div>
    )
  }

  const statusCounts = data as { [status: string]: number }

  const transformedData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    total: count
  }))

  return (
    <>
      {transformedData.length === 0 ? (
        <div className="flex h-40 w-full items-center justify-center">
          <p>No data</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={transformedData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      )}

    </>
  )
}