import fetch from 'node-fetch';
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from '../plugins/authenticate';

export async function authRoutes(fastify: FastifyInstance){
    // Validação do JWT, está rota deve retornar os dados do user logado, atravez do token gerando pelo JWT;
    // Antes da rota '/me' for executada ele vai executar o "onRequest: [authenticate]" que contém o jwtVerify();
    fastify.get('/me', { onRequest: [authenticate] }, async (req, res) => {

        return { user: req.user };
    })

    fastify.post('/users', async (req) => {
        // Espero que no body da requisição, tenha o access_token que é uma string obrigatória
        const createUserBody = z.object({
            access_token: z.string(),
        })

        const { access_token } = createUserBody.parse(req.body);

        // Comunicação com API do Google Infos do Login;
        // rota que retorna dados do user logado;
        const userResponese = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer  ${access_token}`,
            }
        })

        // retorno das informações do user;
        const userData = await userResponese.json();

        // mapeando somente as informações que vamos usar no front;
        const userInfoShema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        });

        const userInfo = userInfoShema.parse(userData);

        // Vou tentar encontrar um "user" que existe, em que o googleId seja igual ao userInfo.id do "user";
        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })
        //Se o user não existir, vou criar o user;
        if(!user){
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }

        //Gerar token para o user, e escolhemos o que queremos recuparar depois no payload;
        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            // Configurações do token com tempo de expirarção dele e outros;
            sub: user.id,
            expiresIn: '7 days',
        })
        
        return { token };
    });
}