import { CoursesGrid, mockCourses } from '../../core/components/common/pages/Course';
import { Layout } from '../../layout/layout';

export const CursosPage = () => {
	return (
		<Layout>
			<main className='bg-gradient-to-br from-emerald-50 to-blue-50 min-h-[calc(100vh-4rem)]'>
				<div className='container mx-auto px-10 md:px-15 pt-10 md:pt-10 pb-25'>
					<div className='text-center mb-10'>
						<h1 className='text-4xl font-bold text-gray-800'>NUESTROS CURSOS</h1>
						<div className='w-24 h-1 bg-emerald-600 mx-auto mt-4' />
						<p className='text-lg text-gray-600 mt-6 max-w-2xl mx-auto'>
							Descubre nuestra amplia gama de cursos de fitness y nutrición diseñados para todos los niveles
						</p>
					</div>
					<CoursesGrid courses={mockCourses} />
				</div>
			</main>
		</Layout>
	);
};