// 2025 TypeScript Global Types and Utilities

// Generic API Response type
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: 'success' | 'error';
    errors?: Record<string, string[]>;
}

// Pagination type
export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Generic paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationData;
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

// Form validation errors
export interface FormErrors {
    [key: string]: string | string[];
}

// Generic form data
export interface FormData {
    [key: string]: any;
}

// Utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Component props with children
export interface ComponentWithChildren {
    children: React.ReactNode;
}

// Component props with className
export interface ComponentWithClassName {
    className?: string;
}

// Common component props
export interface BaseComponentProps extends ComponentWithChildren, ComponentWithClassName {
    id?: string;
    'data-testid'?: string;
}

// Event handler types
export type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;

// Async state types
export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Hook return types
export interface UseAsyncReturn<T> extends AsyncState<T> {
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

// 2025 Modern utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ValueOf<T> = T[keyof T];

// Branded types for better type safety
export type Brand<T, B> = T & { __brand: B };
export type UserId = Brand<number, 'UserId'>;
export type TemplateId = Brand<number, 'TemplateId'>;
export type CategoryId = Brand<number, 'CategoryId'>;
