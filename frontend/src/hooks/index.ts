"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services";
import type {
    AssetRecord,
    DashboardSummary,
    ExpenseRecord,
    FarmProfile,
    FeedConsumption,
    FeedPurchase,
    FlockRecord,
    NotificationItem,
    OpportunityItem,
    SalesRecord,
} from "@/types";

function useAsyncData<T>(loader: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                const result = await loader();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (loadError) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unknown error");
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [loader]);

    return { data, loading, error };
}

export function useDashboardSummary() {
    return useAsyncData(mockApi.getDashboardSummary);
}

export function useFarmProfile() {
    return useAsyncData(mockApi.getFarmProfile);
}

export function useFlocks() {
    return useAsyncData(mockApi.getFlocks);
}

export function useFeedPurchases() {
    return useAsyncData(mockApi.getFeedPurchases);
}

export function useFeedConsumption() {
    return useAsyncData(mockApi.getFeedConsumption);
}

export function useSales() {
    return useAsyncData(mockApi.getSales);
}

export function useExpenses() {
    return useAsyncData(mockApi.getExpenses);
}

export function useAssets() {
    return useAsyncData(mockApi.getAssets);
}

export function useOpportunities() {
    return useAsyncData(mockApi.getOpportunities);
}

export function useNotifications() {
    return useAsyncData(mockApi.getNotifications);
}

export type {
    AssetRecord,
    DashboardSummary,
    ExpenseRecord,
    FarmProfile,
    FeedConsumption,
    FeedPurchase,
    FlockRecord,
    NotificationItem,
    OpportunityItem,
    SalesRecord,
};

