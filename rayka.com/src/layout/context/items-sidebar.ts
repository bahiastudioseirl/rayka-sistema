import {
    Settings,
    Image,
    UserCheck,
    type LucideIcon
} from 'lucide-react';

export interface MenuItem {
    titulo: string;
    icon: LucideIcon;
    link?: string; 
    subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
    titulo: string;
    link: string;
    icon: LucideIcon;
}

export const menuItems: MenuItem[] = [
    
    {
        titulo: 'Gestión de Contenido',
        icon: Settings,
        subMenu: [
            {
                titulo: 'Banners',
                link: '/administrator/banners',
                icon: Image,
            },
            {
                titulo: 'Profesores',
                link: '/administrator/profesores',
                icon: UserCheck,
            },
        ],
    },
];
