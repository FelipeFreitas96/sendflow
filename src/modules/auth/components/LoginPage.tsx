import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login } from "../services/auth.service";
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

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
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
            Bem-vindo de volta! Por favor, insira seus dados.
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
            <Button
              className="w-full h-11 text-base font-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <RouterLink
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
