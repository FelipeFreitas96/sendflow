import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register } from "../services/auth.service";
import { translateFirebaseError } from "../../../services/error-translations";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/card";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("As senhas não coincidem");
    }
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-[400px] border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-black tracking-widest text-primary font-exo">
            SendFlow
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Crie sua conta para começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-white/10"
              />
            </div>
            <Button
              className="w-full h-11 text-base font-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Criando Conta..." : "Registrar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <RouterLink
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Entrar
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
