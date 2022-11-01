import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['query']
});

async function bootstrap(){
	const fastify = Fastify({
		logger: true,
	})

	fastify.get('/pools/count', async () => {
		// findMany retorna todos os registros da tabela;
		// const pools = await prisma.pool.findMany({
		// 	where: {
		// 		code: {
		// 			startsWith: 'D'
		// 		}
		// 	}
		// })

		// return { pools };

		// count() retorna apenas a aquiatidade;
		const count = await prisma.pool.count()
		return { count }
	});

	await fastify.listen({ port: 3333});
};


bootstrap();