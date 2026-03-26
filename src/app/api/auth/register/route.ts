import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().trim().email("Endereco de email invalido.").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Ja existe uma conta com este email." },
        { status: 409 }
      );
    }

    const password = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password
      }
    });

    return NextResponse.json(
      {
        message: "Conta criada com sucesso.",
        user: {
          id: user.id,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message ?? "Dados invalidos." },
        { status: 400 }
      );
    }

    console.error("Erro ao registrar usuario:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
