import { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest){
    // jwtVerify() Verifica se existe um token JWT no Headers da requisição e se é um token válido, se não retorna um erro;
    await request.jwtVerify();
}