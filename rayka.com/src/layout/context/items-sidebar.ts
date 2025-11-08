import {
    Settings,
    Image,
    UserCheck,
    Book,
    Building,
    ClipboardCheck,
    Hand,
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
        titulo: 'Cursos',
        icon: Book,
        link: '/administrator/cursos' 
    },
    {
        titulo: 'Empresa',
        icon: Building,
        link: '/administrator/empresa'  
    },
    {
        titulo: 'Capacitación',
        icon:   ClipboardCheck,
        link: '/administrator/capacitacion'  
    },
    {
        titulo: 'Solicitantes',
        icon:   Hand,
        link: '/administrator/solicitantes'  
    },
    
];
