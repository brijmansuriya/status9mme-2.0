// 2025 Modern Route Helper with TypeScript Generics
export const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    admin: {
        login: '/admin/login',
        dashboard: '/admin/dashboard',
        categories: '/admin/categories',
        templates: '/admin/templates',
        assets: '/admin/assets',
    },
    templates: '/templates',
    videoEditor: (slug: string) => `/templates/${slug}`,
} as const;

// Type-safe route helper with generics (2025 best practice)
export const route = <T extends string>(
    name: T, 
    params?: Record<string, any>
): string => {
    const routeParts = name.split('.');
    let route = routes as any;
    
    for (const part of routeParts) {
        route = route[part];
    }
    
    if (typeof route === 'function') {
        return route(params);
    }
    
    return route || name;
};

// 2025 TypeScript utility types for better type safety
export type RouteName = keyof typeof routes | `${keyof typeof routes}.${string}`;
export type AdminRouteName = `admin.${keyof typeof routes.admin}`;

// Enhanced route helper with better error handling
export const safeRoute = (name: RouteName, params?: Record<string, any>): string => {
    try {
        return route(name, params);
    } catch (error) {
        console.warn(`Route "${name}" not found, falling back to name`);
        return name;
    }
};
