import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';


export async function poolRoutes(fastify: FastifyInstance){
    // contagem de bolões
    // findMany retorna todos os registros da tabela;
    // const pools = await prisma.pool.findMany({
        // 	where: {
            // 		code: {
                // 			startsWith: 'D'
                // 		}
                // 	}
                // })
                
                // return { pools };
                
    fastify.get('/pools/count', async () => {
        // count() retorna apenas a aquiatidade;
        const count = await prisma.pool.count()
        return { count }
    });


    // Retorna o bolão, com o nome do bolão recebido;
	fastify.post('/pools', async (req, response) => {
		const createPoolBody = z.object({
			title: z.string(),
		})
		const { title } = createPoolBody.parse(req.body);

		const generate = new ShortUniqueId({ length: 6 });
		const code = String(generate()).toUpperCase();

		await prisma.pool.create({
			data: {
				title,
				code,
			}
		});

		return response.status(201).send({code});
	});
}