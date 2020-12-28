import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const authConfig = require('../config/auth.json');

export function authMiddleware(request: Request, response: Response, next: NextFunction) {

    const authHeader = request.headers.authorization;

    if (!authHeader) return response.status(401).send("Token não informado");

    const parts = authHeader.split(' ');
    
    if (parts.length != 2) return response.status(401).send("Formato de token invalido (no 2 parts)");
    
    const scheme: string = parts[0];
    const token: string = parts[1];

    if (!/^Bearer$/i.test(scheme)) return response.status(401).send("Formato de token invalido");

    jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
        if (err) return response.status(401).send("Token invalido ou expirado");

        request.params.userId = decoded.id
        return next();
    })
}
