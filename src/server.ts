import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['query']
});

async function bootstrap(){
	const fastify = Fastify({
		logger: true,
	});

	await fastify.register(cors, {
		// caso tenha o domíno do front end, passo no lugar de true 'www.front.com.br'
		origin: true,
	});


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

	await fastify.listen({ port: 3333, host: '0.0.0.0'});
};


bootstrap();