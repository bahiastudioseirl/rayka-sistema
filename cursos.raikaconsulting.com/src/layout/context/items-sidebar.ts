import {
    Settings,
    UserCheck,
    Book,
    Building,
    ClipboardCheck,
    Hand,
    BookOpen,
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
        icon: ClipboardCheck,
        link: '/administrator/capacitacion'
    },
    {
        titulo: 'Solicitantes',
        icon: Hand,
        link: '/administrator/solicitantes'
    },
     {
        titulo: 'Exámenes',
        icon: BookOpen,
        link: '/administrator/examenes'
    },

    {
        titulo: 'Usuario',
        icon: UserCheck,
        subMenu: [
            {
                titulo: 'Administrador',
                link: '/administrator/usuarios/administrador',
                icon: Settings,
            },
            {
                titulo: 'Usuarios',
                link: '/administrator/usuarios/listado',
                icon: UserCheck,
            },
        ],
    },

];
