import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      toast({ title: "Erreur", description: "Identifiants invalides", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <GraduationCap className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-bold mb-4">IGA Learn</h1>
          <p className="text-primary-foreground/70 max-w-sm">Votre plateforme d'apprentissage en ligne pour réussir avec excellence.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-accent" />
            <span className="font-heading font-bold text-xl">IGA Learn</span>
          </div>

          <h2 className="font-heading text-2xl font-bold mb-2">Connexion</h2>
          <p className="text-muted-foreground mb-8">Entrez vos identifiants pour accéder à la plateforme.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                placeholder="votre@email.ma" required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition pr-10"
                  placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Comptes de test :</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>student@iga.ma</span><span>teacher@iga.ma</span>
              <span>moderator@iga.ma</span><span>admin@iga.ma</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">(n'importe quel mot de passe)</p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="text-accent hover:underline">← Retour à l'accueil</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
